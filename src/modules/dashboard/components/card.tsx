import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:border-slate-800/80 dark:bg-slate-900 dark:shadow-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
