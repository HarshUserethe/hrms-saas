'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';

export function Topbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-border bg-background sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b px-6">
      <div
        className={cn(
          'border-border bg-muted/50 text-muted-foreground flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
          'focus-within:border-ring focus-within:ring-ring focus-within:ring-1',
        )}
      >
        <Search className="h-4 w-4 shrink-0" />
        <input
          type="text"
          placeholder="Search employees, payslips, policies..."
          className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
        />
        <kbd className="border-border bg-background text-muted-foreground hidden rounded border px-1.5 py-0.5 text-xs md:inline-block">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="text-muted-foreground hover:bg-muted hover:text-foreground relative rounded-lg p-2 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="bg-destructive absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
        </button>

        <button
          className="text-muted-foreground hover:bg-muted hover:text-foreground relative rounded-lg p-2 transition-colors"
          aria-label="Messages"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="bg-primary absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
        </button>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="border-border ml-2 flex items-center gap-3 border-l pl-3">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
            JD
          </div>
          <div className="hidden md:block">
            <p className="text-foreground text-sm font-medium">John Doe</p>
            <p className="text-muted-foreground text-xs">Software Engineer</p>
          </div>
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
