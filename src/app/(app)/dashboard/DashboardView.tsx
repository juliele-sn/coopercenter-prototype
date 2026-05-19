'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, FileText, ArrowRight, ChevronRight, CheckCircle2, Bell, FilePlus2, DollarSign, Send } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { ASSIGNMENTS, ACTIVITY, TAX_DOCS, type ActivityItem } from '@/lib/worker-mock';
import { getTimecardsForOffset, getRecentTimecardSummaries, startOfWeek, statusForOffset } from '@/lib/timecards';
import DateSwitcher from '@/components/worker/DateSwitcher';
import StatusChip from '@/components/worker/StatusChip';
import WeekChart, { WeekChartLegend } from '@/components/worker/WeekChart';
import MissingTimeAlert from '@/components/worker/MissingTimeAlert';
import HoursTotal from '@/components/worker/HoursTotal';
import Card from '@/components/worker/Card';
import Button from '@/components/worker/Button';

interface DashboardViewProps {
  userName: string;
  serverNow: string;
}

export default function DashboardView({ userName, serverNow }: DashboardViewProps) {
  const today = useMemo(() => new Date(serverNow), [serverNow]);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const ws = startOfWeek(today);
    ws.setDate(ws.getDate() + weekOffset * 7);
    return ws;
  }, [today, weekOffset]);

  const timecards = useMemo(() => getTimecardsForOffset(today, weekOffset), [today, weekOffset]);
  const recent = getRecentTimecardSummaries();
  const periodStatus = statusForOffset(weekOffset);

  const primary = timecards[0]; // Secretary at Acorns as the headline card
  const totalHours = timecards.reduce((s, t) => s + t.hours, 0);
  const otHours = timecards.reduce((s, t) => s + t.otHours, 0);
  // Day total for "today" if we're on the current week
  const dayTotal = (() => {
    if (weekOffset !== 0) return 0;
    const sod = new Date(today);
    sod.setHours(0, 0, 0, 0);
    const eod = new Date(sod);
    eod.setDate(eod.getDate() + 1);
    return timecards
      .flatMap((tc) => tc.entries)
      .filter((e) => e.date >= sod && e.date < eod)
      .reduce((s, e) => s + e.hours, 0);
  })();

  const hasMissing = weekOffset === 0;

  return (
    <div className="px-8 py-7 max-w-[1320px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-[26px] tracking-tight"
          style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}
        >
          Welcome back, {userName}
        </h1>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-5">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Hours hero card */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <DateSwitcher
                weekOffset={weekOffset}
                weekStart={weekStart}
                onPrev={() => setWeekOffset((o) => o - 1)}
                onNext={() => setWeekOffset((o) => o + 1)}
              />
              <div className="flex items-center gap-2">
                {periodStatus !== 'current' && <StatusChip status={periodStatus} withCheck />}
                <Button variant="primary" leadingIcon={<Plus size={14} strokeWidth={2.5} />}>
                  Add punch
                </Button>
              </div>
            </div>

            <HoursTotal
              totalHours={totalHours}
              dayTotal={weekOffset === 0 ? dayTotal : undefined}
              otHours={otHours}
            />

            <div className="mt-4 mb-2">
              <WeekChartLegend />
            </div>

            <WeekChart
              weekStart={weekStart}
              entries={timecards.flatMap((tc) => tc.entries)}
              today={today}
              forceFuture={weekOffset > 0}
            />

            {hasMissing && (
              <div className="mt-4">
                <MissingTimeAlert message={`You're missing time for ${formatMissingDate(weekStart)}`} />
              </div>
            )}

            {ASSIGNMENTS.length > 1 && (
              <div className="mt-5 pt-4 border-t" style={{ borderColor: C.border }}>
                <div className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
                  Active assignments
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {timecards.map((tc) => (
                    <div
                      key={tc.id}
                      className="rounded-md px-3.5 py-3 flex items-center justify-between"
                      style={{ border: `1px solid ${C.border}`, backgroundColor: C.surfaceMuted }}
                    >
                      <div className="min-w-0">
                        <div className="text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                          {tc.assignment.label}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                          {tc.hours.toFixed(1)}h logged · {tc.otHours.toFixed(1)}h OT
                        </div>
                      </div>
                      <Link
                        href={`/timecards/${tc.id}`}
                        className="text-[11px] inline-flex items-center gap-1"
                        style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}
                      >
                        View <ChevronRight size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Recent timecards */}
          <Card padding="lg">
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-[15px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                  Recent timecards
                </h2>
                <p className="text-[12px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                  Past 5 pay periods
                </p>
              </div>
              <Link
                href="/timecards"
                className="text-[12px] inline-flex items-center gap-1"
                style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <table className="w-full">
              <thead>
                <tr>
                  {['Pay period', 'Hours', 'Status', 'Net pay'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] uppercase tracking-[0.15em] pb-2 pt-2"
                      style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAFBFC]">
                    <td className="py-3 text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, borderBottom: `1px solid ${C.borderSoft}` }}>
                      <Link href={`/timecards/${r.id}`} className="hover:underline">
                        {r.rangeLabel}
                      </Link>
                    </td>
                    <td className="py-3 text-[13px] tabular-nums" style={{ color: C.body, fontFamily: FONTS.sans, borderBottom: `1px solid ${C.borderSoft}` }}>
                      {r.hours.toFixed(1)}
                    </td>
                    <td className="py-3" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                      <StatusChip status={r.status} />
                    </td>
                    <td className="py-3 text-[13px] tabular-nums" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}` }}>
                      ${r.netPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Tax docs */}
          <Card padding="md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[14px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                  Tax Documents
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                  W-2, 1095-C, 1099
                </div>
              </div>
              <Link
                href="/documents"
                className="text-[11px] inline-flex items-center gap-1"
                style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}
              >
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {TAX_DOCS.map((d) => (
                <Link
                  key={d.id}
                  href="/documents"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-[#FAFBFC]"
                  style={{ border: `1px solid ${C.border}` }}
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: C.brandSoft, color: C.brand }}
                  >
                    <FileText size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                      {d.name}
                    </div>
                    <div className="text-[11px]" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                      {d.subline}
                    </div>
                  </div>
                  <ArrowRight size={13} style={{ color: C.muted }} />
                </Link>
              ))}
            </div>
          </Card>

          {/* Activity */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[14px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                  Activity
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                  Last 30 days
                </div>
              </div>
              <div
                className="flex items-center gap-0.5 rounded-md p-0.5"
                style={{ backgroundColor: C.surfaceAlt }}
              >
                {['All', 'Cards', 'Pay'].map((t, i) => (
                  <button
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded transition-colors"
                    style={{
                      backgroundColor: i === 0 ? C.surface : 'transparent',
                      color: i === 0 ? C.ink : C.muted,
                      fontFamily: FONTS.sans,
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ul className="flex flex-col">
              {ACTIVITY.slice(0, 7).map((a) => (
                <ActivityRow key={a.id} item={a} />
              ))}
            </ul>
            <div className="pt-3 mt-1 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
              <span className="text-[11px]" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                Showing 7 of 24
              </span>
              <button
                className="text-[11px] inline-flex items-center gap-1"
                style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}
              >
                View all activity <ArrowRight size={11} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const ICON_BY_KIND: Record<ActivityItem['kind'], React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  approved:  CheckCircle2,
  submitted: Send,
  updated:   FilePlus2,
  paystub:   DollarSign,
  doc:       FileText,
  reminder:  Bell,
};

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = ICON_BY_KIND[item.kind];
  const tint = item.kind === 'approved' ? C.greenInk : item.kind === 'submitted' ? C.brand : item.kind === 'paystub' ? C.greenInk : C.muted;
  return (
    <li className="flex items-start gap-2.5 py-2.5" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
      <div className="mt-0.5 shrink-0">
        <Icon size={13} strokeWidth={2.2} style={{ color: tint }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 500 }}>
          {item.title}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
          {item.meta}
        </div>
      </div>
      <div className="text-right text-[10px] shrink-0" style={{ color: C.muted, fontFamily: FONTS.sans }}>
        <div>{item.date}</div>
        <div className="mt-0.5 tabular-nums">{item.time}</div>
      </div>
    </li>
  );
}

const MONTHS_FULL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatMissingDate(weekStart: Date) {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + 5); // Friday
  return `Fri ${MONTHS_FULL[d.getMonth()]} ${d.getDate()}`;
}
