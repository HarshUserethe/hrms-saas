'use client';

import { Card } from './card';
import type { Payslip, PayslipStatus } from '../domain/types';
import { ArrowRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MyPayslipCardProps {
  payslips: Payslip[];
  onViewAll?: () => void;
  onDownload?: (id: string) => void;
}

const statusStyles: Record<PayslipStatus, string> = {
  paid: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
};

export function MyPayslipCard({
  payslips,
  onViewAll,
  onDownload,
}: MyPayslipCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-card-foreground text-lg font-semibold">
          My Payslip
        </h3>
        <button
          onClick={onViewAll}
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs font-medium transition-colors"
        >
          View All Payslips
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2">
        {payslips.map((slip) => (
          <div
            key={slip.id}
            className="border-border hover:bg-muted/30 flex items-center justify-between rounded-lg border p-3 transition-colors"
          >
            <div>
              <p className="text-card-foreground text-sm font-medium">
                {slip.month} {slip.year}
              </p>
              <p className="text-muted-foreground text-xs">
                ₹{slip.netSalary.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                  statusStyles[slip.status],
                )}
              >
                {slip.status.charAt(0).toUpperCase() + slip.status.slice(1)}
              </span>
              <button
                onClick={() => onDownload?.(slip.id)}
                className="text-muted-foreground hover:bg-muted hover:text-card-foreground rounded-lg p-1.5 transition-colors"
                aria-label={`Download payslip for ${slip.month} ${slip.year}`}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
