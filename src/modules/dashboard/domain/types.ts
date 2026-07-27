export type AttendanceStatus =
  'checked-out' | 'checked-in' | 'working' | 'on-break';

export interface AttendanceData {
  status: AttendanceStatus;
  checkInTime: string | null;
  currentShift: string;
  dailyTargetHours: number;
  dailyProgressHours: number;
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
  illustration: string;
}

export interface StatMetric {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface Announcement {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  date: string;
  isUnread: boolean;
}

export type EventCategory =
  'holiday' | 'festival' | 'birthday' | 'anniversary' | 'training' | 'event';

export interface HolidayEvent {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
}

export type PayslipStatus = 'paid' | 'pending' | 'processing';

export interface Payslip {
  id: string;
  month: string;
  year: number;
  netSalary: number;
  status: PayslipStatus;
}

export type UpdateType =
  | 'leave-approved'
  | 'payslip-generated'
  | 'policy-update'
  | 'profile-change'
  | 'meeting-reminder';

export interface UpdateItem {
  id: string;
  type: UpdateType;
  timestamp: string;
  description: string;
}

export interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}
