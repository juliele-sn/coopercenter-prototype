import { AlertTriangle } from 'lucide-react';
import { C, FONTS } from '@/lib/design';

interface MissingTimeAlertProps {
  message: string;
  onAddPunch?: () => void;
  buttonLabel?: string;
}

export default function MissingTimeAlert({
  message,
  onAddPunch,
  buttonLabel = 'Add punch',
}: MissingTimeAlertProps) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-md px-3.5 py-2.5"
      style={{ backgroundColor: '#FEF6E0', border: `1px solid ${C.dayMissingBorder}` }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <AlertTriangle size={14} style={{ color: C.amberInk }} />
        <span style={{ color: C.amberInk, fontFamily: FONTS.sans, fontSize: 12.5, fontWeight: 500 }}>
          {message}
        </span>
      </div>
      <button
        onClick={onAddPunch}
        className="text-[12px] px-2.5 py-1 rounded-md transition-opacity hover:opacity-80"
        style={{
          backgroundColor: C.surface,
          color: C.amberInk,
          border: `1px solid ${C.dayMissingBorder}`,
          fontFamily: FONTS.sans,
          fontWeight: 600,
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
