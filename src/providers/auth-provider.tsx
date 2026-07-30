'use client';

import { ReactNode, useEffect } from 'react';

import { getCurrentUser } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth.store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        const currentUser = await getCurrentUser();

        setAuth(currentUser);
      } catch {
        // User is not authenticated or session expired.
        // This is an expected scenario.
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth, clearAuth, setLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
    // Later replace with:
    // return <FullPageLoader />;
  }

  return <>{children}</>;
}
