'use client';

import { Card } from './card';
import type { AttendanceData } from '../domain/types';
import { LogOut, Coffee } from 'lucide-react';

interface LiveAttendanceCardProps extends AttendanceData {
  onClockOut?: () => void;
  onTakeBreak?: () => void;
}

export function LiveAttendanceCard({
  checkInTime = '09:02 AM',
  dailyProgressHours = 3.06,
  workingDurationText = '03h 08m 24s',
  progressPercentage = 38,
  onClockOut,
  onTakeBreak,
}: LiveAttendanceCardProps) {
  return (
    <Card className="flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
            Time & Attendance
          </h3>
        </div>
        <span className="inline-flex items-center rounded-full border border-emerald-200/50 bg-emerald-50 px-3 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-400">
          Working
        </span>
      </div>

      {/* Check In info */}
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Checked in at{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {checkInTime}
          </span>
        </p>
      </div>

      {/* Duration */}
      <div className="space-y-1">
        <div className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums dark:text-white">
          {workingDurationText}
        </div>
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
          Working Duration
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Today&apos;s Goal: 8h 00m</span>
          <span>{progressPercentage}%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={onClockOut}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <LogOut className="h-4 w-4" />
          Clock Out
        </button>
        <button
          onClick={onTakeBreak}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80"
        >
          <Coffee className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          Take Break
        </button>
      </div>
    </Card>
  );
}
