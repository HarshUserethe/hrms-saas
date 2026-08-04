import { prisma } from '@/lib/db';

export async function findCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    include: {
      memberships: {
        where: {
          deletedAt: null,
          status: 'ACTIVE',
        },
        orderBy: { createdAt: 'asc' },
        take: 1,

        include: {
          organization: true,

          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}
