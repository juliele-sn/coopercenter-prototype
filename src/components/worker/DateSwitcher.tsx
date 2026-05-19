'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { weekSwitcherLabel } from '@/lib/week-labels';

interface DateSwitcherProps {
  weekOffset: number;
  weekStart: Date;
  onPrev: () => void;
  onNext: () => void;
  disableNext?: boolean;
  size?: 'sm' | 'md';
}

export default function DateSwitcher({
  weekOffset,
  weekStart,
  onPrev,
  onNext,
  disableNext = false,
  size = 'md',
}: DateSwitcherProps) {
  const label = weekSwitcherLabel(weekOffset, weekStart);
  const h = size === 'sm' ? 32 : 36;
  const fs = size === 'sm' ? 12 : 13;

  return (
    <div
      className="inline-flex items-center rounded-md overflow-hidden"
      style={{ border: `1px solid ${C.border}`, backgroundColor: C.surface, height: h }}
    >
      <button
        onClick={onPrev}
        className="flex items-center justify-center px-2.5 transition-colors hover:bg-[#F4F6F8]"
        style={{ color: C.body, height: '100%' }}
        aria-label="Previous week"
      >
        <ChevronLeft size={14} />
      </button>
      <div
        className="px-4 flex items-center justify-center min-w-[112px] text-center"
        style={{
          color: C.ink,
          fontFamily: FONTS.sans,
          fontSize: fs,
          fontWeight: 600,
          borderLeft: `1px solid ${C.border}`,
          borderRight: `1px solid ${C.border}`,
          height: '100%',
        }}
      >
        {label}
      </div>
      <button
        onClick={onNext}
        disabled={disableNext}
        className="flex items-center justify-center px-2.5 transition-colors hover:bg-[#F4F6F8] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ color: C.body, height: '100%' }}
        aria-label="Next week"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
