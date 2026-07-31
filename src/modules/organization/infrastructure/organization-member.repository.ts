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
}

export const organizationMemberRepository = new OrganizationMemberRepository();
