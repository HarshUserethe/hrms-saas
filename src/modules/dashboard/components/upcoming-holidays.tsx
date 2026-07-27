'use client';

import { Card } from './card';
import type { HolidayEvent, EventCategory } from '../domain/types';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpcomingHolidaysProps {
  events: HolidayEvent[];
  onViewCalendar?: () => void;
}

const categoryStyles: Record<EventCategory, string> = {
  holiday: 'bg-blue-50 text-blue-700',
  festival: 'bg-purple-50 text-purple-700',
  birthday: 'bg-pink-50 text-pink-700',
  anniversary: 'bg-amber-50 text-amber-700',
  training: 'bg-green-50 text-green-700',
  event: 'bg-sky-50 text-sky-700',
};

const categoryLabels: Record<EventCategory, string> = {
  holiday: 'Holiday',
  festival: 'Festival',
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  training: 'Training',
  event: 'Event',
};

export function UpcomingHolidays({
  events,
  onViewCalendar,
}: UpcomingHolidaysProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-card-foreground text-lg font-semibold">
          Upcoming Holidays & Events
        </h3>
        <button
          onClick={onViewCalendar}
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs font-medium transition-colors"
        >
          View Calendar
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2">
        {events.map((event) => {
          const d = new Date(event.date);
          const day = d.getDate();
          const month = d.toLocaleDateString('en-US', { month: 'short' });

          return (
            <div
              key={event.id}
              className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-2.5 transition-colors"
            >
              <div className="border-border bg-background flex h-12 w-10 shrink-0 flex-col items-center justify-center rounded-lg border leading-none">
                <span className="text-muted-foreground text-[10px] font-medium uppercase">
                  {month}
                </span>
                <span className="text-card-foreground text-sm font-bold">
                  {day}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-card-foreground text-sm font-medium">
                  {event.title}
                </p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                  categoryStyles[event.category],
                )}
              >
                {categoryLabels[event.category]}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
