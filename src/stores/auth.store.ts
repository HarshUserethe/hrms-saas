import { create } from 'zustand';

import type {
  CurrentUserDto,
  OrganizationDto,
  OrganizationMemberDto,
  RoleDto,
  CurrentUserResponse,
} from '@/types/auth/me.types';

interface AuthState {
  // State
  user: CurrentUserDto | null;
  organization: OrganizationDto | null;
  member: OrganizationMemberDto | null;
  roles: RoleDto[];
  permissions: string[];

  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (data: CurrentUserResponse) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial State
  user: null,
  organization: null,
  member: null,
  roles: [],
  permissions: [],

  isAuthenticated: false,
  isLoading: true,

  // Actions
  setAuth: (data) =>
    set({
      user: data.user,
      organization: data.organization,
      member: data.member,
      roles: data.roles,
      permissions: data.permissions,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      organization: null,
      member: null,
      roles: [],
      permissions: [],
      isAuthenticated: false,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
}));
