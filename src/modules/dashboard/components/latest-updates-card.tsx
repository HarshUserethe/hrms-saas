'use client';

import { Card } from './card';
import type { UpdateItem, UpdateType } from '../domain/types';
import {
  CheckCircle,
  FileText,
  Shield,
  UserCheck,
  Calendar,
} from 'lucide-react';

interface LatestUpdatesCardProps {
  updates: UpdateItem[];
}

const updateIcons: Record<UpdateType, React.ReactNode> = {
  'leave-approved': <CheckCircle className="h-4 w-4 text-green-600" />,
  'payslip-generated': <FileText className="h-4 w-4 text-blue-600" />,
  'policy-update': <Shield className="h-4 w-4 text-purple-600" />,
  'profile-change': <UserCheck className="h-4 w-4 text-amber-600" />,
  'meeting-reminder': <Calendar className="h-4 w-4 text-sky-600" />,
};

const updateBg: Record<UpdateType, string> = {
  'leave-approved': 'bg-green-50',
  'payslip-generated': 'bg-blue-50',
  'policy-update': 'bg-purple-50',
  'profile-change': 'bg-amber-50',
  'meeting-reminder': 'bg-sky-50',
};

export function LatestUpdatesCard({ updates }: LatestUpdatesCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-card-foreground text-lg font-semibold">
        Latest Updates
      </h3>

      <div className="relative">
        <div className="bg-border absolute top-1 left-5 h-[calc(100%-2rem)] w-px" />
        <div className="space-y-4">
          {updates.map((update) => (
            <div
              key={update.id}
              className="relative flex items-start gap-4 pl-0"
            >
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${updateBg[update.type]} shadow-sm`}
              >
                {updateIcons[update.type]}
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-card-foreground text-sm">
                  {update.description}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {update.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
