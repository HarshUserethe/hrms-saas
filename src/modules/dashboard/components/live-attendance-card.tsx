'use client';

import { cn } from '@/lib/utils';
import { useAttendanceTimer } from '../hooks/use-attendance-timer';
import { Card } from './card';
import type { AttendanceData } from '../domain/types';
import { Clock, Play, Square, Coffee, RotateCcw, Circle } from 'lucide-react';

interface LiveAttendanceCardProps extends AttendanceData {
  onClockIn?: () => void;
  onClockOut?: () => void;
  onTakeBreak?: () => void;
  onResume?: () => void;
}

const statusConfig = {
  'checked-out': {
    label: 'Checked Out',
    dot: 'bg-muted-foreground',
    bg: 'bg-muted text-muted-foreground',
  },
  'checked-in': {
    label: 'Checked In',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 text-blue-700',
  },
  working: {
    label: 'Working',
    dot: 'bg-green-500',
    bg: 'bg-green-50 text-green-700',
  },
  'on-break': {
    label: 'On Break',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 text-amber-700',
  },
};

export function LiveAttendanceCard({
  status,
  checkInTime,
  currentShift,
  dailyTargetHours,
  dailyProgressHours,
  onClockIn,
  onClockOut,
  onTakeBreak,
  onResume,
}: LiveAttendanceCardProps) {
  const { elapsed } = useAttendanceTimer(
    status === 'working' || status === 'on-break' ? checkInTime : null,
  );
  const config = statusConfig[status];
  const progress = Math.min((dailyProgressHours / dailyTargetHours) * 100, 100);

  const isActive = status === 'working' || status === 'on-break';

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-primary h-5 w-5" />
          <h3 className="text-card-foreground text-lg font-semibold">
            Live Attendance
          </h3>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
            config.bg,
          )}
        >
          <Circle className={cn('h-2 w-2 fill-current', config.dot)} />
          {config.label}
        </span>
      </div>

      {status === 'checked-out' ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <Clock className="text-muted-foreground h-8 w-8" />
          </div>
          <p className="text-muted-foreground text-sm">
            You are currently checked out
          </p>
          <button
            onClick={onClockIn}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium shadow-sm transition-all active:translate-y-px"
          >
            <Play className="h-4 w-4" />
            Clock In
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs">Check-In Time</p>
              <p className="text-card-foreground text-sm font-semibold">
                {checkInTime || '--:--'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Current Shift</p>
              <p className="text-card-foreground text-sm font-semibold">
                {currentShift}
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-card-foreground text-3xl font-bold tracking-tight tabular-nums">
                {isActive ? elapsed : '00:00:00'}
              </span>
              <span className="text-muted-foreground text-xs">hrs</span>
            </div>
            <p className="text-muted-foreground mt-1 text-center text-xs">
              {status === 'on-break' ? 'Break Duration' : 'Working Duration'}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Today&apos;s Target</span>
              <span className="text-card-foreground font-medium">
                {dailyProgressHours.toFixed(1)}h / {dailyTargetHours}h
              </span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {status === 'checked-in' && (
              <button
                onClick={onTakeBreak}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all active:translate-y-px"
              >
                <Play className="h-4 w-4" />
                Start Work
              </button>
            )}
            {status === 'working' && (
              <>
                <button
                  onClick={onTakeBreak}
                  className="border-border bg-background text-card-foreground hover:bg-muted inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-all active:translate-y-px"
                >
                  <Coffee className="h-4 w-4" />
                  Take Break
                </button>
                <button
                  onClick={onClockOut}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all active:translate-y-px"
                >
                  <Square className="h-4 w-4" />
                  Clock Out
                </button>
              </>
            )}
            {status === 'on-break' && (
              <button
                onClick={onResume}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all active:translate-y-px"
              >
                <RotateCcw className="h-4 w-4" />
                Resume Work
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
