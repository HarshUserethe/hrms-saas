'use client';

import { Card } from './card';
import type { LeaveBalanceItem } from '../domain/types';
import { User, RefreshCw } from 'lucide-react';

interface LeaveBalanceCardProps {
  leaveBalances?: LeaveBalanceItem[];
  onApplyLeave?: () => void;
}

export function LeaveBalanceCard({ onApplyLeave }: LeaveBalanceCardProps) {
  return (
    <Card className="flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
          Leave Balance
        </h3>
        <button className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
          View all
        </button>
      </div>

      {/* Leave List */}
      <div className="space-y-3.5">
        {/* Item 1: Annual Leave */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Annual Leave
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  12
                </span>{' '}
                / 20 days
              </p>
            </div>
          </div>
          <div className="w-24">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full w-[60%] rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* Item 2: Sick Leave */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Sick Leave
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  06
                </span>{' '}
                / 10 days
              </p>
            </div>
          </div>
          <div className="w-24">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full w-[60%] rounded-full bg-blue-600" />
            </div>
          </div>
        </div>

        {/* Item 3: Casual Leave */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Casual Leave
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  04
                </span>{' '}
                / 08 days
              </p>
            </div>
          </div>
          <div className="w-24">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full w-[50%] rounded-full bg-amber-500" />
            </div>
          </div>
        </div>

        {/* Item 4: Comp Off */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Comp Off
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  02
                </span>{' '}
                / 05 days
              </p>
            </div>
          </div>
          <div className="w-24">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full w-[40%] rounded-full bg-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Leave Full Button */}
      <button
        onClick={onApplyLeave}
        className="w-full rounded-xl bg-blue-50/80 px-4 py-2.5 text-center text-xs font-bold text-blue-600 transition-all hover:bg-blue-100 active:scale-[0.98] dark:bg-blue-950/60 dark:text-blue-400 dark:hover:bg-blue-900/60"
      >
        Apply Leave
      </button>
    </Card>
  );
}
