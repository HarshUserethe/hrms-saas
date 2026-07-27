'use client';

import { LiveAttendanceCard } from './live-attendance-card';
import { LeaveBalanceCard } from './leave-balance-card';
import { NextPaydayCard } from './next-payday-card';
import { MySummaryCard } from './my-summary-card';
import { StatCard } from './stat-card';
import { CompanyAnnouncements } from './company-announcements';
import { UpcomingHolidays } from './upcoming-holidays';
import { QuickActions } from './quick-actions';
import { MyPayslipCard } from './my-payslip-card';
import { LatestUpdatesCard } from './latest-updates-card';
import type {
  AttendanceData,
  LeaveBalanceItem,
  PaydayInfo,
  StatMetric,
  Announcement,
  HolidayEvent,
  QuickAction,
  Payslip,
  UpdateItem,
} from '../domain/types';
import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle,
  Calendar,
  Briefcase,
  UserCheck,
  Award,
  CalendarCheck,
  FileText,
  User,
  HeadphonesIcon,
  Users,
  Megaphone,
  Gift,
} from 'lucide-react';

const attendanceData: AttendanceData = {
  status: 'working',
  checkInTime: '09:02 AM',
  currentShift: 'General (9:00 AM - 6:00 PM)',
  dailyTargetHours: 9,
  dailyProgressHours: 4.5,
};

const leaveBalances: LeaveBalanceItem[] = [
  { type: 'annual', label: 'Annual Leave', total: 18, used: 7, remaining: 11 },
  { type: 'sick', label: 'Sick Leave', total: 12, used: 3, remaining: 9 },
  { type: 'casual', label: 'Casual Leave', total: 10, used: 5, remaining: 5 },
  { type: 'comp-off', label: 'Comp Off', total: 4, used: 1, remaining: 3 },
];

const paydayInfo: PaydayInfo = {
  remainingDays: 12,
  nextPayDate: 'Aug 07, 2026',
  illustration: 'payroll',
};

const summaryMetrics: StatMetric[] = [
  {
    icon: <Briefcase className="h-5 w-5" />,
    label: 'Total Working Days',
    value: '22',
    trend: 'neutral',
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: 'Leaves Taken',
    value: '3',
    trend: 'down',
    trendValue: '1 less',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: 'Late Arrivals',
    value: '2',
    trend: 'up',
    trendValue: '1 more',
  },
  {
    icon: <CheckCircle className="h-5 w-5" />,
    label: 'Attendance %',
    value: '95.4%',
    trend: 'up',
    trendValue: '+2.1%',
  },
  {
    icon: <UserCheck className="h-5 w-5" />,
    label: 'On-Time Arrival %',
    value: '91.7%',
    trend: 'up',
    trendValue: '+3.2%',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: 'Avg. Daily Hours',
    value: '8h 42m',
    trend: 'neutral',
  },
  {
    icon: <Award className="h-5 w-5" />,
    label: 'Performance Rating',
    value: '4.2 / 5',
    trend: 'up',
    trendValue: '+0.3',
  },
];

const announcements: Announcement[] = [
  {
    id: '1',
    icon: <Megaphone className="h-4 w-4" />,
    title: 'Q3 Townhall Meeting',
    description:
      'Quarterly townhall scheduled for Aug 15th at 3 PM in the main auditorium.',
    date: '2 hours ago',
    isUnread: true,
  },
  {
    id: '2',
    icon: <Gift className="h-4 w-4" />,
    title: 'Diwali Celebration',
    description:
      'Diwali celebration will be held on Oct 31st. Register for cultural events.',
    date: '1 day ago',
    isUnread: false,
  },
  {
    id: '3',
    icon: <FileText className="h-4 w-4" />,
    title: 'Policy Update',
    description:
      'Remote work policy has been updated. Please review the changes.',
    date: '3 days ago',
    isUnread: false,
  },
];

const holidayEvents: HolidayEvent[] = [
  {
    id: '1',
    title: 'Independence Day',
    date: '2026-08-15',
    category: 'holiday',
  },
  {
    id: '2',
    title: 'Raksha Bandhan',
    date: '2026-08-22',
    category: 'festival',
  },
  {
    id: '3',
    title: "Sarah's Birthday",
    date: '2026-07-30',
    category: 'birthday',
  },
  {
    id: '4',
    title: 'John - 5 Year Anniversary',
    date: '2026-08-05',
    category: 'anniversary',
  },
  {
    id: '5',
    title: 'Leadership Training',
    date: '2026-08-10',
    category: 'training',
  },
];

const quickActions: QuickAction[] = [
  { icon: <CalendarCheck className="h-5 w-5" />, label: 'Apply Leave' },
  { icon: <Clock className="h-5 w-5" />, label: 'Mark Attendance' },
  { icon: <FileText className="h-5 w-5" />, label: 'My Payslip' },
  { icon: <User className="h-5 w-5" />, label: 'My Profile' },
  { icon: <HeadphonesIcon className="h-5 w-5" />, label: 'Request Support' },
  { icon: <Users className="h-5 w-5" />, label: 'Company Directory' },
];

const payslips: Payslip[] = [
  { id: '1', month: 'June', year: 2026, netSalary: 85000, status: 'paid' },
  { id: '2', month: 'May', year: 2026, netSalary: 85000, status: 'paid' },
  { id: '3', month: 'April', year: 2026, netSalary: 82340, status: 'paid' },
];

const latestUpdates: UpdateItem[] = [
  {
    id: '1',
    type: 'leave-approved',
    timestamp: '2 hours ago',
    description: 'Your Annual Leave request (Aug 10-12) has been approved.',
  },
  {
    id: '2',
    type: 'payslip-generated',
    timestamp: '1 day ago',
    description:
      'June 2026 payslip has been generated and is ready for download.',
  },
  {
    id: '3',
    type: 'policy-update',
    timestamp: '3 days ago',
    description: 'Remote Work Policy v3.0 has been published. Review now.',
  },
  {
    id: '4',
    type: 'profile-change',
    timestamp: '1 week ago',
    description: 'Your profile information was updated successfully.',
  },
  {
    id: '5',
    type: 'meeting-reminder',
    timestamp: '1 week ago',
    description: 'Sprint Retrospective at 3 PM tomorrow in Conference Room B.',
  },
];

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-8 p-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back, John. Here&apos;s your overview for today.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <LiveAttendanceCard {...attendanceData} />
        <LeaveBalanceCard leaveBalances={leaveBalances} />
        <NextPaydayCard {...paydayInfo} />
      </section>

      <section>
        <MySummaryCard metrics={summaryMetrics} />
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          value="8h 42m"
          label="Average Working Hours"
          caption="This Month"
        />
        <StatCard
          icon={<LogIn className="h-6 w-6" />}
          value="09:04 AM"
          label="Average Check-In Time"
          caption="This Month"
        />
        <StatCard
          icon={<LogOut className="h-6 w-6" />}
          value="06:12 PM"
          label="Average Check-Out Time"
          caption="This Month"
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6" />}
          value="91.7%"
          label="On-Time Arrival"
          caption="This Month"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CompanyAnnouncements announcements={announcements} />
        <UpcomingHolidays events={holidayEvents} />
        <QuickActions actions={quickActions} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <MyPayslipCard payslips={payslips} />
        </div>
        <div className="lg:col-span-4">
          <LatestUpdatesCard updates={latestUpdates} />
        </div>
      </section>
    </div>
  );
}
