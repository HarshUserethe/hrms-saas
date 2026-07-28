import type { ReactNode } from 'react';

export type AttendanceStatus =
  'checked-out' | 'checked-in' | 'working' | 'on-break';

export interface AttendanceData {
  status: AttendanceStatus;
  checkInTime: string | null;
  currentShift: string;
  dailyTargetHours: number;
  dailyProgressHours: number;
  workingDurationText?: string;
  progressPercentage?: number;
}

export interface LeaveBalanceItem {
  type: 'annual' | 'sick' | 'casual' | 'comp-off';
  label: string;
  total: number;
  used: number;
  remaining: number;
}

export interface PaydayInfo {
  remainingDays: number;
  nextPayDate: string;
  illustration?: string;
}

export interface StatMetric {
  icon: ReactNode;
  label: string;
  value: string;
  caption?: string;
  iconBgColor?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface Announcement {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  date: string;
  isUnread: boolean;
  badgeBgColor?: string;
  badgeIconColor?: string;
}

export type EventCategory = 'holiday' | 'event';

export interface HolidayEvent {
  id: string;
  dayMonth: string;
  title: string;
  dateText: string;
  category: EventCategory;
  isGreenBadge?: boolean;
}

export type PayslipStatus = 'paid' | 'pending' | 'processing';

export interface Payslip {
  id: string;
  monthYear: string;
  netSalary: string;
  status: PayslipStatus;
}

export type UpdateType =
  | 'leave-approved'
  | 'announcement'
  | 'payslip-generated'
  | 'meeting-scheduled'
  | 'profile-updated';

export interface UpdateItem {
  id: string;
  type: UpdateType;
  timestamp: string;
  description: string;
}

export interface QuickAction {
  id: string;
  icon: ReactNode;
  label: string;
  bgColor: string;
  iconColor: string;
  onClick?: () => void;
}
