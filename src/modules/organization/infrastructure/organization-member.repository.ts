import { prisma } from '@/lib/db';

export class OrganizationMemberRepository {
  async findMember(organizationId: string, userId: string) {
    return prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      select: {
        id: true,
        organizationId: true,
        userId: true,
        status: true,
        deletedAt: true,
      },
    });
  }

  /**
   * One-user-one-organization: returns the user's single ACTIVE membership
   * (not soft-deleted) together with its organization. Used wherever we need
   * to resolve "which org does this user currently belong to" without a slug.
   */
  async findActiveMembershipByUserId(userId: string) {
    return prisma.organizationMember.findFirst({
      where: {
        userId,
        deletedAt: null,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'asc' },
      include: {
        organization: true,
      },
    });
  }

  /**
   * One-user-one-organization: returns any current membership a user has that
   * should count as "already belongs to an organization" — i.e. a live
   * (non-deleted) membership that is PENDING or ACTIVE. Used by the
   * invitation-acceptance flow to reject creating a second membership BEFORE
   * hitting the database partial unique index.
   */
  async findLiveMembershipByUserId(userId: string) {
    return prisma.organizationMember.findFirst({
      where: {
        userId,
        deletedAt: null,
        status: { in: ['PENDING', 'ACTIVE'] },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}

export const organizationMemberRepository = new OrganizationMemberRepository();
