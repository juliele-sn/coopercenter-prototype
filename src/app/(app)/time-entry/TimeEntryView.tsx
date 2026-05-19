'use client';

import { useMemo, useState } from 'react';
import { Plus, AlertTriangle, ChevronDown, MoreHorizontal, Copy } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { ASSIGNMENTS, type WorkerEntry } from '@/lib/worker-mock';
import { getTimecardsForOffset, startOfWeek, statusForOffset } from '@/lib/timecards';
import DateSwitcher from '@/components/worker/DateSwitcher';
import StatusChip from '@/components/worker/StatusChip';
import WeekChart, { WeekChartLegend } from '@/components/worker/WeekChart';
import MissingTimeAlert from '@/components/worker/MissingTimeAlert';
import HoursTotal from '@/components/worker/HoursTotal';
import PageHeader from '@/components/worker/PageHeader';
import Card from '@/components/worker/Card';
import Button from '@/components/worker/Button';

type Tab = 'all' | 'conflicts';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function TimeEntryView({ serverNow }: { serverNow: string }) {
  const today = useMemo(() => new Date(serverNow), [serverNow]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [tab, setTab] = useState<Tab>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | string>('all');
  const [assignmentMenuOpen, setAssignmentMenuOpen] = useState(false);

  const weekStart = useMemo(() => {
    const ws = startOfWeek(today);
    ws.setDate(ws.getDate() + weekOffset * 7);
    return ws;
  }, [today, weekOffset]);

  const timecards = useMemo(() => getTimecardsForOffset(today, weekOffset), [today, weekOffset]);
  const status = statusForOffset(weekOffset);
  const locked = status === 'approved' || status === 'paid';

  const allEntries = useMemo(
    () => timecards.flatMap((tc) => tc.entries),
    [timecards],
  );

  const filteredByAssignment = useMemo(() => {
    if (assignmentFilter === 'all') return allEntries;
    return allEntries.filter((e) => e.assignmentId === assignmentFilter);
  }, [allEntries, assignmentFilter]);

  const visibleEntries = useMemo(() => {
    if (tab === 'conflicts') return filteredByAssignment.filter((e) => e.hasConflict);
    return filteredByAssignment;
  }, [tab, filteredByAssignment]);

  const totalHours = filteredByAssignment.reduce((s, e) => s + e.hours, 0);
  const otHours = filteredByAssignment.reduce((s, e) => s + e.otH, 0);
  const conflictCount = allEntries.filter((e) => e.hasConflict).length;

  // Group by date for the list
  const byDay = useMemo(() => {
    const map = new Map<string, { date: Date; entries: WorkerEntry[] }>();
    const sorted = [...visibleEntries].sort((a, b) => +a.date - +b.date || a.start.localeCompare(b.start));
    for (const e of sorted) {
      const key = e.date.toDateString();
      const day = map.get(key) ?? { date: new Date(e.date), entries: [] };
      day.entries.push(e);
      map.set(key, day);
    }
    return [...map.values()];
  }, [visibleEntries]);

  const filterLabel = assignmentFilter === 'all'
    ? 'All assignments'
    : ASSIGNMENTS.find((a) => a.id === assignmentFilter)?.label ?? 'All assignments';

  return (
    <div className="px-8 py-7 max-w-[1320px] mx-auto">
      <PageHeader title="Time Entry" />

      <Card padding="lg" className="mb-5">
        <div className="flex items-center justify-between mb-5">
          <DateSwitcher
            weekOffset={weekOffset}
            weekStart={weekStart}
            onPrev={() => setWeekOffset((o) => o - 1)}
            onNext={() => setWeekOffset((o) => o + 1)}
          />
          <div className="flex items-center gap-2">
            {status !== 'current' && <StatusChip status={status} withCheck />}
            {!locked && (
              <Button variant="primary" leadingIcon={<Plus size={14} strokeWidth={2.5} />}>
                Add punch
              </Button>
            )}
          </div>
        </div>

        <HoursTotal totalHours={totalHours} otHours={otHours} />

        <div className="mt-4 mb-2">
          <WeekChartLegend />
        </div>

        <WeekChart
          weekStart={weekStart}
          entries={allEntries}
          today={today}
          forceFuture={weekOffset > 0}
        />

        {weekOffset === 0 && (
          <div className="mt-4">
            <MissingTimeAlert message="You're missing time for Fri May 15" />
          </div>
        )}
      </Card>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center gap-1 rounded-md p-0.5"
          style={{ backgroundColor: C.surfaceAlt, border: `1px solid ${C.border}` }}
        >
          <TabButton active={tab === 'all'} onClick={() => setTab('all')} label="All" count={filteredByAssignment.length} />
          <TabButton active={tab === 'conflicts'} onClick={() => setTab('conflicts')} label="Conflicts" count={conflictCount} accent={conflictCount > 0} />
        </div>

        <div className="relative">
          <button
            onClick={() => setAssignmentMenuOpen((o) => !o)}
            className="flex items-center gap-2 h-9 px-3 rounded-md"
            style={{
              backgroundColor: C.surface,
              color: C.body,
              border: `1px solid ${C.border}`,
              fontFamily: FONTS.sans,
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            {filterLabel}
            <ChevronDown size={13} />
          </button>
          {assignmentMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-20 rounded-md min-w-[200px] py-1 shadow-md"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => { setAssignmentFilter('all'); setAssignmentMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-[12.5px] hover:bg-[#FAFBFC]"
                style={{ color: C.ink, fontFamily: FONTS.sans }}
              >
                All assignments
              </button>
              {ASSIGNMENTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setAssignmentFilter(a.id); setAssignmentMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-[12.5px] hover:bg-[#FAFBFC]"
                  style={{ color: C.ink, fontFamily: FONTS.sans }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Day-grouped list */}
      <div className="flex flex-col gap-3">
        {byDay.length === 0 && (
          <Card padding="lg">
            <div className="text-center py-6">
              <div className="text-[13px]" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                {tab === 'conflicts' ? 'No conflicts this week.' : 'No punches logged this week.'}
              </div>
            </div>
          </Card>
        )}
        {byDay.map((day) => (
          <DayGroup key={day.date.toDateString()} day={day} locked={locked} />
        ))}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, count, accent }: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="text-[12.5px] px-2.5 py-1 rounded inline-flex items-center gap-1.5 transition-colors"
      style={{
        backgroundColor: active ? C.surface : 'transparent',
        color: active ? C.ink : C.muted,
        fontFamily: FONTS.sans,
        fontWeight: 600,
      }}
    >
      {label}
      <span
        className="text-[10px] px-1.5 rounded-full tabular-nums"
        style={{
          backgroundColor: accent ? C.redBg : active ? C.surfaceAlt : 'transparent',
          color: accent ? C.redInk : C.muted,
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    </button>
  );
}

function DayGroup({ day, locked }: { day: { date: Date; entries: WorkerEntry[] }; locked: boolean }) {
  const dow = DAYS_OF_WEEK[day.date.getDay()];
  const month = MONTH_NAMES[day.date.getMonth()];
  const conflictsToday = day.entries.filter((e) => e.hasConflict).length;
  return (
    <Card padding="none">
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: `1px solid ${C.borderSoft}` }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
            {dow}, {month} {day.date.getDate()}
          </span>
          {conflictsToday > 0 && (
            <span
              className="text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1"
              style={{ backgroundColor: C.redBg, color: C.redInk, fontFamily: FONTS.sans, fontWeight: 600 }}
            >
              <AlertTriangle size={11} />
              {conflictsToday} conflict{conflictsToday > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {!locked && (
          <button
            className="text-[11px] inline-flex items-center gap-1"
            style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}
          >
            <Copy size={11} /> Duplicate day
          </button>
        )}
      </div>
      <ul>
        {day.entries.map((e) => {
          const assignment = ASSIGNMENTS.find((a) => a.id === e.assignmentId);
          return (
            <li key={e.id} className="px-5 py-3 grid grid-cols-[140px_1fr_60px_auto] gap-3 items-center" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              <div className="min-w-0">
                <div className="text-[13px] tabular-nums" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                  {formatTime(e.start)} – {formatTime(e.end)}
                </div>
                <div className="text-[11px] mt-0.5 tabular-nums" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                  {e.hours.toFixed(1)}h
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 500 }}>
                  {assignment?.label}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                  {e.payCode} · {e.costCode}
                </div>
              </div>
              <div />
              <button className="p-1.5 rounded-md hover:bg-[#F4F6F8]" aria-label="Row actions" style={{ color: C.muted }}>
                <MoreHorizontal size={14} />
              </button>
              {e.hasConflict && (
                <div
                  className="col-span-4 -mt-1 rounded-md px-3 py-2 flex items-center justify-between"
                  style={{ backgroundColor: C.redBg, border: `1px solid ${C.redBorder}` }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertTriangle size={12} style={{ color: C.redInk }} />
                    <span style={{ color: C.redInk, fontFamily: FONTS.sans, fontSize: 12 }}>{e.conflictNote}</span>
                  </div>
                  <button
                    className="text-[11px] px-2.5 py-1 rounded-md"
                    style={{ backgroundColor: C.surface, color: C.redInk, border: `1px solid ${C.redBorder}`, fontFamily: FONTS.sans, fontWeight: 600 }}
                  >
                    Adjust times
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`;
}
