'use client';

import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';
import { Search, Bell, Gift, Sun, Moon, ChevronDown, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md sm:px-8 dark:border-slate-800/80 dark:bg-slate-900/90">
      {/* Mobile Menu Button & Search */}
      <div className="flex max-w-md flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:text-slate-700 lg:hidden dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div
          className={cn(
            'flex w-full items-center gap-2.5 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 text-xs transition-all dark:border-slate-700/60 dark:bg-slate-800/60',
            'focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:bg-slate-900',
          )}
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <kbd className="hidden rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-400 sm:inline-block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Gift / Perks Icon */}
        <button
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label="Rewards & Perks"
        >
          <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Notifications Icon with Badge 3 */}
        <button
          className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
            3
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600 sm:h-5 sm:w-5" />
          )}
        </button>

        {/* Profile Avatar Menu */}
        <div className="flex items-center gap-1.5 pl-1 sm:pl-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-200 sm:h-9 sm:w-9 dark:border-slate-700">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
              alt="Sourav Sharma"
              className="h-full w-full object-cover"
            />
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
    </header>
  );
}
