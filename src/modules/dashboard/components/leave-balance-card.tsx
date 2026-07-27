'use client';

import { cn } from '@/lib/utils';
import { Card } from './card';
import type { LeaveBalanceItem } from '../domain/types';
import { CalendarPlus } from 'lucide-react';

interface LeaveBalanceCardProps {
  leaveBalances: LeaveBalanceItem[];
  onApplyLeave?: () => void;
}

const leaveColors: Record<string, string> = {
  annual: 'bg-blue-500',
  sick: 'bg-amber-500',
  casual: 'bg-green-500',
  'comp-off': 'bg-purple-500',
};

export function LeaveBalanceCard({
  leaveBalances,
  onApplyLeave,
}: LeaveBalanceCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-card-foreground text-lg font-semibold">
          Leave Balance
        </h3>
        <button
          onClick={onApplyLeave}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm transition-all active:translate-y-px"
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Apply Leave
        </button>
      </div>

      <div className="space-y-3.5">
        {leaveBalances.map((item) => {
          const pct = item.total > 0 ? (item.used / item.total) * 100 : 0;
          return (
            <div key={item.type} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-card-foreground font-medium">
                  {item.label}
                </span>
                <span className="text-muted-foreground text-xs">
                  <span className="text-card-foreground font-semibold">
                    {item.remaining}
                  </span>{' '}
                  / {item.total} remaining
                </span>
              </div>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    leaveColors[item.type] || 'bg-primary',
                  )}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
