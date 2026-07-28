'use client';

import { Card } from './card';
import { Megaphone, Users, Wrench, ArrowRight } from 'lucide-react';
import type { Announcement } from '../domain/types';

interface CompanyAnnouncementsProps {
  announcements?: Announcement[];
  onViewAll?: () => void;
}

export function CompanyAnnouncements({ onViewAll }: CompanyAnnouncementsProps) {
  const items = [
    {
      id: '1',
      icon: <Megaphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
      hasRedDot: true,
      title: 'New Leave Policy',
      description: 'Our new leave policy will be effective from 1st Oct 2023.',
      time: '2h ago',
    },
    {
      id: '2',
      icon: (
        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      ),
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      hasRedDot: false,
      title: 'Town Hall Meeting',
      description:
        'Join us for the monthly town hall meeting on 30th Sept 2023.',
      time: '1d ago',
    },
    {
      id: '3',
      icon: <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
      hasRedDot: false,
      title: 'Office Maintenance',
      description:
        'The office will be closed on 29th Sept 2023 from 2 PM onwards.',
      time: '2d ago',
    },
  ];

  return (
    <Card className="flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
          Announcements
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          View all
        </button>
      </div>

      {/* Item List */}
      <div className="space-y-3.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div
              className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.badgeBg}`}
            >
              {item.icon}
              {item.hasRedDot && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-[11px] leading-snug font-medium text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-400">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Link */}
      <div className="flex items-center justify-center pt-1">
        <button
          onClick={onViewAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          View all announcements
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  );
}
