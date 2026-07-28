'use client';

import { Card } from './card';
import { Calendar, ArrowRight } from 'lucide-react';
import type { PaydayInfo } from '../domain/types';

type NextPaydayCardProps = Partial<PaydayInfo>;

export function NextPaydayCard({
  remainingDays = 5,
  nextPayDate = 'Friday, 01 October 2023',
}: NextPaydayCardProps) {
  return (
    <Card className="flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
          Next Pay Day
        </h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <Calendar className="h-4 w-4" />
        </div>
      </div>

      {/* Days Callout */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Your next payday is in
        </p>
        <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {String(remainingDays).padStart(2, '0')}{' '}
          <span className="text-2xl font-bold">Days</span>
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          on {nextPayDate}
        </p>
      </div>

      {/* Vector Illustration Graphic */}
      <div className="relative flex h-24 w-full items-center justify-center py-2">
        <div className="relative flex items-center justify-center">
          {/* Calendar Box */}
          <div className="flex h-20 w-24 flex-col overflow-hidden rounded-2xl border border-blue-200 bg-blue-100/80 shadow-xs dark:border-blue-900 dark:bg-blue-950/80">
            <div className="h-5 w-full bg-blue-600" />
            <div className="flex flex-1 flex-col items-center justify-center space-y-1 p-1">
              <div className="h-2 w-10 rounded-full bg-blue-300 dark:bg-blue-800" />
              <div className="h-2 w-14 rounded-full bg-blue-200 dark:bg-blue-900" />
              <div className="h-2 w-8 rounded-full bg-blue-300 dark:bg-blue-800" />
            </div>
          </div>

          {/* Coin Stack 1 */}
          <div className="absolute -bottom-1 -left-4 flex flex-col space-y-0.5">
            <div className="h-3 w-8 rounded-full border border-blue-400 bg-blue-300 dark:border-blue-600 dark:bg-blue-700" />
            <div className="h-3 w-8 rounded-full border border-blue-500 bg-blue-400 dark:border-blue-700 dark:bg-blue-800" />
            <div className="h-3 w-8 rounded-full border border-blue-600 bg-blue-500 dark:border-blue-800 dark:bg-blue-900" />
          </div>

          {/* Rupee Circle Badge */}
          <div className="absolute -right-3 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-sm font-extrabold text-white shadow-md dark:border-slate-900">
            ₹
          </div>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="flex items-center justify-center">
        <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
          View Payroll Calendar
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  );
}
