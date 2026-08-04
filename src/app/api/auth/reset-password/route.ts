import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // bcrypt limit

const requestSchema = z.object({
  token: z.string().min(1, 'Reset token is required.'),
  newPassword: z.string().min(1, 'Password is required.'),
});

function validatePasswordStrength(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}

function json(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json('Invalid request.', 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return json('Invalid request. Please try again.', 400);
  }

  const { token, newPassword } = parsed.data;

  if (!token) {
    return json(
      'This reset link is invalid or has already been used. Please request a new link.',
      400,
    );
  }

  const strengthError = validatePasswordStrength(newPassword);
  if (strengthError) {
    return json(strengthError, 400);
  }

  // Pre-check token to give distinct expired vs invalid/already-used messages.
  const identifier = `reset-password:${token}`;
  const verification = await prisma.verification.findFirst({
    where: { identifier },
  });

  if (!verification) {
    return json(
      'This reset link is invalid or has already been used. Please request a new link.',
      400,
    );
  }

  if (verification.expiresAt.getTime() < Date.now()) {
    return json('This reset link has expired. Please request a new link.', 400);
  }

  const userId = verification.value;
  const ctx = await auth.$context;

  try {
    await prisma.$transaction(async (tx) => {
      // Consume the token (single-use).
      const consumed = await tx.verification.deleteMany({
        where: { identifier },
      });
      if (consumed.count === 0) {
        throw new Error('TOKEN_ALREADY_USED');
      }

      const hashedPassword = await ctx.password.hash(newPassword);

      const credentialAccount = await tx.account.findFirst({
        where: { userId, providerId: 'credential' },
      });

      if (credentialAccount) {
        await tx.account.update({
          where: { id: credentialAccount.id },
          data: { password: hashedPassword },
        });
      } else {
        await tx.account.create({
          data: {
            id: randomUUID(),
            userId,
            providerId: 'credential',
            accountId: userId,
            password: hashedPassword,
          },
        });
      }

      // Revoke existing sessions + record change time.
      await tx.session.deleteMany({ where: { userId } });
      await tx.user.update({
        where: { id: userId },
        data: { passwordChangedAt: new Date() },
      });
    });
  } catch {
    // Token consumed by a concurrent request.
    return json(
      'This reset link is invalid or has already been used. Please request a new link.',
      400,
    );
  }

  return json('Your password has been reset. Please sign in.', 200);
}
