'use client';

import { Card } from './card';
import {
  FileCheck2,
  CalendarPlus,
  FileText,
  User,
  Clock,
  Users,
} from 'lucide-react';
import type { QuickAction } from '../domain/types';

interface QuickActionsProps {
  actions?: QuickAction[];
}

export function QuickActions({}: QuickActionsProps) {
  const actionList = [
    {
      id: '1',
      label: 'Mark Attendance',
      icon: (
        <FileCheck2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      ),
      bgColor:
        'bg-slate-50 hover:bg-emerald-50/60 dark:bg-slate-800/50 dark:hover:bg-emerald-950/40',
    },
    {
      id: '2',
      label: 'Apply Leave',
      icon: (
        <CalendarPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      ),
      bgColor:
        'bg-slate-50 hover:bg-blue-50/60 dark:bg-slate-800/50 dark:hover:bg-blue-950/40',
    },
    {
      id: '3',
      label: 'My Payslip',
      icon: (
        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      ),
      bgColor:
        'bg-slate-50 hover:bg-purple-50/60 dark:bg-slate-800/50 dark:hover:bg-purple-950/40',
    },
    {
      id: '4',
      label: 'My Profile',
      icon: <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      bgColor:
        'bg-slate-50 hover:bg-purple-50/60 dark:bg-slate-800/50 dark:hover:bg-purple-950/40',
    },
    {
      id: '5',
      label: 'Request Support',
      icon: <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      bgColor:
        'bg-slate-50 hover:bg-amber-50/60 dark:bg-slate-800/50 dark:hover:bg-amber-950/40',
    },
    {
      id: '6',
      label: 'Company Directory',
      icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bgColor:
        'bg-slate-50 hover:bg-blue-50/60 dark:bg-slate-800/50 dark:hover:bg-blue-950/40',
    },
  ];

  return (
    <Card className="flex flex-col justify-between space-y-4">
      <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actionList.map((action) => (
          <button
            key={action.id}
            className={`flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-xl p-3.5 transition-all duration-200 sm:p-4 ${action.bgColor}`}
          >
            <div className="flex h-9 w-9 items-center justify-center">
              {action.icon}
            </div>
            <span className="text-center text-[11px] leading-tight font-bold text-slate-800 dark:text-slate-200">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
