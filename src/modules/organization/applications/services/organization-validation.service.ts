import { APIError } from 'better-auth/api';
import { organizationRepository } from '../../infrastructure/organization.repository';
import { organizationMemberRepository } from '../../infrastructure/organization-member.repository';

export class OrganizationValidationService {
  /**
   * Validate organization existence and status before credential verification.
   */
  async validateOrganizationBeforeAuth(slug: string) {
    if (!slug) {
      throw new APIError('BAD_REQUEST', {
        message: 'Organization slug is required.',
      });
    }

    const organization = await organizationRepository.findBySlug(slug);

    if (!organization) {
      throw new APIError('BAD_REQUEST', {
        message: 'Organization not found.',
      });
    }

    if (organization.status !== 'ACTIVE') {
      throw new APIError('BAD_REQUEST', {
        message: 'This organization is currently inactive.',
      });
    }

    return organization;
  }

  /**
   * Validate user organization membership and member status after credential verification.
   */
  async validateMemberAfterAuth(organizationSlug: string, userId: string) {
    const organization =
      await organizationRepository.findBySlug(organizationSlug);

    if (!organization || organization.status !== 'ACTIVE') {
      throw new APIError('BAD_REQUEST', {
        message: !organization
          ? 'Organization not found.'
          : 'This organization is currently inactive.',
      });
    }

    const member = await organizationMemberRepository.findMember(
      organization.id,
      userId,
    );

    if (!member || member.deletedAt !== null) {
      throw new APIError('BAD_REQUEST', {
        message: `This email is not associated with ${organization.name}.`,
      });
    }

    if (member.status !== 'ACTIVE') {
      throw new APIError('BAD_REQUEST', {
        message: 'Your account is inactive. Please contact your administrator.',
      });
    }

    return member;
  }
}

export const organizationValidationService =
  new OrganizationValidationService();
