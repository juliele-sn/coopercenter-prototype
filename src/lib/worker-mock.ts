// Mock data for the Figma-aligned worker flow. The numbers and assignment
// names mirror the CooperCenter Figma file (Secretary at Acorns, Janitor at
// Vertex) so the prototype reads believably against the design source.

import type { EntryStatus, TimecardStatus } from './design';

const todayDate = new Date();
const DAY_MS = 86400000;

const dayOfWeek = (weekOffset: number, dow: number, h = 12): Date => {
  const d = new Date(todayDate);
  d.setHours(h, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay() + dow + weekOffset * 7);
  return d;
};

export interface Assignment {
  id: string;            // 'acorns' | 'vertex'
  shortCode: string;     // 'ACN' | 'VTX' — used in timecard IDs
  role: string;          // 'Secretary'
  client: string;        // 'Acorns'
  label: string;         // 'Secretary at Acorns'
  approver: string;
  approverInitial: string;
  approverFirstName: string;
  payType: 'salaried' | 'hourly';
  cadence: 'Weekly';
  expectedWeeklyHours: number;
  rate: number;
}

export interface WorkerEntry {
  id: number;
  assignmentId: string;
  date: Date;
  start: string;         // 'HH:MM' (24h)
  end: string;           // 'HH:MM'
  hours: number;
  regularH: number;
  otH: number;
  status: EntryStatus;
  payCode: string;       // 'Regular' | 'Overtime' | 'PTO' | 'Holiday'
  costCode: string;      // 'Front desk' | 'Custodial' etc.
  hasConflict?: boolean;
  conflictNote?: string;
}

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'acorns',
    shortCode: 'ACN',
    role: 'Secretary',
    client: 'Acorns',
    label: 'Secretary at Acorns',
    approver: 'M. Reyes',
    approverInitial: 'MR',
    approverFirstName: 'Marisol',
    payType: 'salaried',
    cadence: 'Weekly',
    expectedWeeklyHours: 40,
    rate: 32,
  },
  {
    id: 'vertex',
    shortCode: 'VTX',
    role: 'Janitor',
    client: 'Vertex',
    label: 'Janitor at Vertex',
    approver: 'J. Patel',
    approverInitial: 'JP',
    approverFirstName: 'Jamie',
    payType: 'hourly',
    cadence: 'Weekly',
    expectedWeeklyHours: 20,
    rate: 24,
  },
];

const acorns = (date: Date, start: string, end: string, hours: number, regular: number, ot: number, status: EntryStatus, costCode = 'Front desk', payCode = 'Regular'): WorkerEntry => ({
  id: Math.floor(Math.random() * 1e9),
  assignmentId: 'acorns',
  date, start, end, hours, regularH: regular, otH: ot, status, payCode, costCode,
});

const vertex = (date: Date, start: string, end: string, hours: number, regular: number, ot: number, status: EntryStatus, costCode = 'Custodial'): WorkerEntry => ({
  id: Math.floor(Math.random() * 1e9),
  assignmentId: 'vertex',
  date, start, end, hours, regularH: regular, otH: ot, status, payCode: 'Regular', costCode,
});

// Current week (Mon–Fri so the colorful chart matches Figma; Sat/Sun blank)
const cw = (dow: number) => dayOfWeek(0, dow);
const lw = (dow: number) => dayOfWeek(-1, dow);
const nw = (dow: number) => dayOfWeek(1, dow);

export const ENTRIES: WorkerEntry[] = [
  // ── Current week — Acorns: Mon–Thu 8h, Wed has 1.5 OT, Fri MISSING ─────
  acorns(cw(1), '09:00', '12:00', 3, 3, 0, 'pending'),
  acorns(cw(1), '13:00', '18:00', 5, 5, 0, 'pending'),
  acorns(cw(2), '09:00', '12:00', 3, 3, 0, 'pending'),
  { ...acorns(cw(2), '11:30', '12:30', 1, 1, 0, 'pending'), hasConflict: true, conflictNote: 'Overlaps 9:00 AM – 12:00 PM punch on Secretary at Acorns' },
  acorns(cw(2), '13:00', '18:00', 5, 5, 0, 'pending'),
  acorns(cw(3), '09:00', '12:00', 3, 3, 0, 'pending'),
  acorns(cw(3), '13:00', '19:30', 6.5, 5, 1.5, 'pending'),
  acorns(cw(4), '09:00', '12:00', 3, 3, 0, 'pending'),
  acorns(cw(4), '13:00', '18:00', 5, 5, 0, 'pending'),

  // ── Current week — Vertex (Janitor): a few evening shifts ─────────────
  vertex(cw(3), '19:00', '21:00', 2, 2, 0, 'pending'),
  vertex(cw(4), '19:00', '21:00', 2, 2, 0, 'pending'),

  // ── Last week — all submitted, both assignments ───────────────────────
  acorns(lw(1), '09:00', '17:00', 8, 8, 0, 'submitted'),
  acorns(lw(2), '09:00', '17:00', 8, 8, 0, 'submitted'),
  acorns(lw(3), '09:00', '17:30', 8.5, 8, 0.5, 'submitted'),
  acorns(lw(4), '09:00', '17:00', 8, 8, 0, 'submitted'),
  acorns(lw(5), '09:00', '17:00', 8, 8, 0, 'submitted', 'PTO', 'PTO'),
  vertex(lw(2), '19:00', '21:00', 2, 2, 0, 'submitted'),
  vertex(lw(4), '19:00', '21:00', 2, 2, 0, 'submitted'),
];

// Recent timecards summary for the dashboard "Recent timecards" table.
// These reference paid-out periods that pre-date `ENTRIES` history.
export interface RecentTimecardRow {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  rangeLabel: string;
  hours: number;
  status: TimecardStatus;
  netPay: number;
  project: string;
}

const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtRange = (s: Date, e: Date) =>
  `${monthAbbr[s.getMonth()]} ${s.getDate()} – ${monthAbbr[e.getMonth()]} ${e.getDate()}`;

const ago = (days: number): Date => new Date(todayDate.getTime() - days * DAY_MS);

export const PAID_HISTORY: RecentTimecardRow[] = [
  { id: 'TC-2026-18-ACN', weekStart: ago(28), weekEnd: ago(14), rangeLabel: 'Apr 5 – Apr 18', hours: 76.0, status: 'paid', netPay: 2348.10, project: 'Cooper Center' },
  { id: 'TC-2026-16-ACN', weekStart: ago(42), weekEnd: ago(28), rangeLabel: 'Mar 22 – Apr 4',  hours: 80.0, status: 'paid', netPay: 2463.00, project: 'Cooper Center' },
  { id: 'TC-2026-14-ACN', weekStart: ago(56), weekEnd: ago(42), rangeLabel: 'Mar 8 – Mar 21',  hours: 72.5, status: 'paid', netPay: 2234.85, project: 'Cooper Center' },
  { id: 'TC-2026-12-ACN', weekStart: ago(70), weekEnd: ago(56), rangeLabel: 'Feb 22 – Mar 7',  hours: 80.0, status: 'paid', netPay: 2463.00, project: 'Cooper Center' },
  { id: 'TC-2026-10-ACN', weekStart: ago(84), weekEnd: ago(70), rangeLabel: 'Feb 8 – Feb 21',  hours: 80.0, status: 'paid', netPay: 2463.00, project: 'Cooper Center' },
];

export interface PayStub {
  id: string;
  date: string;       // 'Apr 25, 2026'
  shortRange: string; // 'Apr 5 – Apr 18 · 80.0 hrs'
  amount: number;
}

export const PAY_STUBS: PayStub[] = [
  { id: 'ps-1', date: 'Apr 25, 2026',  shortRange: 'Apr 5 – Apr 18 · 80.0 hrs',    amount: 2206.91 },
  { id: 'ps-2', date: 'Apr 11, 2026',  shortRange: 'Mar 22 – Apr 4 · 80.0 hrs',    amount: 2153.20 },
  { id: 'ps-3', date: 'Mar 28, 2026',  shortRange: 'Mar 8 – Mar 21 · 80.0 hrs',    amount: 2275.42 },
  { id: 'ps-4', date: 'Mar 14, 2026',  shortRange: 'Feb 22 – Mar 7 · 80.0 hrs',    amount: 2127.55 },
  { id: 'ps-5', date: 'Feb 28, 2026',  shortRange: 'Feb 8 – Feb 21 · 80.0 hrs',    amount: 2153.83 },
  { id: 'ps-6', date: 'Feb 14, 2026',  shortRange: 'Jan 25 – Feb 7 · 80.0 hrs',    amount: 2113.83 },
  { id: 'ps-7', date: 'Jan 31, 2026',  shortRange: 'Jan 11 – Jan 24 · 80.0 hrs',   amount: 2180.52 },
  { id: 'ps-8', date: 'Jan 17, 2026',  shortRange: 'Dec 28 – Jan 10 · 80.0 hrs',   amount: 2045.54 },
];

// Top-of-page activity feed for the dashboard right column.
export interface ActivityItem {
  id: string;
  kind: 'approved' | 'submitted' | 'updated' | 'paystub' | 'doc' | 'reminder';
  title: string;
  meta: string;
  date: string;
  time: string;
}

export const ACTIVITY: ActivityItem[] = [
  { id: 'a1', kind: 'approved',  title: 'Timecard approved',   meta: 'TC-2026-08 · 76.0 hrs',                    date: 'Apr 18', time: '9:12am' },
  { id: 'a2', kind: 'submitted', title: 'Timecard submitted',  meta: 'Sent to Jamie Patel',                       date: 'Apr 17', time: '5:42pm' },
  { id: 'a3', kind: 'updated',   title: 'Hours updated',       meta: 'Wed Apr 14 · 8.0 → 8.5 hrs',                 date: 'Apr 17', time: '12:24am' },
  { id: 'a4', kind: 'paystub',   title: 'Paystub posted',      meta: '$2,348.10 · DD —4021',                       date: 'Apr 11', time: '6:08am' },
  { id: 'a5', kind: 'approved',  title: 'Timecard approved',   meta: 'Apr 5 – Apr 18 · 80.0 hrs',                  date: 'Apr 5',  time: '9:51am' },
  { id: 'a6', kind: 'doc',       title: 'W-2 available',       meta: '2025 W-2 ready',                             date: 'Apr 1',  time: '12:00am' },
  { id: 'a7', kind: 'reminder',  title: 'Reminder sent',       meta: 'Submit by 5pm Friday',                       date: 'Mar 31', time: '8:00am' },
];

// Tax / HR documents featured on the dashboard.
export interface TaxDoc {
  id: string;
  name: string;
  subline: string;
}
export const TAX_DOCS: TaxDoc[] = [
  { id: 'w2',     name: 'W-2',     subline: 'Annual wages' },
  { id: '1095c',  name: '1095-C',  subline: 'Health coverage' },
  { id: '1099',   name: '1099',    subline: 'Contract pay' },
];

// All documents list for the Documents page.
export interface WorkerDoc {
  id: string;
  name: string;
  category: 'Tax' | 'Onboarding' | 'Other' | 'Cert';
  year: string;
  status: 'Available' | 'Pending year-end' | 'Active';
}

export const WORKER_DOCS: WorkerDoc[] = [
  { id: 'd1', name: '2026 W-2',        category: 'Tax',  year: '2026', status: 'Pending year-end' },
  { id: 'd2', name: '2025 W-2',        category: 'Tax',  year: '2025', status: 'Available' },
  { id: 'd3', name: '2024 W-2',        category: 'Tax',  year: '2024', status: 'Available' },
  { id: 'd4', name: '2025 1095-C',     category: 'Tax',  year: '2025', status: 'Available' },
  { id: 'd5', name: '2024 1095-C',     category: 'Tax',  year: '2024', status: 'Available' },
  { id: 'd6', name: '2024 1099-NEC',   category: 'Tax',  year: '2024', status: 'Available' },
  { id: 'd7', name: 'Cal-OSHA training', category: 'Cert', year: '2026', status: 'Active' },
  { id: 'd8', name: 'Office safety training', category: 'Onboarding', year: '2026', status: 'Active' },
  { id: 'd9', name: 'I-9 form',        category: 'Onboarding', year: '2026', status: 'Available' },
  { id: 'd10', name: 'Direct deposit form', category: 'Onboarding', year: '2026', status: 'Available' },
  { id: 'd11', name: 'Handbook acknowledgment', category: 'Onboarding', year: '2026', status: 'Available' },
  { id: 'd12', name: 'Background check release', category: 'Other', year: '2026', status: 'Available' },
];

export interface ActionDoc {
  id: string;
  name: string;
  meta: string;
}
export const ACTION_REQUIRED_DOCS: ActionDoc[] = [
  { id: 'ar1', name: 'I-9 re-verification', meta: 'Due May 15, 2026 · Operations' },
  { id: 'ar2', name: '2026 Code of Conduct', meta: 'Due May 15, 2026 · HRCenter' },
];

export const WORKER_USER = {
  name: 'Riley',
  fullName: 'Riley Dean',
  initials: 'RD',
  role: 'Field Worker',
  email: 'riley.dean@example.com',
} as const;
