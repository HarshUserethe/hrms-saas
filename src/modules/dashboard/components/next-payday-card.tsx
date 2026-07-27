'use client';

import { Card } from './card';
import type { PaydayInfo } from '../domain/types';
import { Calendar, DollarSign } from 'lucide-react';

interface NextPaydayCardProps extends PaydayInfo {
  onViewCalendar?: () => void;
}

export function NextPaydayCard({
  remainingDays,
  nextPayDate,
  onViewCalendar,
}: NextPaydayCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <DollarSign className="text-primary h-5 w-5" />
        <h3 className="text-card-foreground text-lg font-semibold">
          Next Payday
        </h3>
      </div>

      <div className="bg-muted/50 flex flex-col items-center justify-center gap-2 rounded-xl py-6">
        <span className="text-card-foreground text-4xl font-bold tracking-tight">
          {remainingDays}
        </span>
        <span className="text-muted-foreground text-sm">Days Remaining</span>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <Calendar className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground">Next Payroll:</span>
        <span className="text-card-foreground font-medium">{nextPayDate}</span>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative h-24 w-48">
          <svg viewBox="0 0 200 100" fill="none" className="h-full w-full">
            <rect
              x="20"
              y="30"
              width="160"
              height="60"
              rx="8"
              className="fill-muted stroke-border"
              strokeWidth="1"
            />
            <rect
              x="20"
              y="20"
              width="160"
              height="14"
              rx="4"
              className="fill-primary/10 stroke-border"
              strokeWidth="1"
            />
            <circle cx="28" cy="27" r="2" className="fill-primary" />
            <circle cx="36" cy="27" r="2" className="fill-primary" />
            <text
              x="100"
              y="55"
              textAnchor="middle"
              className="fill-card-foreground text-[10px] font-medium"
            >
              Salary Day
            </text>
            <text
              x="100"
              y="72"
              textAnchor="middle"
              className="fill-muted-foreground text-[8px]"
            >
              {nextPayDate}
            </text>
            <path
              d="M100 10 L100 18 M96 14 L100 10 L104 14"
              className="stroke-primary"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M170 65 L185 65 M181 61 L185 65 L181 69"
              className="stroke-primary/40"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30 65 L15 65 M19 61 L15 65 L19 69"
              className="stroke-primary/40"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <button
        onClick={onViewCalendar}
        className="border-border bg-background text-card-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-all active:translate-y-px"
      >
        <Calendar className="h-4 w-4" />
        View Payroll Calendar
      </button>
    </Card>
  );
}
