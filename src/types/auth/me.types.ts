export interface CurrentUserResponse {
  user: CurrentUserDto;
  organization: OrganizationDto;
  member: OrganizationMemberDto;
  roles: RoleDto[];
  permissions: string[];
}

export interface CurrentUserDto {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  status: string;
  emailVerified: boolean;
}

export interface OrganizationDto {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  subscriptionPlan: string;
  subscriptionStatus: string;
}

export interface OrganizationMemberDto {
  id: string;
  employeeId: string | null;
  joiningDate: Date | null;
  employmentStatus: string;
}

export interface RoleDto {
  id: string;
  name: string;
  isSystem: boolean;
}
