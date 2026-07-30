import { findCurrentUser } from '@/repository/auth/me.repository';
import { CurrentUserResponse } from '@/types/auth/me.types';

export async function getCurrentUser(
  userId: string,
): Promise<CurrentUserResponse> {
  const user = await findCurrentUser(userId);

  if (!user) {
    throw new Error('User not found.');
  }

  const membership = user.memberships[0];

  if (!membership) {
    throw new Error('Organization membership not found.');
  }

  const roles = membership.userRoles.map((userRole) => userRole.role);

  const permissions = [
    ...new Set(
      roles.flatMap((role) =>
        role.rolePermissions.map(
          (rolePermission) => rolePermission.permission.code,
        ),
      ),
    ),
  ];

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      status: user.status,
      emailVerified: user.emailVerified,
    },

    organization: {
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      logoUrl: membership.organization.logoUrl,
      subscriptionPlan: membership.organization.subscriptionPlan,
      subscriptionStatus: membership.organization.subscriptionStatus,
    },

    member: {
      id: membership.id,
      employeeId: null, // Add when Employee module is implemented
      joiningDate: membership.joinedAt,
      employmentStatus: membership.status,
    },

    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
      isSystem: role.isSystem,
    })),

    permissions,
  };
}
