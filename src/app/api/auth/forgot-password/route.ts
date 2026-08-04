import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { deliverResetPasswordEmail } from '@/lib/email/reset-password';
import { EmailDeliveryError } from '@/lib/email/mailer';
import { rateLimit } from '@/lib/security/rate-limit';

const resetPasswordTokenTtlSeconds = 60 * 60; // 1 hour, matches auth config

const requestSchema = z.object({
  email: z.string().trim().email(),
});

function json(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export async function POST(req: Request) {
  // 1. Parse + validate email (client-side also validates; this is server-side backstop).
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json('Invalid request.', 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return json('Please enter a valid email address.', 400);
  }

  const email = parsed.data.email.toLowerCase();

  // 2. Rate limiting on repeated reset requests (per email + per IP).
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  const perEmail = rateLimit(`forgot:${email}`, 3, 15 * 60 * 1000);
  const perIp = rateLimit(`forgot-ip:${ip}`, 5, 15 * 60 * 1000);

  if (!perEmail.allowed || !perIp.allowed) {
    return json(
      'Too many reset requests. Please wait a few minutes and try again.',
      429,
    );
  }

  // 3. Email must be registered AND belong to a user with an active membership.
  const user = await prisma.user.findUnique({
    where: { email },
  });

  const membership = user
    ? await prisma.organizationMember.findFirst({
        where: {
          userId: user.id,
          deletedAt: null,
          status: 'ACTIVE',
        },
      })
    : null;

  if (!user || !membership) {
    return json('The email you entered is not registered.', 404);
  }

  // 4. Create the reset token + verification value (reads `reset-password:<token>`).
  const token = randomBytes(24).toString('base64url');

  const ctx = await auth.$context;
  await ctx.internalAdapter.createVerificationValue({
    value: user.id,
    identifier: `reset-password:${token}`,
    expiresAt: new Date(Date.now() + resetPasswordTokenTtlSeconds * 1000),
  });

  // 5. Send the email. SMTP failure is distinct from "not registered".
  try {
    await deliverResetPasswordEmail(user.id, user.email, token);
  } catch (error) {
    console.error('Failed to send reset password email:', error);
    if (error instanceof EmailDeliveryError) {
      return json(
        'We could not send the reset email right now. Please try again shortly.',
        503,
      );
    }
    return json('Something went wrong. Please try again.', 500);
  }

  return json('A password reset link has been sent to your email.', 200);
}
