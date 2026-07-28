'use client';

import { Card } from './card';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  iconBgColor?: string;
  value: string;
  label: string;
  caption: string;
}

export function StatCard({
  icon,
  iconBgColor = 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  value,
  label,
  caption,
}: StatCardProps) {
  return (
    <Card className="flex items-center gap-3.5 p-4 sm:p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBgColor}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-lg leading-tight font-extrabold text-slate-900 sm:text-xl dark:text-white">
          {value}
        </p>
        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-400">
          {caption}
        </p>
      </div>
    </Card>
  );
}
