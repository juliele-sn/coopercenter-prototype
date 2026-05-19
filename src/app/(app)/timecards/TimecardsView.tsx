'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ChevronDown } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { PAID_HISTORY, PAY_STUBS } from '@/lib/worker-mock';
import StatusChip from '@/components/worker/StatusChip';
import PageHeader from '@/components/worker/PageHeader';
import Card from '@/components/worker/Card';

const KPIS = [
  { label: 'YTD Gross',   value: '$24,615.00', sub: '9 pay periods' },
  { label: 'YTD Net',     value: '$18,932.40', sub: 'After taxes & deductions' },
  { label: 'YTD Hours',   value: '642.5h',     sub: 'Reg 580 · OT 14.5' },
  { label: 'Last paystub',value: '$2,206.91',  sub: 'Apr 25 · DD —4420' },
];

const ALL_TIMECARDS = [
  { id: 'TC-2026-19-ACN', rangeLabel: 'Apr 19 – May 2',  project: 'Cooper Center',  hours: 88.5, posted: 'Today',   status: 'submitted' as const },
  { id: 'TC-2026-17-ACN', rangeLabel: 'Apr 5 – Apr 18',  project: 'Cooper Center',  hours: 82.0, posted: 'Apr 19',  status: 'approved' as const },
  ...PAID_HISTORY.slice(1).map((r) => ({
    id: r.id,
    rangeLabel: r.rangeLabel,
    project: r.project,
    hours: r.hours,
    posted: r.rangeLabel.split('–')[1].trim(),
    status: r.status,
  })),
  { id: 'TC-2026-08-ACN', rangeLabel: 'Jan 25 – Feb 7',  project: 'Cooper / Punch',  hours: 78.5, posted: 'Feb 9',   status: 'paid' as const },
  { id: 'TC-2026-06-ACN', rangeLabel: 'Jan 11 – Jan 24', project: 'Cooper / Punch',  hours: 81.0, posted: 'Jan 25',  status: 'paid' as const },
  { id: 'TC-2026-04-ACN', rangeLabel: 'Dec 28 – Jan 10', project: 'Cooper / Punch',  hours: 76.0, posted: 'Jan 11',  status: 'paid' as const },
  { id: 'TC-2026-02-ACN', rangeLabel: 'Dec 14 – Dec 27', project: 'Cooper / Punch',  hours: 72.5, posted: 'Dec 28',  status: 'paid' as const },
];

export default function TimecardsView() {
  const [filter, setFilter] = useState('');

  const visible = useMemo(() => {
    if (!filter) return ALL_TIMECARDS;
    const f = filter.toLowerCase();
    return ALL_TIMECARDS.filter(
      (t) => t.rangeLabel.toLowerCase().includes(f) || t.project.toLowerCase().includes(f) || t.id.toLowerCase().includes(f),
    );
  }, [filter]);

  return (
    <div className="px-8 py-7 max-w-[1320px] mx-auto">
      <PageHeader title="Timecards & pay" subtitle="Submitted timecards, approval status, and pay stubs" />

      <div className="grid grid-cols-4 gap-3 mb-5">
        {KPIS.map((k) => (
          <Card key={k.label} padding="md">
            <div className="text-[10px] uppercase tracking-[0.18em] mb-1" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
              {k.label}
            </div>
            <div
              className="text-[24px] tabular-nums leading-tight"
              style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}
            >
              {k.value}
            </div>
            <div className="text-[11px] mt-1" style={{ color: C.muted, fontFamily: FONTS.sans }}>
              {k.sub}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5">
        <div>
          <div
            className="flex items-center gap-2 mb-4 px-3 h-9 rounded-md"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          >
            <Search size={14} style={{ color: C.mutedSoft }} />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by period or project..."
              className="flex-1 bg-transparent outline-none text-[12.5px]"
              style={{ color: C.ink, fontFamily: FONTS.sans }}
            />
            <FilterPill label="All" active />
            <FilterPill label="Projects: All projects" />
            <FilterPill label="Status: All statuses" />
            <FilterPill label="Year: All years" />
          </div>

          <Card padding="none">
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: `1px solid ${C.borderSoft}` }}
            >
              <div className="text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                All timecards ({visible.length})
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  {['Pay period', 'Project', 'Hours', '', 'Status', ''].map((h, i) => (
                    <th
                      key={i}
                      className="text-left text-[10px] uppercase tracking-[0.15em] pb-2 pt-3 px-5"
                      style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FAFBFC]">
                    <td className="py-3 px-5 text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 500, borderBottom: `1px solid ${C.borderSoft}` }}>
                      <Link href={`/timecards/${t.id}`} className="hover:underline">
                        {t.rangeLabel}
                      </Link>
                    </td>
                    <td className="py-3 px-5 text-[12.5px]" style={{ color: C.body, fontFamily: FONTS.sans, borderBottom: `1px solid ${C.borderSoft}` }}>
                      {t.project}
                    </td>
                    <td className="py-3 px-5 text-[13px] tabular-nums" style={{ color: C.body, fontFamily: FONTS.sans, borderBottom: `1px solid ${C.borderSoft}` }}>
                      {t.hours.toFixed(1)}
                    </td>
                    <td className="py-3 px-5 text-[11px]" style={{ color: C.muted, fontFamily: FONTS.sans, borderBottom: `1px solid ${C.borderSoft}` }}>
                      {t.posted}
                    </td>
                    <td className="py-3 px-5" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                      <StatusChip status={t.status} />
                    </td>
                    <td className="py-3 px-5 text-right" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                      <Link
                        href={`/timecards/${t.id}`}
                        className="text-[12px] inline-flex items-center gap-1"
                        style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}
                      >
                        View <ArrowRight size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: `1px solid ${C.borderSoft}` }}
            >
              <span className="text-[11px]" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                Showing {visible.length} of 20
              </span>
              <button className="text-[12px] inline-flex items-center gap-1" style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}>
                All timecards <ArrowRight size={11} />
              </button>
            </div>
          </Card>
        </div>

        <Card padding="md">
          <div className="text-[14px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
            Pay stubs
          </div>
          <div className="text-[11px] mt-0.5 mb-3" style={{ color: C.muted, fontFamily: FONTS.sans }}>
            Weekly · Direct deposit —3409
          </div>
          <ul className="flex flex-col divide-y" style={{ borderColor: C.borderSoft }}>
            {PAY_STUBS.map((ps) => (
              <li key={ps.id} className="py-2.5 first:pt-0 flex items-start justify-between gap-3" style={{ borderColor: C.borderSoft }}>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                    {ps.date}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                    {ps.shortRange}
                  </div>
                  <div className="text-[11px] mt-1 flex items-center gap-2">
                    <Link href={`/timecards/${ps.id}/paystub`} className="hover:underline" style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}>
                      PDF
                    </Link>
                    <Link href={`/timecards/${ps.id}/paystub`} className="hover:underline" style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}>
                      Detail
                    </Link>
                  </div>
                </div>
                <div className="text-[13px] tabular-nums shrink-0" style={{ color: C.greenInk, fontFamily: FONTS.sans, fontWeight: 600 }}>
                  ${ps.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </li>
            ))}
          </ul>
          <div className="pt-3 mt-1 flex items-center justify-between" style={{ borderTop: `1px solid ${C.border}` }}>
            <span className="text-[11px]" style={{ color: C.muted, fontFamily: FONTS.sans }}>
              Showing {PAY_STUBS.length} of 12
            </span>
            <button className="text-[12px] inline-flex items-center gap-1" style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}>
              All pay stubs <ArrowRight size={11} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FilterPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className="text-[11.5px] px-2.5 h-7 rounded-md inline-flex items-center gap-1 shrink-0"
      style={{
        backgroundColor: active ? C.ink : C.surface,
        color: active ? '#fff' : C.body,
        border: active ? 'none' : `1px solid ${C.border}`,
        fontFamily: FONTS.sans,
        fontWeight: 600,
      }}
    >
      {label}
      {!active && <ChevronDown size={11} />}
    </button>
  );
}
