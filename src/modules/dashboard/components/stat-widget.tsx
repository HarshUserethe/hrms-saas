import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { StatMetric } from '../domain/types';

interface StatWidgetProps {
  metric: StatMetric;
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-500',
  neutral: 'text-muted-foreground',
};

export function StatWidget({ metric }: StatWidgetProps) {
  const TrendIcon = metric.trend ? trendIcons[metric.trend] : null;

  return (
    <div className="border-border bg-card flex items-start gap-3 rounded-xl border p-4 shadow-sm">
      <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
        {metric.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs">{metric.label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-card-foreground text-xl font-bold tracking-tight">
            {metric.value}
          </span>
          {metric.trend && TrendIcon && metric.trendValue && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium',
                trendColors[metric.trend],
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {metric.trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
