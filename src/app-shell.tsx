'use client';

import { useState } from 'react';
import { Sidebar } from '@/sidebar';
import { Topbar } from '@/topbar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Sidebar for Desktop & Mobile Overlay */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-60">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
