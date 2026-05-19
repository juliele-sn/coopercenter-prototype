'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Send } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { type WorkerEntry } from '@/lib/worker-mock';
import { getTimecardsForOffset, startOfWeek, statusForOffset, type WorkerTimecard } from '@/lib/timecards';
import DateSwitcher from '@/components/worker/DateSwitcher';
import StatusChip from '@/components/worker/StatusChip';
import PageHeader from '@/components/worker/PageHeader';
import Card from '@/components/worker/Card';

const MONTHS_FULL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ATTESTATION = 'By submitting, I confirm these hours accurately reflect time worked. Submitted timecards lock until approver review.';

export default function SubmitView({ serverNow }: { serverNow: string }) {
  const today = useMemo(() => new Date(serverNow), [serverNow]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const [pendingSubmit, setPendingSubmit] = useState<string | null>(null);

  const weekStart = useMemo(() => {
    const ws = startOfWeek(today);
    ws.setDate(ws.getDate() + weekOffset * 7);
    return ws;
  }, [today, weekOffset]);

  const timecards = useMemo(() => getTimecardsForOffset(today, weekOffset), [today, weekOffset]);
  const periodStatus = statusForOffset(weekOffset);

  const confirmSubmit = () => {
    if (!pendingSubmit) return;
    setSubmittedIds((s) => new Set(s).add(pendingSubmit));
    setPendingSubmit(null);
  };

  return (
    <div className="px-8 py-7 max-w-[1320px] mx-auto">
      <PageHeader title="Review & submit" />

      <div className="mb-5 flex items-center justify-between">
        <DateSwitcher
          weekOffset={weekOffset}
          weekStart={weekStart}
          onPrev={() => setWeekOffset((o) => o - 1)}
          onNext={() => setWeekOffset((o) => Math.min(0, o + 1))}
          disableNext={weekOffset >= 0}
        />
        {periodStatus !== 'current' && <StatusChip status={periodStatus} withCheck />}
      </div>

      <div className="flex flex-col gap-5">
        {timecards.map((tc) => (
          <AssignmentSubmitCard
            key={tc.id}
            tc={tc}
            submitted={submittedIds.has(tc.id) || periodStatus === 'submitted' || periodStatus === 'approved' || periodStatus === 'paid'}
            periodStatus={periodStatus}
            onSubmit={() => setPendingSubmit(tc.id)}
          />
        ))}
      </div>

      {pendingSubmit && (
        <AttestationModal
          tc={timecards.find((t) => t.id === pendingSubmit)!}
          onCancel={() => setPendingSubmit(null)}
          onConfirm={confirmSubmit}
        />
      )}
    </div>
  );
}

function AssignmentSubmitCard({
  tc,
  submitted,
  periodStatus,
  onSubmit,
}: {
  tc: WorkerTimecard;
  submitted: boolean;
  periodStatus: ReturnType<typeof statusForOffset>;
  onSubmit: () => void;
}) {
  const a = tc.assignment;
  const ws = tc.weekStart;
  const we = new Date(ws);
  we.setDate(we.getDate() + 6);
  const submitDeadline = (() => {
    const d = new Date(ws);
    d.setDate(d.getDate() + 5); // Friday
    return `${MONTHS_FULL[d.getMonth()]} ${d.getDate()} · 5 PM`;
  })();

  const buttonLabel = submitted ? `Submitted to ${a.approverFirstName}` : `Submit ${a.client}`;

  return (
    <Card padding="lg">
      <div className="flex items-start justify-between mb-1">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
            {tc.id}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px]" style={{ color: C.muted, fontFamily: FONTS.sans }}>
            Sends to {a.approver}
          </div>
          <button
            disabled={submitted || periodStatus === 'approved' || periodStatus === 'paid'}
            onClick={onSubmit}
            className="mt-2 inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-[12.5px] disabled:opacity-60 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
            style={{
              backgroundColor: submitted ? C.surfaceAlt : C.brand,
              color: submitted ? C.muted : '#fff',
              fontFamily: FONTS.sans,
              fontWeight: 600,
              border: submitted ? `1px solid ${C.border}` : 'none',
            }}
          >
            {submitted && <StatusChip status="submitted" size="sm" />}
            {!submitted && (
              <>
                {buttonLabel} <ArrowRight size={12} />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <div
            className="text-[28px] tracking-tight leading-tight"
            style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}
          >
            {a.label}
          </div>
          <div className="text-[11px] mt-1" style={{ color: C.muted, fontFamily: FONTS.sans }}>
            Submit by {submitDeadline}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
            Total hours
          </div>
          <div
            className="text-[40px] leading-none tabular-nums tracking-tight mt-1"
            style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}
          >
            {tc.hours.toFixed(1)}
            <span className="text-[18px] ml-1" style={{ color: C.muted, fontWeight: 500 }}>
              /{a.expectedWeeklyHours} hrs
            </span>
          </div>
        </div>
      </div>

      <DayBreakdownTable entries={tc.entries} />

      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
          Note for approver
        </div>
        <textarea
          placeholder="Optional · e.g. 'Wed OT covered punchlist walk for HVAC sign-off.'"
          className="w-full rounded-md px-3 py-2.5 text-[13px] resize-none"
          rows={2}
          style={{
            backgroundColor: C.surfaceMuted,
            border: `1px solid ${C.border}`,
            color: C.body,
            fontFamily: FONTS.sans,
          }}
        />
      </div>
    </Card>
  );
}

function DayBreakdownTable({ entries }: { entries: WorkerEntry[] }) {
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
          {['Date', '', 'Cost code', 'Hours', 'OT'].map((h, i) => (
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
        {grouped.map(([key, dayEntries]) => {
          const d = new Date(key);
          const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
          const month = MONTHS_FULL[d.getMonth()];
          const hours = dayEntries.reduce((s, e) => s + e.regularH, 0);
          const ot = dayEntries.reduce((s, e) => s + e.otH, 0);
          const code = dayEntries[0].payCode === 'PTO' ? 'PTO' : dayEntries[0].costCode;
          return (
            <tr key={key}>
              <td className="py-2.5 text-[13px] tabular-nums" style={{ color: C.body, fontFamily: FONTS.sans, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}` }}>
                {month} {d.getDate()}
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

function AttestationModal({
  tc,
  onCancel,
  onConfirm,
}: {
  tc: WorkerTimecard;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(14, 22, 38, 0.45)' }}>
      <div
        className="w-full max-w-[440px] rounded-lg p-6"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: C.brandSoft, color: C.brand }}>
            <Send size={15} strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-[14px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
              Submit {tc.assignment.client}?
            </div>
            <div className="text-[11px]" style={{ color: C.muted, fontFamily: FONTS.sans }}>
              Sends {tc.hours.toFixed(1)} hrs to {tc.assignment.approver}
            </div>
          </div>
        </div>
        <p className="text-[12.5px] leading-relaxed mb-5" style={{ color: C.body, fontFamily: FONTS.sans }}>
          {ATTESTATION}
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="text-[12.5px] px-3 h-9 rounded-md"
            style={{ backgroundColor: C.surface, color: C.body, border: `1px solid ${C.border}`, fontFamily: FONTS.sans, fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-[12.5px] px-3 h-9 rounded-md inline-flex items-center gap-1.5"
            style={{ backgroundColor: C.brand, color: '#fff', fontFamily: FONTS.sans, fontWeight: 600 }}
          >
            Confirm & submit <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
