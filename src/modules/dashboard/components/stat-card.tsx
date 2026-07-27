import { Card } from './card';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  caption?: string;
}

export function StatCard({ icon, value, label, caption }: StatCardProps) {
  return (
    <Card className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-card-foreground text-2xl font-bold tracking-tight">
          {value}
        </p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
      {caption && <p className="text-muted-foreground/70 text-xs">{caption}</p>}
    </Card>
  );
}
