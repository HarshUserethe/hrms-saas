'use client';

import { Card } from './card';
import { Download, ArrowRight } from 'lucide-react';
import type { Payslip } from '../domain/types';

interface MyPayslipCardProps {
  payslips?: Payslip[];
  onViewAll?: () => void;
}

export function MyPayslipCard({ onViewAll }: MyPayslipCardProps) {
  const payslipItems = [
    {
      id: '1',
      monthYear: 'September 2023',
      netSalary: '₹ 72,450.00',
      status: 'Paid',
    },
    {
      id: '2',
      monthYear: 'August 2023',
      netSalary: '₹ 68,250.00',
      status: 'Paid',
    },
    {
      id: '3',
      monthYear: 'July 2023',
      netSalary: '₹ 70,100.00',
      status: 'Paid',
    },
  ];

  return (
    <Card className="flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
          My Payslip
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          View all
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {payslipItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-emerald-100/70 bg-emerald-50/40 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/20"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.monthYear}
                </span>
                <span className="rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-400">
                  {item.status}
                </span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {item.netSalary}
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Net Salary
              </p>
            </div>

            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              aria-label={`Download ${item.monthYear} payslip`}
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Link */}
      <div className="flex items-center justify-center pt-1">
        <button
          onClick={onViewAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          View all payslips
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  );
}
