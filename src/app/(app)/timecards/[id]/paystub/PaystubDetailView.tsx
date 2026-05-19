'use client';

import Link from 'next/link';
import { ChevronLeft, Eye, Download } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { PAY_STUBS } from '@/lib/worker-mock';
import Card from '@/components/worker/Card';

interface Props {
  id: string;
}

const EARNINGS = [
  { label: 'Regular',  meta: '80.0h · $35.00/hr', amount: 2800 },
  { label: 'Overtime', meta: '2.0h · $52.50/hr',  amount: 105 },
];
const GROSS = EARNINGS.reduce((s, e) => s + e.amount, 0);

const DEDUCTIONS = [
  { label: 'Federal income tax', amount: -248.20 },
  { label: 'State income tax (CA)', amount: -99.28 },
  { label: 'Social Security (6.2%)', amount: -177.94 },
  { label: 'Medicare (1.45%)', amount: -41.62 },
  { label: '401(k) — pre-tax', amount: -67.69 },
  { label: 'Health premium', amount: -28.36 },
];

const YTD = [
  { label: 'Gross',  value: '$2,870.00' },
  { label: 'Net',    value: '$2,206.91', accent: C.greenInk },
  { label: 'Hours',  value: '82.0h' },
  { label: 'Federal income tax', value: '$248.20' },
  { label: 'State income tax (CA)', value: '$99.28' },
  { label: 'FICA',   value: '$219.56' },
  { label: '401(k)', value: '$67.69' },
];

const TOTAL_DEDUCT = DEDUCTIONS.reduce((s, d) => s + d.amount, 0);
const NET = GROSS + TOTAL_DEDUCT;

export default function PaystubDetailView({ id }: Props) {
  return (
    <div className="px-8 py-7 max-w-[1180px] mx-auto">
      <div className="mb-4">
        <Link
          href="/timecards"
          className="inline-flex items-center gap-1 text-[12px]"
          style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}
        >
          <ChevronLeft size={13} /> Back to Timecards & pay
        </Link>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5">
        <div>
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
                {id}
              </div>
              <div className="flex items-center gap-2">
                <ActionBtn label="View PDF" icon={<Eye size={13} />} />
                <ActionBtn label="Download" icon={<Download size={13} />} />
              </div>
            </div>

            <h1 className="text-[26px] tracking-tight" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
              Pay statement
            </h1>
            <div className="text-[12px] mt-1 mb-6" style={{ color: C.muted, fontFamily: FONTS.sans }}>
              May 17, 2026
            </div>

            {/* Donut + net pay */}
            <div className="flex items-center justify-center gap-10 mb-6 py-4">
              <Donut />
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
                  Net pay
                </div>
                <div
                  className="text-[36px] tabular-nums leading-tight"
                  style={{ color: C.greenInk, fontFamily: FONTS.sans, fontWeight: 600 }}
                >
                  ${NET.toFixed(2)}
                </div>
              </div>
            </div>

            <SectionRow title="Earnings breakdown" subtitle="Hours worked this pay period and their gross">
              {EARNINGS.map((e) => (
                <Row key={e.label} label={e.label} meta={e.meta} amount={`$${e.amount.toFixed(0)}`} />
              ))}
              <Row label="Gross" amount={`$${GROSS.toFixed(0)}`} bold />
            </SectionRow>

            <SectionRow title="Deductions" subtitle="Taxes and pre-tax contributions">
              {DEDUCTIONS.map((d) => (
                <Row key={d.label} label={d.label} amount={`$${d.amount.toFixed(2)}`} />
              ))}
              <Row label="Total deductions" amount={`–$${Math.abs(TOTAL_DEDUCT).toFixed(2)}`} bold />
            </SectionRow>

            <SectionRow title="Year to date" subtitle="As of this pay stub">
              {YTD.map((y) => (
                <Row key={y.label} label={y.label} amount={y.value} accentColor={y.accent} />
              ))}
            </SectionRow>

            <div className="text-[11px] mt-3 text-center" style={{ color: C.muted, fontFamily: FONTS.sans }}>
              Showing 1 of 20 stubs in the year-to-date window.
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
            {PAY_STUBS.slice(0, 8).map((ps) => (
              <li key={ps.id} className="py-2 first:pt-0 flex items-start justify-between gap-3" style={{ borderColor: C.borderSoft }}>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                    {ps.date}
                  </div>
                  <div className="text-[10.5px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                    {ps.shortRange}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[12.5px] tabular-nums" style={{ color: C.greenInk, fontFamily: FONTS.sans, fontWeight: 600 }}>
                    ${ps.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="mt-0.5 text-[10.5px] flex items-center gap-2 justify-end" style={{ color: C.brand, fontFamily: FONTS.sans, fontWeight: 600 }}>
                    <span>PDF</span>
                    <span>Detail</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function ActionBtn({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-[12px]"
      style={{ backgroundColor: C.surface, color: C.body, border: `1px solid ${C.border}`, fontFamily: FONTS.sans, fontWeight: 600 }}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionRow({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-2 pb-2" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div>
          <div className="text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
            {title}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
            {subtitle}
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Row({ label, meta, amount, bold = false, accentColor }: { label: string; meta?: string; amount: string; bold?: boolean; accentColor?: string }) {
  return (
    <div
      className="flex items-center justify-between py-2"
      style={{ borderBottom: `1px solid ${C.borderSoft}` }}
    >
      <div>
        <div className="text-[12.5px]" style={{ color: C.body, fontFamily: FONTS.sans, fontWeight: bold ? 600 : 400 }}>
          {label}
        </div>
        {meta && (
          <div className="text-[10.5px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
            {meta}
          </div>
        )}
      </div>
      <div
        className="text-[13px] tabular-nums"
        style={{ color: accentColor ?? C.ink, fontFamily: FONTS.sans, fontWeight: bold ? 700 : 500 }}
      >
        {amount}
      </div>
    </div>
  );
}

function Donut() {
  // simple SVG donut with 5 wedges representing the deduction split
  const segments = [
    { color: '#10B981', pct: 76 },  // net (green) ~ majority
    { color: '#EF4444', pct: 9 },   // federal
    { color: '#F97316', pct: 4 },   // state
    { color: '#FACC15', pct: 5 },   // FICA
    { color: '#A78BFA', pct: 3 },   // 401k
    { color: '#3B82F6', pct: 3 },   // misc
  ];
  const r = 60;
  const cx = 72;
  const cy = 72;
  let acc = 0;
  return (
    <svg width={144} height={144} viewBox="0 0 144 144">
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={C.border} strokeWidth={0.5} />
      {segments.map((s, i) => {
        const start = acc;
        acc += s.pct;
        const a1 = (start / 100) * Math.PI * 2 - Math.PI / 2;
        const a2 = (acc / 100) * Math.PI * 2 - Math.PI / 2;
        const large = s.pct > 50 ? 1 : 0;
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const x2 = cx + r * Math.cos(a2);
        const y2 = cy + r * Math.sin(a2);
        return (
          <path
            key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
            fill={s.color}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={32} fill="#fff" />
    </svg>
  );
}
