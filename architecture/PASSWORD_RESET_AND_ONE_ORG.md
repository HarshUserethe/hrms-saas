# 🔐 HRMS SaaS — One-User-One-Organization + Resetting Password Architecture

> A complete, developer-friendly guide explaining **what was implemented**, **how the reset-password feature is built**, **how it works**, and — most importantly — **exactly what happens in which file** as a user goes through the flow. Written for every developer from beginner to senior.

---

## 📋 Table of Contents

1. [What Was Done (High Level)](#1-what-was-done-high-level)
2. [Project Relevance — The Feature This Relies On](#2-project-relevance--the-feature-this-relies-on)
   - [One-User-One-Organization Constraint](#one-user-one-organization-constraint)
   - [Why Reset-Password Depends On It](#why-reset-password-depends-on-it)
3. [The Database Migration (Part 1)](#3-the-database-migration-part-1)
   - [The Problem With a Plain Unique Constraint](#the-problem-with-a-plain-unique-constraint)
   - [The Partial Unique Index Approach](#the-partial-unique-index-approach)
   - [The Migration SQL](#the-migration-sql)
4. [The Full Reset-Password Flow — Step by Step](#4-the-full-reset-password-flow--step-by-step)
   - [Visual Flow Overview](#visual-flow-overview)
   - [Step 0 — The Login Page Link](#step-0--the-login-page-link)
   - [Step 1 — Forgot Password Page](#step-1--forgot-password-page)
   - [Step 2 — The Forgot-Password API Route](#step-2--the-forgot-password-api-route)
   - [Step 3 — Resolving the Tenant + Sending Email](#step-3--resolving-the-tenant--sending-email)
   - [Step 4 — The Reset-Password Page](#step-4--the-reset-password-page)
   - [Step 5 — The Reset-Password API Route](#step-5--the-reset-password-api-route)
   - [Step 6 — Success + Redirect](#step-6--success--redirect)
5. [File-by-File Reference](#5-file-by-file-reference)
   - [New Files](#new-files)
   - [Modified Files](#modified-files)
   - [Reused (Unchanged) Files](#reused-unchanged-files)
6. [Error Handling Matrix](#6-error-handling-matrix)
7. [Security Considerations](#7-security-considerations)
8. [Environment Variables](#8-environment-variables)
9. [Testing Checklist](#9-testing-checklist)
10. [Common Questions (FAQ)](#10-common-questions-faq)

---

## 1. What Was Done (High Level)

Two related pieces of work were delivered:

| Scope                                  | What                                                                                                                                                                                              | Why                                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Part 1 — One-User-One-Organization** | A **database-level partial unique index** plus application-layer guard queries so that **each user belongs to exactly one organization at a time**.                                               | Matches real HRMS employment (one person = one active job). It also enables Part 2.                          |
| **Part 2 — Reset Password**            | A **full forget/reset password flow** for the `[slug]` tenant URLs, built on BetterAuth + Nodemailer, with **tenant-aware links** and **distinct, human-readable errors** for every failure case. | Users can recover their password without knowing which org they belong to (the system resolves it for them). |

The golden rule that ties them together:

> ✨ Because each user has **at most one active membership**, we can resolve _which tenant a user belongs to_ from their email alone — without asking the client to pass an org slug.

---

## 2. Project Relevance — The Feature This Relies On

### One-User-One-Organization Constraint

In the original schema, a `User` could appear in many `OrganizationMember` rows (one per org). While the app already _tended_ toward one org per user (e.g. `me.service.ts` read `memberships[0]`), there was **no enforcement**. Nothing stopped the same email from being an active member of two companies.

The change makes that **impossible at the database layer**:

```
User (1) ───────┼────── (1) Organization        ← enforced (at most one LIVE)
                │
          OrganizationMember (the "join" row)
```

### Why Reset-Password Depends On It

When a user forgets their password they enter **only their email**. The email must be converted into:

```
email  →  user  →  their ONE active membership  →  that Organization's slug
        →  https://BASE_URL/{slug}/reset-password?token=...
```

Without the one-org guarantee, "the user's organization" is ambiguous. With it, resolution is deterministic and correct.

---

## 3. The Database Migration (Part 1)

### The Problem With a Plain Unique Constraint

The obvious fix — `@@unique([userId])` — is **wrong** here. `OrganizationMember` does **not hard-delete rows**:

- It soft-deletes via `deletedAt` (nullable).
- It records membership lifecycle via a `status` enum: `PENDING`, `ACTIVE`, `INACTIVE`, `SUSPENDED`, `REMOVED`.

A plain unique on `user_id` would treat _every ever-existing row_ as blocking. After a user leaves an org (their row becomes `REMOVED`/soft-deleted but still exists), they could **never join another org** again. That is incorrect.

### The Partial Unique Index Approach

Prisma's schema DSL can't express "partial" (filtered) indexes, so we add it via a **hand-written raw-SQL migration**. The index only enforces uniqueness on rows that are **currently "live"**:

| Condition                                                 | Included in uniqueness scope?                     |
| --------------------------------------------------------- | ------------------------------------------------- |
| `deleted_at IS NULL` AND `status IN ('PENDING','ACTIVE')` | ✅ **Yes** — a user can have at most one of these |
| soft-deleted (`deleted_at NOT NULL`)                      | ❌ No — historical, free to re-join elsewhere     |
| `status IN ('INACTIVE','SUSPENDED','REMOVED')`            | ❌ No — terminal, user can join anew              |

### The Migration SQL

Location: `prisma/migrations/20260804191944_one_user_one_org/migration.sql`

```sql
CREATE UNIQUE INDEX "organization_members_one_active_per_user_idx"
  ON "organization_members" ("user_id")
  WHERE "deleted_at" IS NULL
    AND "status" IN ('PENDING', 'ACTIVE');
```

Applied with `npx prisma migrate deploy` and verified:

```sql
-- Verified result (PostgreSQL index definition)
CREATE UNIQUE INDEX organization_members_one_active_per_user_idx
  ON public.organization_members USING btree (user_id)
  WHERE ((deleted_at IS NULL) AND
         (status = ANY (ARRAY['PENDING'::"OrganizationMemberStatus",
                              'ACTIVE'::"OrganizationMemberStatus"])))
```

> **Pre-migration safety check:** before applying, a read-only query confirmed **no user already had** two live memberships (15 rows, all `ACTIVE`, none soft-deleted → zero conflicts).

---

## 4. The Full Reset-Password Flow — Step by Step

### Visual Flow Overview

```
┌──────────────┐     /{slug}/login         ┌───────────────────┐
│ Login Page   │ ══▶ "Forgot password?" ══▶│ Forgot-Password   │
└──────────────┘                            │ Page (server)     │
                                            └─────────┬─────────┘
                                                      │ renders client form
                                                      ▼
                                            ┌───────────────────┐
                                            │ ForgotPasswordForm│ (client)
                                            │  --- email only ---│
                                            └─────────┬─────────┘
                                                      │ POST /api/auth/forgot-password
                                                      ▼
┌───────────────────────────────────────────────────────────────┐
│ FORGOT-PASSWORD API ROUTE (server)                            │
│ 1. validate email format          (Zod)                       │
│ 2. rate limit (email + IP)                                    │
│ 3. find user + require ACTIVE membership  → "not registered"  │
│ 4. generate token + store Verification row                    │
│ 5. resolve org slug + build tenant URL                        │
│ 6. send via Nodemailer            (SMTP errors → 503 distinct)│
└───────────────────────────────┬───────────────────────────────┘
                                │ email delivered (test: ogvermax@gmail.com)
                                ▼
                     Link: {BASE_URL}/{slug}/reset-password?token=XYZ
                                │ user clicks
                                ▼
┌──────────────────────────────────────────────────────────┐
│ RESET-PASSWORD PAGE (server)                             │
│ - token missing  →  "invalid link" state (no form)       │
│ - token present  →  render ResetPasswordForm(token)      │
└───────────────────────────────┬──────────────────────────┘
                                │ POST /api/auth/reset-password
                                ▼
┌──────────────────────────────────────────────────────────┐
│ RESET-PASSWORD API ROUTE (server)                        │
│ 1. validate token + password strength                    │
│ 2. check Verification row: expired vs invalid/used       │
│ 3. consume token (single-use)                            │
│ 4. hash new password, update credential Account          │
│ 5. revoke existing sessions                              │
└───────────────────────────────┬──────────────────────────┘
                                │ success
                                ▼
                 success message + auto-redirect to /{slug}/login (~2s)
```

---

### Step 0 — The Login Page Link

**Files involved:** `src/modules/login/components/login-form.tsx`

The login form shows a **"Forgot password?"** link that routes the user to:

```
/{organization.slug}/forgot-password
```

It uses the org slug already known on the login page (the tenant context the user is already browsing).

---

### Step 1 — Forgot Password Page

**Files involved:** `src/app/(auth)/[slug]/forgot-password/page.tsx` (server component)

- Reads `[slug]` from the URL.
- Calls `getOrganizationBySlug(slug)`.
  - Invalid / non-existent / inactive slug → `notFound()` → renders the tenant 404 page. ✅ _Handles the "invalid/nonexistent tenant slug" error case._
- Renders `<ForgotPasswordForm organization={...} />` inside the shared login layout.

---

### Step 2 — The Forgot-Password API Route

**File:** `src/app/api/auth/forgot-password/route.ts` — `POST`

This is a server Route Handler. Let's follow its logic top to bottom:

```ts
// 1) Parse + validate the body with Zod
{ email: string }            → invalid => 400 "Please enter a valid email address."

// 2) Rate limit two dimensions (in-memory sliding window)
perEmail: "forgot:{email}"       → 3 / 15 min
perIp:    "forgot-ip:{ip}"        → 5 / 15 min
                                  → denied => 429 "Too many reset requests…"

// 3) Email must be registered AND have an active membership
findUnique user by email            ❌ null  → 404 "The email you entered is not registered."
findFirst active OrganizationMember ❌ null  → 404 (same message)

// 4) Create the reset token + Verification row
token   = randomBytes(24).toString('base64url')
identifier = `reset-password:${token}`
value      = userId
expiresAt  = now + 1 hour
stored via auth.$context.internalAdapter.createVerificationValue(...)

// 5) Send the email (SMTP failure is DISTINCT from "not registered")
deliverResetPasswordEmail(userId, email, token)
    on EmailDeliveryError  → 503 "We could not send the reset email right now…"
    on other error         → 500  (generic)

// 6) Success
→ 200 "A password reset link has been sent to your email."
```

> The `Verification` row is what BetterAuth's reset mechanism (and our own reset route) later reads. Keying it as `reset-password:{token}` keeps it compatible with BetterAuth's conventions.

---

### Step 3 — Resolving the Tenant + Sending Email

**Files involved:**

- `src/lib/email/reset-password.ts` (new) — the resolver
- `src/lib/email/mailer.ts` (reused) — the Nodemailer sender
- `src/lib/auth.ts` — BetterAuth `sendResetPassword` callback

`deliverResetPasswordEmail(userId, email, token)`:

```ts
// 1) Resolve the user's ONE active membership + its org
const membership =
  await organizationMemberRepository.findActiveMembershipByUserId(userId);
//   → throws EmailDeliveryError if there is no active org (value: "no org")

// 2) Build the TENANT-AWARE reset URL
const resetUrl = `${BASE_URL}/${membership.organization.slug}/reset-password?token=${token}`;
//   example: http://localhost:3000/xyz-company/reset-password?token=…

// 3) Send it
await sendResetPasswordEmail(email, resetUrl, membership.organization.name);
```

`sendResetPasswordEmail(...)` inside `mailer.ts`:

- Configures the Nodemailer transporter from `SMTP_*` env vars.
- **Hardcoded test recipient** `ogvermax@gmail.com` (marked `// TODO: remove hardcoded test recipient`) while the real recipient remains available as `toEmail` — a one-line swap later.
- Wraps `transporter.sendMail` in `try/catch` and throws `EmailDeliveryError` so SMTP problems are never mistaken for "email not registered".

BetterAuth's `sendResetPassword` callback (in `src/lib/auth.ts`) delegates to the exact same `deliverResetPasswordEmail`, so the tenant resolution also works if BetterAuth's own endpoint is hit.

---

### Step 4 — The Reset-Password Page

**File:** `src/app/(auth)/[slug]/reset-password/page.tsx` (server component)

```tsx
const token = searchParams.token;

// ✅ Token present  → render <ResetPasswordForm organization token={token} />
// ❌ Token missing  → render a dedicated "Invalid Link" state (NO form)
```

- The **invalid link state** shows a friendly "This password reset link is missing or invalid…" message plus a **"Request a new link"** button back to `/{slug}/forgot-password`.
- If a token exists, the client form is rendered.

---

### Step 5 — The Reset-Password API Route

**File:** `src/app/api/auth/reset-password/route.ts` — `POST`

```ts
// 1) Validate body
{ token, newPassword }          → invalid => 400

// 2) Password strength (client + server)
8 ≤ length ≤ 72                 → else 400 strength message
must contain a letter AND a digit → else 400 strength message

// 3) Pre-check the token for DISTINCT messages
verification = findFirst Verification where identifier = `reset-password:${token}`
   ❌ not found  → 400 "invalid or has already been used"
   ❌ expired    → 400 "expired", request a new link

// 4) Consume + apply, in a single transaction
   - delete Many Verification (consume → single-use)
     - if nothing deleted → token already used (concurrent) → 400
   - hash the new password (auth.$context.password.hash)
   - update the user's "credential" Account password (or create if missing)
   - delete the user's existing sessions (force re-login everywhere)
   - set passwordChangedAt = now

// 5) Success
→ 200 "Your password has been reset. Please sign in."
```

> Because the Verification row is deleted when consumed, re-using the same URL afterwards returns the "invalid or already used" message. Because we check `expiresAt` ourselves _before_ consuming (BetterAuth's own consume step does **not** check expiry), we can correctly distinguish **expired** from **invalid/used**.

---

### Step 6 — Success + Redirect

**File:** `src/components/auth/ResetPasswordForm.tsx`

- On a `200` response it sets a **success message**.

⏱️ Then a `useEffect` watches `success`:

```ts
useEffect(() => {
  if (!success) return;
  const timer = setTimeout(() => router.push(`/${slug}/login`), 2000);
  return () => clearTimeout(timer);
}, [success, slug, router]);
```

- The user is **auto-redirected to the tenant login page after ~2 seconds**, where they sign in with the new password.

---

## 5. File-by-File Reference

### New Files

| File                                                                                          | Role                                                                                                                                                     |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prisma/migrations/20260804191944_one_user_one_org/migration.sql`                             | **Part 1** — partial unique index enforcing at-most-one live membership per user.                                                                        |
| `src/modules/organization/infrastructure/organization-member.repository.ts` _(added methods)_ | `findActiveMembershipByUserId` → the user's single ACTIVE org (used to resolve tenant). `findLiveMembershipByUserId` → guard for future invitation flow. |
| `src/app/api/auth/forgot-password/route.ts`                                                   | Server API: validate → rate-limit → membership check → create token → send email.                                                                        |
| `src/app/api/auth/reset-password/route.ts`                                                    | Server API: token + strength validation → expiry/used check → consume → update password → revoke sessions.                                               |
| `src/lib/email/reset-password.ts`                                                             | Resolves the user's one active org, builds the `{slug}/reset-password?token=…` URL, sends via Nodemailer.                                                |
| `src/lib/security/rate-limit.ts`                                                              | In-memory sliding-window limiter (per-email / per-IP).                                                                                                   |
| `src/lib/email/mailer.ts` _(pre-existing, reused)_                                            | Nodemailer transporter + `sendResetPasswordEmail` + `EmailDeliveryError`.                                                                                |

### Modified Files

| File                                                                                | What changed                                                                                        | Why                                                                                |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `src/modules/organization/infrastructure/organization-member.repository.ts`         | Added one-org query methods                                                                         | Resolve a user's single org; guard future invitations.                             |
| `src/modules/organization/applications/services/organization-validation.service.ts` | Added clarifying comment                                                                            | Documents the (already-correct) one-org sign-in validation.                        |
| `src/repository/auth/me.repository.ts`                                              | Definitions: `memberships` now filtered to `ACTIVE`, `take: 1`, ordered                             | Deterministic single-membership read; INACTIVE members now resolve to "not found". |
| `src/lib/auth.ts`                                                                   | Added `emailAndPassword.sendResetPassword` callback                                                 | Default path for reset emails using the org-resolver.                              |
| `src/components/auth/ForgotPasswordForm.tsx`                                        | Wired to `/api/auth/forgot-password`; distinct errors + **retry** option; disabled-while-submitting | Real API instead of mock delay.                                                    |
| `src/components/auth/ResetPasswordForm.tsx`                                         | Wired to `/api/auth/reset-password`; `token` prop; **auto-redirect ~2s**                            | Real API + post-reset navigation.                                                  |
| `src/app/(auth)/[slug]/reset-password/page.tsx`                                     | Invalid-link state when `token` missing                                                             | Don't render the form for a bad/missing token.                                     |
| `.env.example`                                                                      | Added `SMTP_HOST/PORT/USER/PASS/FROM` placeholders                                                  | Config for email delivery.                                                         |

### Reused (Unchanged) Files

| File                                                                                 | Role in this feature                                                          |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `src/app/(auth)/[slug]/forgot-password/page.tsx`                                     | Server page rendering the form (already existed; now backed by the real API). |
| `src/modules/login/components/login-form.tsx`                                        | Renders the **"Forgot password?"** link.                                      |
| `src/modules/organization/applications/services/get-organization-by-slug.service.ts` | Validates tenant slug → `notFound()` for bad/inactive slugs.                  |
| `src/lib/email/mailer.ts`                                                            | Nodemailer sender (ships to hardcoded test recipient `ogvermax@gmail.com`).   |
| `src/modules/login/components/login-page.tsx` + `LoginRight`                         | Shared auth-page layout used by forgot/reset pages.                           |

---

## 6. Error Handling Matrix

| Scenario                                    | Where caught                           | Message shown                                                                 |
| ------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| Invalid / empty email                       | Client `zod` (+ server Zod)            | "Invalid email address" / "Please enter a valid email address."               |
| Email not registered / no ACTIVE membership | forgot API → 404                       | "The email you entered is not registered."                                    |
| SMTP / email delivery failure               | forgot API → 503                       | "We could not send the reset email right now…" (distinct from not-registered) |
| Repeated requests (rate limited)            | forgot API → 429                       | "Too many reset requests. Please wait a few minutes…"                         |
| Generic / network / server error            | forgot form → retry flag               | "Network error… Please try again." + **"Try again" button**                   |
| Invalid/nonexistent tenant slug             | `getOrganizationBySlug` → `notFound()` | Rendered 404 page                                                             |
| Missing token                               | reset page (server)                    | "Invalid Link" state, **no form rendered**                                    |
| Invalid or already-used token               | reset API → 400                        | "This reset link is invalid or has already been used…"                        |
| Expired token                               | reset API → 400                        | "This reset link has expired…"                                                |
| Weak password                               | reset client + API → 400               | Strength requirements message                                                 |
| Passwords don't match                       | reset client `zod`                     | "Passwords do not match"                                                      |
| Double-submit                               | Both forms                             | Submit button disabled while `isSubmitting`                                   |

---

## 7. Security Considerations

- **Timing/Enumeration trade-off:** the forgot API returns "not registered" for unknown emails. This is an intentional product choice (tenant HRMS) — in a public-facing app you would always return a generic success to avoid account enumeration.
- **Single-use tokens:** the `Verification` row is deleted on successful use; re-use is rejected.
- **Session revocation:** after a successful reset, existing sessions are deleted, forcing re-authentication everywhere.
- **Rate limiting:** both per-email and per-IP limits reduce spamming and brute-force.
- **Distinct SMTP errors:** an SMTP failure is surfaced separately from "not registered", so support can tell them apart.
- **Server-side revalidation:** password strength and email format are re-checked on the server in addition to the client.
- ⚠️ **Known dev limitation:** the rate limiter is **in-memory** (per Node process, reset on restart, not shared across instances). Swap for Redis before horizontal scaling.

---

## 8. Environment Variables

| Variable               | Purpose                                                | Where read          |
| ---------------------- | ------------------------------------------------------ | ------------------- |
| `SMTP_HOST`            | SMTP server host                                       | `mailer.ts`         |
| `SMTP_PORT`            | SMTP port (default 587)                                | `mailer.ts`         |
| `SMTP_USER`            | SMTP auth user                                         | `mailer.ts`         |
| `SMTP_PASS`            | SMTP auth pass                                         | `mailer.ts`         |
| `SMTP_FROM`            | "From" address                                         | `mailer.ts`         |
| `NEXT_PUBLIC_BASE_URL` | Base of the app **used to build the tenant reset URL** | `reset-password.ts` |
| `BETTER_AUTH_SECRET`   | BetterAuth signing secret (already present)            | BetterAuth          |
| `DATABASE_URL`         | Postgres connection string (already present)           | `db.ts`             |

Add the `SMTP_*` placeholders to your `.env` (they are already documented in `.env.example`).

---

## 9. Testing Checklist

**Part 1 — One-User-One-Organization**

- [ ] Insert a second `ACTIVE` `OrganizationMember` for an existing user → **unique violation** at the DB.
- [ ] Soft-delete the user's membership → creating a new org membership succeeds.
- [ ] Sign-in at the correct org still works; sign-in as a non-member still rejected.
- [ ] `/api/me` returns one org with roles/permissions.

**Part 2 — Reset Password**

- [ ] `/{slug}/login` → "Forgot password?" → forgot page; bad slug → 404.
- [ ] Invalid/empty email → client error.
- [ ] Unknown email / no active membership → "The email you entered is not registered."
- [ ] Valid email → success; email lands in `ogvermax@gmail.com` with `{slug}/reset-password?token=…`.
- [ ] 4+ requests in 15 min → rate-limited message.
- [ ] Remove `?token=` from the email link → invalid-link state, no form.
- [ ] Weak / mismatched password → respective client + server messages.
- [ ] Valid reset → success + auto-redirect to `/{slug}/login` after ~2s.
- [ ] Reopen the same link → "invalid or already used."
- [ ] Manually expire the `Verification` row → "expired" message.
- [ ] Stop SMTP → valid email shows the 503 "could not send" message (not "not registered").

---

## 10. Common Questions (FAQ)

**Q: Why not just `@@unique([userId])`?**
Because memberships are soft-deleted. A plain unique index would lock a leaver out of ever joining another org. The partial index scopes uniqueness only to live (`PENDING`/`ACTIVE`, not-deleted) rows.

**Q: Why do I only type my email on the forgot page — how do you know my company?**
The one-user-one-organization constraint means your email maps to exactly one live membership, so the system finds your org and builds the right `/{slug}/reset-password` link for you.

**Q: My SMTP failed but it says something different to "not registered"?**
Yes — that's intentional. `EmailDeliveryError` → 503 is separate from the 404 "not registered". Check the server console for the actual SMTP error.

**Q: Why are the reset tokens checked for expiry manually if BetterAuth handles it?**
BetterAuth's reset endpoint consumes the token but does **not** check `expiresAt`. We pre-check expiry ourselves so we can show a distinct "expired" message.

**Q: I see `ogvermax@gmail.com` — is that intentional?**
Yes, temporarily. It's a hardcoded **test recipient** marked `// TODO: remove hardcoded test recipient`. Swap it back to `toEmail` once real SMTP is confirmed.
