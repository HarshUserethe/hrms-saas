'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarClock,
  Wallet,
  TrendingUp,
  FileText,
  Gift,
  Receipt,
  Calendar,
  Users,
  Megaphone,
  LifeBuoy,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from 'lucide-react';
import { useMemo } from 'react';
import { authClient } from './lib/auth-client';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { label: 'Leave', href: '/leave', icon: CalendarClock },
  { label: 'Payroll', href: '/payroll', icon: Wallet },
  { label: 'Performance', href: '/performance', icon: TrendingUp },
  { label: 'Calendar', href: '/calender', icon: Calendar },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Benefits', href: '/benefits', icon: Gift },
  { label: 'Reimbursements', href: '/reimbursements', icon: Receipt },
  { label: 'Directory', href: '/directory', icon: Users },
  { label: 'Announcements', href: '/announcements', icon: Megaphone },
  { label: 'Help & Support', href: '/help', icon: LifeBuoy },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const slug = useMemo(() => {
    const segments = pathname.split('/');
    return segments[1] || '';
  }, [pathname]);

  const isActive = (href: string) => pathname.includes(href);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = `/${slug}/login`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-slate-100 bg-white transition-transform duration-300 ease-in-out dark:border-slate-800/80 dark:bg-slate-900',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Brand Logo & Close button on Mobile */}
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <svg
                className="h-8 w-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="14"
                  cy="16"
                  r="10"
                  stroke="#0ea5e9"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle
                  cx="18"
                  cy="16"
                  r="10"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  fill="none"
                  strokeOpacity="0.85"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              ZenCorp
            </span>
          </div>

          {/* Mobile close icon */}
          <button
            onClick={() => setMobileOpen?.(false)}
            className="text-slate-400 hover:text-slate-600 lg:hidden dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav List */}
        <nav className="flex-1 scrollbar-none overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={`/${slug}${item.href}`}
                    onClick={() => setMobileOpen?.(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150',
                      active
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        active
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-400 dark:text-slate-500',
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Logout Bottom */}
        <div className="space-y-2 border-t border-slate-100 p-4 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                  alt="Sourav Sharma"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="truncate">
                <p className="truncate text-xs leading-tight font-bold text-slate-900 dark:text-white">
                  Sourav Sharma
                </p>
                <p className="flex items-center gap-1 text-[11px] leading-tight font-medium text-slate-400 dark:text-slate-400">
                  Product Designer
                  <ChevronDown className="h-3 w-3 shrink-0" />
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleLogout()}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors',
              'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200',
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
