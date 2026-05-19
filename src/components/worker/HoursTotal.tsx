import { C, FONTS } from '@/lib/design';

interface HoursTotalProps {
  totalHours: number;
  dayTotal?: number;
  otHours?: number;
  assignmentLabel?: string;
}

export default function HoursTotal({ totalHours, dayTotal, otHours, assignmentLabel }: HoursTotalProps) {
  return (
    <div className="flex items-end justify-between gap-6 w-full">
      <div className="min-w-0">
        {assignmentLabel && (
          <div className="text-[11px] uppercase tracking-[0.18em] mb-1" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
            {assignmentLabel}
          </div>
        )}
        <div className="text-[11px] uppercase tracking-[0.18em] mb-0.5" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
          Total hours
        </div>
        <div
          className="text-[56px] leading-none tabular-nums tracking-tight"
          style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}
        >
          {totalHours.toFixed(1)}
        </div>
      </div>
      {(dayTotal !== undefined || otHours !== undefined) && (
        <div className="flex items-end gap-7 shrink-0">
          {dayTotal !== undefined && (
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
                Day total
              </div>
              <div className="text-[18px] tabular-nums mt-0.5" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                {dayTotal.toFixed(0)}h
              </div>
            </div>
          )}
          {otHours !== undefined && (
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}>
                OT
              </div>
              <div className="text-[18px] tabular-nums mt-0.5" style={{ color: C.otInk, fontFamily: FONTS.sans, fontWeight: 600 }}>
                {otHours.toFixed(1)}h
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
