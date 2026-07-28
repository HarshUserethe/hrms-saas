'use client';

import { Calendar, Palmtree, Clock, CheckCircle2, Star } from 'lucide-react';

export function MySummaryCard() {
  const summaryItems = [
    {
      icon: <Calendar className="h-4 w-4" />,
      iconBg:
        'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
      label: 'Total Working Days',
      value: '22',
      caption: 'This Month',
    },
    {
      icon: <Palmtree className="h-4 w-4" />,
      iconBg:
        'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      label: 'Leaves Taken',
      value: '2.5',
      caption: 'This Month',
    },
    {
      icon: <Clock className="h-4 w-4" />,
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      label: 'Late Arrivals',
      value: '1',
      caption: 'This Month',
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      iconBg:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      label: 'On-time Arrival',
      value: '98.56%',
      caption: 'This Month',
    },
    {
      icon: <Star className="h-4 w-4" />,
      iconBg:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      label: 'Performance Rating',
      value: '4.5 / 5',
      caption: 'Current Cycle',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
        My Summary
      </h3>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {summaryItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800/80 dark:bg-slate-900"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
            >
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className="text-base leading-tight font-extrabold text-slate-900 sm:text-lg dark:text-white">
                {item.value}
              </p>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-400">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
