import { organizationMemberRepository } from '@/modules/organization/infrastructure/organization-member.repository';
import { EmailDeliveryError, sendResetPasswordEmail } from './mailer';

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

/**
 * Resolves a user's single ACTIVE organization membership (guaranteed unique by
 * the one-user-one-organization constraint) and sends the reset-password email
 * with a tenant-aware link: `${BASE_URL}/${slug}/reset-password?token=...`.
 */
export async function deliverResetPasswordEmail(
  userId: string,
  email: string,
  token: string,
): Promise<void> {
  const membership =
    await organizationMemberRepository.findActiveMembershipByUserId(userId);

  if (!membership) {
    throw new EmailDeliveryError(
      'No active organization membership found for this user.',
    );
  }

  const resetUrl = `${DEFAULT_BASE_URL}/${membership.organization.slug}/reset-password?token=${token}`;

  await sendResetPasswordEmail(email, resetUrl, membership.organization.name);
}
