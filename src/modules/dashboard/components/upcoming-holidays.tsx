'use client';

import { Card } from './card';
import { ArrowRight } from 'lucide-react';
import type { HolidayEvent } from '../domain/types';

interface UpcomingHolidaysProps {
  events?: HolidayEvent[];
  onViewCalendar?: () => void;
}

export function UpcomingHolidays({ onViewCalendar }: UpcomingHolidaysProps) {
  const holidayList = [
    {
      id: '1',
      dayMonth: '02 OCT',
      title: 'Gandhi Jayanti',
      dateText: 'Monday, 02 October 2023',
      badgeText: 'Holiday',
      isGreen: false,
    },
    {
      id: '2',
      dayMonth: '12 OCT',
      title: 'Dussehra',
      dateText: 'Thursday, 12 October 2023',
      badgeText: 'Holiday',
      isGreen: false,
    },
    {
      id: '3',
      dayMonth: '31 OCT',
      title: 'Diwali',
      dateText: 'Tuesday, 31 October 2023',
      badgeText: 'Holiday',
      isGreen: false,
    },
    {
      id: '4',
      dayMonth: '06 OCT',
      title: 'Q3 Town Hall',
      dateText: 'Friday, 06 October 2023',
      badgeText: 'Event',
      isGreen: true,
    },
  ];

  return (
    <Card className="flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
          Upcoming Holidays & Events
        </h3>
        <button
          onClick={onViewCalendar}
          className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          View calendar
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {holidayList.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 border-b border-slate-100/80 pb-2.5 last:border-b-0 last:pb-0 dark:border-slate-800/60"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-xs leading-none font-bold ${
                  item.isGreen
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-slate-100/90 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                <span>{item.dayMonth.split(' ')[0]}</span>
                <span className="text-[9px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {item.dayMonth.split(' ')[1]}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {item.dateText}
                </p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                item.isGreen
                  ? 'border-emerald-200/50 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'border-blue-200/50 bg-blue-50 text-blue-600 dark:border-blue-800/40 dark:bg-blue-950/60 dark:text-blue-400'
              }`}
            >
              {item.badgeText}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Link */}
      <div className="flex items-center justify-center pt-1">
        <button
          onClick={onViewCalendar}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          View full calendar
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  );
}
