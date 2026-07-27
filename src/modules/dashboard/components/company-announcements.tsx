'use client';

import { Card } from './card';
import type { Announcement } from '../domain/types';
import { ArrowRight, Circle } from 'lucide-react';

interface CompanyAnnouncementsProps {
  announcements: Announcement[];
  onViewAll?: () => void;
}

export function CompanyAnnouncements({
  announcements,
  onViewAll,
}: CompanyAnnouncementsProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-card-foreground text-lg font-semibold">
          Announcements
        </h3>
        <button
          onClick={onViewAll}
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs font-medium transition-colors"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="group hover:bg-muted/50 relative flex items-start gap-3 rounded-lg p-3 transition-colors"
          >
            {item.isUnread && (
              <Circle className="fill-primary text-primary absolute top-3 right-2 h-2 w-2" />
            )}
            <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-card-foreground text-sm font-medium">
                {item.title}
              </p>
              <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                {item.description}
              </p>
              <p className="text-muted-foreground/60 mt-1 text-xs">
                {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
