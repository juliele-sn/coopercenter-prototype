import { Check } from 'lucide-react';
import { C, FONTS, TIMECARD_STATUS_META, type TimecardStatus } from '@/lib/design';

interface StatusChipProps {
  status: TimecardStatus;
  size?: 'sm' | 'md';
  withCheck?: boolean;
}

export default function StatusChip({ status, size = 'sm', withCheck = false }: StatusChipProps) {
  const meta = TIMECARD_STATUS_META[status];
  if (!meta) return null;

  const pad = size === 'sm' ? 'px-2 py-[2px] text-[11px]' : 'px-2.5 py-[3px] text-[12px]';
  return (
    <span
      className={`inline-flex items-center gap-1 ${pad} rounded-full`}
      style={{
        backgroundColor: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        fontFamily: FONTS.sans,
        fontWeight: 500,
      }}
    >
      {meta.label}
      {(withCheck && (status === 'paid' || status === 'approved')) && (
        <Check size={11} strokeWidth={3} />
      )}
    </span>
  );
}

// A small inline indicator dot for status legends.
export function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span style={{ color: C.muted, fontFamily: FONTS.sans, fontSize: 11 }}>{label}</span>
    </span>
  );
}
