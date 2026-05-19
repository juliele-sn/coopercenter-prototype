'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Clock, ArrowUp, ListChecks, Receipt, FileText } from 'lucide-react';
import { C, FONTS } from '@/lib/design';

const NAV = [
  { href: '/dashboard',     label: 'Dashboard',       icon: LayoutGrid },
  { href: '/time-entry',    label: 'Time entry',      icon: Clock },
  { href: '/submit',        label: 'Review & Submit', icon: ArrowUp },
  { href: '/timecards',     label: 'Timecards & pay', icon: ListChecks },
  { href: '/expenses',      label: 'Expenses',        icon: Receipt },
  { href: '/documents',     label: 'Documents',       icon: FileText },
];

export default function WorkerSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-[208px] shrink-0 flex flex-col py-4 px-2 sticky top-[56px] self-start"
      style={{
        backgroundColor: C.surface,
        borderRight: `1px solid ${C.border}`,
        height: 'calc(100vh - 56px)',
      }}
    >
      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors"
              style={{
                backgroundColor: active ? C.brandSoft : 'transparent',
                color: active ? C.brand : C.body,
                fontFamily: FONTS.sans,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon size={15} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
