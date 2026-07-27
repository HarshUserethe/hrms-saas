import { Card } from './card';
import { StatWidget } from './stat-widget';
import type { StatMetric } from '../domain/types';

interface MySummaryCardProps {
  metrics: StatMetric[];
}

export function MySummaryCard({ metrics }: MySummaryCardProps) {
  return (
    <Card className="flex flex-col gap-5">
      <h3 className="text-card-foreground text-lg font-semibold">My Summary</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {metrics.map((metric, idx) => (
          <StatWidget key={idx} metric={metric} />
        ))}
      </div>
    </Card>
  );
}
