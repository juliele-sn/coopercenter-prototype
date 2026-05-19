'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Search, FileText, Upload, AlertTriangle, ExternalLink } from 'lucide-react';
import { C, FONTS } from '@/lib/design';
import { WORKER_DOCS, ACTION_REQUIRED_DOCS, type WorkerDoc } from '@/lib/worker-mock';
import PageHeader from '@/components/worker/PageHeader';
import Card from '@/components/worker/Card';

type DocTab = 'All' | 'Tax' | 'Onboarding' | 'Other';

const STATUS_STYLE: Record<WorkerDoc['status'], { color: string; bg: string; border: string }> = {
  Available:          { color: C.greenInk, bg: C.greenBg,  border: C.greenBorder },
  Active:             { color: C.greenInk, bg: C.greenBg,  border: C.greenBorder },
  'Pending year-end': { color: C.amberInk, bg: C.amberBg,  border: C.amberBorder },
};

export default function DocumentsView() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<DocTab>('All');
  const [signed, setSigned] = useState<Set<string>>(new Set());

  const remainingActionRequired = ACTION_REQUIRED_DOCS.filter((d) => !signed.has(d.id));
  const allSigned = remainingActionRequired.length === 0;

  const visible = useMemo(() => {
    let list = WORKER_DOCS;
    if (tab !== 'All') {
      list = list.filter((d) => d.category === tab || (tab === 'Other' && d.category === 'Cert'));
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(s));
    }
    return list;
  }, [tab, search]);

  return (
    <div className="px-8 py-7 max-w-[1320px] mx-auto">
      <PageHeader title="Documents" subtitle="Tax forms, onboarding, certifications" />

      <div className="grid grid-cols-[1fr_300px] gap-5">
        <div className="flex flex-col gap-5">
          {!allSigned && (
            <Card padding="md">
              <div className="text-[13px] mb-3" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                Action Required
              </div>
              <div className="flex flex-col gap-2">
                {remainingActionRequired.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-3 rounded-md px-3.5 py-2.5"
                    style={{ backgroundColor: '#FEF6E0', border: `1px solid ${C.dayMissingBorder}` }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertTriangle size={13} style={{ color: C.amberInk }} />
                      <div className="min-w-0">
                        <div className="text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                          {d.name}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: C.amberInk, fontFamily: FONTS.sans }}>
                          {d.meta}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSigned((s) => new Set(s).add(d.id))}
                      className="text-[12px] inline-flex items-center gap-1 px-3 h-8 rounded-md"
                      style={{ backgroundColor: C.surface, color: C.amberInk, border: `1px solid ${C.dayMissingBorder}`, fontFamily: FONTS.sans, fontWeight: 600 }}
                    >
                      Sign & submit <ArrowRight size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[14px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                  All documents ({visible.length})
                </div>
              </div>
              <button
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-[12.5px]"
                style={{ backgroundColor: C.brand, color: '#fff', fontFamily: FONTS.sans, fontWeight: 600 }}
              >
                <Upload size={13} /> Upload
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex-1 flex items-center gap-2 h-9 px-3 rounded-md"
                style={{ backgroundColor: C.surfaceMuted, border: `1px solid ${C.border}` }}
              >
                <Search size={14} style={{ color: C.mutedSoft }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents..."
                  className="flex-1 bg-transparent outline-none text-[12.5px]"
                  style={{ color: C.ink, fontFamily: FONTS.sans }}
                />
              </div>
              <div className="flex items-center gap-1 rounded-md p-0.5" style={{ backgroundColor: C.surfaceAlt, border: `1px solid ${C.border}` }}>
                {(['All', 'Tax', 'Onboarding', 'Other'] as DocTab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="text-[12px] px-2.5 py-1 rounded"
                    style={{
                      backgroundColor: tab === t ? C.surface : 'transparent',
                      color: tab === t ? C.ink : C.muted,
                      fontFamily: FONTS.sans,
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <ul className="flex flex-col">
              {visible.map((d) => {
                const style = STATUS_STYLE[d.status];
                return (
                  <li
                    key={d.id}
                    className="flex items-center gap-3 py-2.5"
                    style={{ borderTop: `1px solid ${C.borderSoft}` }}
                  >
                    <div
                      className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: C.brandSoft, color: C.brand }}
                    >
                      <FileText size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
                        {d.name}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: C.muted, fontFamily: FONTS.sans }}>
                        {d.category} · Tax year {d.year}
                      </div>
                    </div>
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}`, fontFamily: FONTS.sans, fontWeight: 500 }}
                    >
                      {d.status}
                    </span>
                    <button className="text-[11px] p-1.5 rounded-md hover:bg-[#FAFBFC]" style={{ color: C.muted }}>
                      <ArrowRight size={13} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <Card padding="md">
          <div className="text-[14px]" style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}>
            HRCenter
          </div>
          <p className="text-[11.5px] mt-1.5 mb-4 leading-relaxed" style={{ color: C.muted, fontFamily: FONTS.sans }}>
            Documents are synced live with your HRCenter profile.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-[12.5px]"
            style={{ backgroundColor: C.surface, color: C.body, border: `1px solid ${C.border}`, fontFamily: FONTS.sans, fontWeight: 600 }}
          >
            Open HRCenter <ExternalLink size={11} />
          </a>
        </Card>
      </div>
    </div>
  );
}
