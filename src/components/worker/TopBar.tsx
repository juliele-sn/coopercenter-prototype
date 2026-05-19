'use client';

import { Bell, Search } from 'lucide-react';
import { C, FONTS } from '@/lib/design';

interface TopBarProps {
  initials: string;
}

export default function TopBar({ initials }: TopBarProps) {
  return (
    <header
      className="h-[56px] flex items-center gap-4 px-5 sticky top-0 z-30"
      style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: C.brand }}
        >
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#fff', opacity: 0.85 }} />
        </div>
        <div
          className="text-[16px] tracking-tight"
          style={{ color: C.ink, fontFamily: FONTS.serif, fontStyle: 'italic', fontWeight: 500 }}
        >
          CooperTime
        </div>
        <span
          className="text-[9px] uppercase tracking-[0.2em] px-1.5 py-[2px] rounded"
          style={{ backgroundColor: C.surfaceAlt, color: C.muted, fontFamily: FONTS.sans, fontWeight: 600 }}
        >
          WORKER
        </span>
      </div>

      <div className="flex-1 max-w-[640px] mx-auto">
        <div
          className="flex items-center gap-2 h-9 px-3 rounded-full"
          style={{ backgroundColor: C.surfaceAlt, border: `1px solid ${C.borderSoft}` }}
        >
          <Search size={15} style={{ color: C.mutedSoft }} />
          <span
            className="text-[13px] flex-1"
            style={{ color: C.mutedSoft, fontFamily: FONTS.sans }}
          >
            Search jobs, workers, periods...
          </span>
          <span
            className="text-[11px] px-1.5 py-[1px] rounded"
            style={{ backgroundColor: C.surface, color: C.muted, border: `1px solid ${C.border}`, fontFamily: FONTS.mono }}
          >
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center relative hover:bg-[var(--surface-alt)]"
          style={{ color: C.body }}
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span
            className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#EF4444' }}
          />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[12px]"
          style={{ backgroundColor: C.brand, color: '#fff', fontFamily: FONTS.sans, fontWeight: 600 }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
