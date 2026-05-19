'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Building2, Briefcase } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { ASSIGNMENTS, type WorkerEntry } from '@/lib/worker-mock';
import { getTimecardsForOffset, startOfWeek, type WorkerTimecard } from '@/lib/timecards';
import DateSwitcher from '@/components/worker/DateSwitcher';
import StatusChip from '@/components/worker/StatusChip';
import PageHeader from '@/components/worker/PageHeader';
import Card from '@/components/worker/Card';

const MONTHS_FULL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Props {
  id: string;
  serverNow: string;
}

export default function TimecardDetailView({ id, serverNow }: Props) {
  const today = useMemo(() => new Date(serverNow), [serverNow]);
  // Default to the previous-week offset so the demo data shows a full timecard
  const [weekOffset, setWeekOffset] = useState(-1);

  const weekStart = useMemo(() => {
    const ws = startOfWeek(today);
    ws.setDate(ws.getDate() + weekOffset * 7);
    return ws;
  }, [today, weekOffset]);

  const timecards = useMemo(() => getTimecardsForOffset(today, weekOffset), [today, weekOffset]);
  // Multi-assignment: render all timecards for that week
  const multiAssignment = ASSIGNMENTS.length > 1;
  const status = timecards[0]?.status ?? 'paid';

  return (
    <div className="px-8 py-7 max-w-[1080px] mx-auto">
      <div className="mb-4">
        <Link
          href="/timecards"
          className="inline-flex items-center gap-1 text-[12px]"
          style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}
        >
          <ChevronLeft size={13} /> Back to Timecards & pay
        </Link>
      </div>

      <div className="flex items-center justify-between mb-5">
        <DateSwitcher
          weekOffset={weekOffset}
          weekStart={weekStart}
          onPrev={() => setWeekOffset((o) => o - 1)}
          onNext={() => setWeekOffset((o) => o + 1)}
        />
        <StatusChip status={status} withCheck />
      </div>

      {multiAssignment && (
        <div className="mb-5">
          <PageHeader title={`Timecards · ${timecards[0]?.rangeLabel}`} subtitle={`${timecards.length} assignments this week · ${id}`} />
        </div>
      )}

      <div className="flex flex-col gap-5">
        {timecards.map((tc, idx) => (
          <TimecardSection key={tc.id} tc={tc} index={idx} />
        ))}
      </div>

      <Card padding="lg" className="mt-5">
        <div className="text-[14px] mb-1" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
          Approval
        </div>
        <div className="text-[12px] mb-3" style={{ color: C.muted, fontFamily: FONTS.sans }}>
          Trail of approvals and payroll status
        </div>
        <ApprovalTimeline status={status} approver={timecards[0]?.assignment.approver ?? 'M. Reyes'} />
      </Card>
    </div>
  );
}

function TimecardSection({ tc, index }: { tc: WorkerTimecard; index: number }) {
  const a = tc.assignment;
  const ws = tc.weekStart;
  const we = new Date(ws);
  we.setDate(we.getDate() + 6);
  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
          {tc.id}
        </div>
        <div className="text-[11px]" style={{ color: C.muted, fontFamily: FONTS.sans }}>
          Approver {a.approver}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: index === 0 ? C.brandSoft : '#FDF2D9', color: index === 0 ? C.brand : '#A07415' }}>
          {a.role === 'Janitor' ? <Building2 size={13} /> : <Briefcase size={13} />}
        </div>
        <h2 className="text-[24px] tracking-tight" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
          {a.label}
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-4 mb-4">
        <KeyVal label="Period" value={`${MONTHS_FULL[ws.getMonth()]} ${ws.getDate()} – ${MONTHS_FULL[we.getMonth()]} ${we.getDate()}`} />
        <KeyVal label="Assignment" value={a.client} />
        <KeyVal label="Hours" value={`${tc.hours.toFixed(1)}h`} accent />
        <KeyVal label="OT" value={tc.otHours > 0 ? `${tc.otHours.toFixed(1)}h` : '—'} accent={tc.otHours > 0} accentColor={tc.otHours > 0 ? C.otInk : undefined} />
      </div>

      <DayTable entries={tc.entries} />
    </Card>
  );
}

function KeyVal({ label, value, accent = false, accentColor }: { label: string; value: string; accent?: boolean; accentColor?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
        {label}
      </div>
      <div
        className={`tabular-nums ${accent ? 'text-[20px]' : 'text-[15px]'}`}
        style={{ color: accentColor ?? C.ink, fontFamily: FONTS.sans, fontWeight: accent ? 600 : 500 }}
      >
        {value}
      </div>
    </div>
  );
}

function DayTable({ entries }: { entries: WorkerEntry[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, WorkerEntry[]>();
    for (const e of entries) {
      const k = e.date.toDateString();
      const list = map.get(k) ?? [];
      list.push(e);
      map.set(k, list);
    }
    return [...map.entries()].sort((a, b) => +new Date(a[0]) - +new Date(b[0]));
  }, [entries]);

  return (
    <table className="w-full">
      <thead>
        <tr>
          {['Date', '', 'Pay code', 'Hours', 'OT'].map((h, i) => (
            <th
              key={i}
              className="text-left text-[10px] uppercase tracking-[0.15em] pb-2 pt-2"
              style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grouped.map(([key, day]) => {
          const d = new Date(key);
          const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
          const hours = day.reduce((s, e) => s + e.regularH, 0);
          const ot = day.reduce((s, e) => s + e.otH, 0);
          const code = day[0].payCode === 'PTO' ? 'PTO' : 'Regular';
          return (
            <tr key={key}>
              <td className="py-2.5 text-[13px] tabular-nums" style={{ color: C.body, fontFamily: FONTS.sans, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}` }}>
                {MONTHS_FULL[d.getMonth()]} {d.getDate()}
              </td>
              <td className="py-2.5 text-[12px]" style={{ color: C.muted, fontFamily: FONTS.sans, borderBottom: `1px solid ${C.borderSoft}` }}>
                {dow}
              </td>
              <td className="py-2.5 text-[13px]" style={{ color: C.body, fontFamily: FONTS.sans, borderBottom: `1px solid ${C.borderSoft}` }}>
                {code}
              </td>
              <td className="py-2.5 text-[13px] tabular-nums" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}` }}>
                {hours.toFixed(1)}
              </td>
              <td className="py-2.5 text-[13px] tabular-nums" style={{ color: ot > 0 ? C.otInk : C.muted, fontFamily: FONTS.sans, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}` }}>
                {ot > 0 ? ot.toFixed(1) : '—'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ApprovalTimeline({ status, approver }: { status: WorkerTimecard['status']; approver: string }) {
  const steps = [
    { id: 'submitted', label: 'Submitted',  meta: `Sent to ${approver}`,                  done: status === 'submitted' || status === 'approved' || status === 'paid', date: 'Apr 5' },
    { id: 'approved',  label: 'Approved',   meta: `${approver} approved this timecard`,   done: status === 'approved' || status === 'paid',                            date: 'Apr 9' },
    { id: 'paid',      label: 'Paid',       meta: 'Deposited via DD —3409',               done: status === 'paid',                                                     date: 'Apr 11, 2026' },
  ];
  return (
    <ul className="flex flex-col gap-2.5">
      {steps.map((s) => (
        <li key={s.id} className="flex items-start gap-3">
          <span
            className="w-2 h-2 rounded-full mt-2 shrink-0"
            style={{ backgroundColor: s.done ? C.greenInk : C.mutedSoft }}
          />
          <div className="flex-1">
            <div className="text-[12.5px]" style={{ color: s.done ? C.ink : C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
              {s.label}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
              {s.meta}
            </div>
          </div>
          <div className="text-[11px] tabular-nums" style={{ color: C.muted, fontFamily: FONTS.sans }}>
            {s.done ? s.date : '—'}
          </div>
        </li>
      ))}
    </ul>
  );
}
