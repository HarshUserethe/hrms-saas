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
} from 'lucide-react';
import { useMemo } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { label: 'Leave', href: '/leave', icon: CalendarClock },
  { label: 'Payroll', href: '/payroll', icon: Wallet },
  { label: 'Performance', href: '/performance', icon: TrendingUp },
  { label: 'Documents', href: '/documents', icon: FileText },
  { label: 'Benefits', href: '/benefits', icon: Gift },
  { label: 'Reimbursements', href: '/reimbursements', icon: Receipt },
  { label: 'Calendar', href: '/calender', icon: Calendar },
  { label: 'Directory', href: '/directory', icon: Users },
  { label: 'Announcements', href: '/announcements', icon: Megaphone },
  { label: 'Help & Support', href: '/help', icon: LifeBuoy },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const slug = useMemo(() => {
    const segments = pathname.split('/');
    return segments[1] || '';
  }, [pathname]);

  const isActive = (href: string) => pathname.includes(href);

  return (
    <aside className="border-border bg-sidebar fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r">
      <div className="border-border flex h-16 items-center gap-3 border-b px-6">
        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
          K
        </div>
        <span className="text-sidebar-foreground text-lg font-semibold">
          Kinetic
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={`/${slug}${item.href}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-border border-t px-3 py-4">
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
