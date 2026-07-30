import type { CurrentUserResponse } from '@/types/auth/me.types';
//frontend services--->
export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await fetch('/api/me', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user.');
  }

  return response.json();
}
