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

  // Always render children so the fiber tree structure stays stable across
  // the isLoading transition. Swapping the entire subtree (loading div ↔
  // children) confuses React DevTools' fiber-tracking algorithm and triggers
  // an internal assertion: "children should not have changed if we pass in
  // the same set". An overlay keeps the tree consistent.
  return (
    <div style={{ position: 'relative' }}>
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
          }}
          aria-label="Loading"
        >
          {/* Replace with <FullPageLoader /> when available */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '3px solid #e2e8f0',
              borderTopColor: '#3b82f6',
              animation: 'auth-spin 0.7s linear infinite',
            }}
          />
          <style>{`@keyframes auth-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {children}
    </div>
  );
}
