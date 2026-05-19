// Timecard-level data layer. The Figma worker flow organizes around full
// weekly timecards (one per worker × assignment × week), so this module
// rolls the punch-level ENTRIES up to a per-assignment record per week.

import type { TimecardStatus } from './design';
import { ASSIGNMENTS, ENTRIES, PAID_HISTORY, PAY_STUBS, type Assignment, type WorkerEntry } from './worker-mock';
import { weekRangeLabel } from './week-labels';

export interface WorkerTimecard {
  id: string;
  assignment: Assignment;
  weekStart: Date;
  weekEnd: Date;
  weekOffset: number;
  rangeLabel: string;
  hours: number;
  regularHours: number;
  otHours: number;
  status: TimecardStatus;
  entries: WorkerEntry[];
}

export const startOfWeek = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
};

const isoWeek = (d: Date): number => {
  const t = new Date(d.valueOf());
  const day = (d.getDay() + 6) % 7;
  t.setDate(t.getDate() - day + 3);
  const firstThu = t.valueOf();
  t.setMonth(0, 1);
  if (t.getDay() !== 4) t.setMonth(0, 1 + ((4 - t.getDay()) + 7) % 7);
  return 1 + Math.ceil((firstThu - t.valueOf()) / 604800000);
};

const sum = (es: WorkerEntry[], k: 'hours' | 'regularH' | 'otH') =>
  es.reduce((s, e) => s + (e[k] ?? 0), 0);

export const buildTimecard = (
  assignment: Assignment,
  weekStart: Date,
  weekOffset: number,
  status: TimecardStatus,
): WorkerTimecard => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59);
  const entries = ENTRIES.filter(
    (e) =>
      e.assignmentId === assignment.id &&
      e.date >= weekStart &&
      e.date <= weekEnd,
  );
  return {
    id: `TC-2026-${String(isoWeek(weekStart)).padStart(2, '0')}-${assignment.shortCode}`,
    assignment,
    weekStart,
    weekEnd,
    weekOffset,
    rangeLabel: weekRangeLabel(weekStart),
    hours: sum(entries, 'hours'),
    regularHours: sum(entries, 'regularH'),
    otHours: sum(entries, 'otH'),
    status,
    entries,
  };
};

export const statusForOffset = (offset: number): TimecardStatus => {
  if (offset > 0) return 'draft';
  if (offset === 0) return 'current';
  if (offset === -1) return 'submitted';
  if (offset === -2) return 'approved';
  return 'paid';
};

export const getTimecardsForOffset = (today: Date, offset: number): WorkerTimecard[] => {
  const ws = startOfWeek(today);
  ws.setDate(ws.getDate() + offset * 7);
  const status = statusForOffset(offset);
  return ASSIGNMENTS.map((a) => buildTimecard(a, ws, offset, status));
};

export const getRecentTimecardSummaries = () => PAID_HISTORY;
export const getPayStubs = () => PAY_STUBS;
