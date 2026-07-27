'use client';

import { Card } from './card';
import type { QuickAction } from '../domain/types';

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-card-foreground text-lg font-semibold">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className="border-border bg-background hover:border-primary/30 hover:bg-primary/5 flex flex-col items-center gap-2 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md active:translate-y-px"
          >
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              {action.icon}
            </div>
            <span className="text-card-foreground text-center text-xs leading-tight font-medium">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
