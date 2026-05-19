import { C, FONTS } from '@/lib/design';
import type { WorkerEntry } from '@/lib/worker-mock';

interface WeekChartProps {
  weekStart: Date;
  entries: WorkerEntry[];
  today: Date;
  /** When true, all cells render as gray "future" tiles regardless of state. */
  forceFuture?: boolean;
  /** When true, all cells render as gray "no time" tiles regardless of state. */
  forceEmpty?: boolean;
}

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type CellState = 'logged' | 'missing' | 'future' | 'empty';

function buildCells(weekStart: Date, entries: WorkerEntry[], today: Date, forceFuture: boolean, forceEmpty: boolean) {
  const cells: { state: CellState; hours: number; date: Date }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const dayEntries = entries.filter((e) => {
      const ed = new Date(e.date);
      ed.setHours(0, 0, 0, 0);
      return ed.getTime() === d.getTime();
    });
    const hours = dayEntries.reduce((s, e) => s + e.hours, 0);
    const isWeekend = i === 0 || i === 6;
    const isFuture = d.getTime() > today.getTime();
    let state: CellState;
    if (forceFuture) state = 'future';
    else if (forceEmpty) state = isWeekend ? 'empty' : 'future';
    else if (isWeekend) state = 'empty';
    else if (hours > 0) state = 'logged';
    else if (isFuture) state = 'future';
    else state = 'missing';
    cells.push({ state, hours, date: d });
  }
  return cells;
}

const STATE_STYLE: Record<CellState, { bg: string; fg: string; border?: string }> = {
  logged:  { bg: C.dayLogged,  fg: '#fff' },
  missing: { bg: C.dayMissing, fg: C.amberInk, border: C.dayMissingBorder },
  future:  { bg: C.dayFuture,  fg: C.muted },
  empty:   { bg: C.dayFuture,  fg: C.mutedSoft },
};

export default function WeekChart({ weekStart, entries, today, forceFuture = false, forceEmpty = false }: WeekChartProps) {
  const cells = buildCells(weekStart, entries, today, forceFuture, forceEmpty);
  return (
    <div className="grid grid-cols-7 gap-2">
      {cells.map((c, i) => {
        const s = STATE_STYLE[c.state];
        return (
          <div
            key={i}
            className="rounded-md aspect-[1/1.05] flex flex-col items-center justify-center"
            style={{
              backgroundColor: s.bg,
              color: s.fg,
              border: s.border ? `1px solid ${s.border}` : 'none',
              fontFamily: FONTS.sans,
            }}
          >
            <div className="text-[11px] uppercase tracking-[0.1em] opacity-80" style={{ fontWeight: 500 }}>
              {DAY_LETTERS[i]}
            </div>
            <div className="text-[13px] tabular-nums mt-1" style={{ fontWeight: 600 }}>
              {c.state === 'logged' ? c.hours.toFixed(1) : '—'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function WeekChartLegend() {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.dayLogged }} />
        <span style={{ color: C.muted, fontFamily: FONTS.sans, fontSize: 11 }}>Logged</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.dayMissing, border: `1px solid ${C.dayMissingBorder}` }} />
        <span style={{ color: C.muted, fontFamily: FONTS.sans, fontSize: 11 }}>Missing</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.dayFuture }} />
        <span style={{ color: C.muted, fontFamily: FONTS.sans, fontSize: 11 }}>Future</span>
      </span>
    </div>
  );
}
