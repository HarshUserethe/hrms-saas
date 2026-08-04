-- One-user-one-organization enforcement.
--
-- Why a partial unique index (and NOT a plain @@unique([userId])):
--   OrganizationMember uses soft deletes (deleted_at) and a status enum.
--   A plain unique constraint on user_id would permanently lock a user to
--   their very first organization: after they leave (status REMOVED/INACTIVE
--   or deleted_at set) the historical row still exists, so they could never
--   join another organization.
--
-- The partial unique index only guarantees uniqueness for rows that are
-- considered "current": NOT soft-deleted AND in a live status (PENDING =
-- invited but not yet joined, ACTIVE = joined). Rows that are soft-deleted or
-- in a terminal status (INACTIVE/SUSPENDED/REMOVED) are excluded from the
-- uniqueness scope, so a former member can freely join a new organization.
--
-- Column names below use the raw snake_case column names from
-- prisma/schema.prisma (organization_members table, user_id, deleted_at).

CREATE UNIQUE INDEX "organization_members_one_active_per_user_idx"
  ON "organization_members" ("user_id")
  WHERE "deleted_at" IS NULL
    AND "status" IN ('PENDING', 'ACTIVE');
