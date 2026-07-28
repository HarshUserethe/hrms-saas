'use client';

import { Card } from './card';
import {
  CheckCircle2,
  Megaphone,
  FileText,
  Calendar,
  User,
} from 'lucide-react';
import type { UpdateItem } from '../domain/types';

interface LatestUpdatesCardProps {
  updates?: UpdateItem[];
  onViewAll?: () => void;
}

export function LatestUpdatesCard({ onViewAll }: LatestUpdatesCardProps) {
  const updateList = [
    {
      id: '1',
      time: '10:30 AM',
      icon: (
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      ),
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'Leave request for 28 Sept has been approved',
    },
    {
      id: '2',
      time: '09:15 AM',
      icon: <Megaphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'New announcement published: Office Maintenance',
    },
    {
      id: '3',
      time: 'Yesterday',
      icon: (
        <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      ),
      badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
      text: 'Your payslip for September is generated',
    },
    {
      id: '4',
      time: '25 Sept',
      icon: (
        <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      ),
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'Town Hall Meeting scheduled on 30 Sept',
    },
    {
      id: '5',
      time: '24 Sept',
      icon: <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'Profile details updated successfully',
    },
  ];

  return (
    <Card className="flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
          Latest Updates
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          View all
        </button>
      </div>

      {/* Timeline list */}
      <div className="space-y-3.5">
        {updateList.map((item) => (
          <div key={item.id} className="flex items-center gap-3 sm:gap-4">
            <span className="w-16 shrink-0 text-right text-[11px] font-semibold text-slate-400 dark:text-slate-400">
              {item.time}
            </span>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.badgeBg}`}
            >
              {item.icon}
            </div>
            <p className="min-w-0 flex-1 text-xs leading-snug font-semibold text-slate-800 dark:text-slate-200">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
