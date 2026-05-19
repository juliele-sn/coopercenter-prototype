// Design tokens for the CooperTime worker prototype.
// Aligned with the CooperCenter Figma file (R2 page) — clean white/blue
// surface palette with warm cream accents for "missing" / attention states.

export const C = {
  // Surfaces
  bg: '#F4F6F8',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFB',
  surfaceAlt: '#F1F4F7',

  // Cream accents (kept for missing-time / draft alerts and legacy mobile screen)
  bone: '#EFEBE2',
  cream: '#F8F5EE',
  paper: '#FBF9F4',

  // Ink / text
  ink: '#0E1626',
  inkSoft: '#1F2A3D',
  body: '#2E3A4E',
  muted: '#6B7280',
  mutedSoft: '#9CA3AF',

  // Borders
  border: '#E5E9EE',
  borderSoft: '#EEF1F4',
  borderStrong: '#D5DBE2',

  // Brand
  brand: '#1F69E0',
  brandDeep: '#1654B8',
  brandSoft: '#E8F0FE',

  // Day chart palette
  dayLogged: '#3B83E0',
  dayLoggedSoft: '#79ADEC',
  dayMissing: '#FBE6A8',
  dayMissingBorder: '#F2D27A',
  dayFuture: '#E9EDF1',

  // Status palette
  greenInk: '#1F6B45',
  greenBg: '#DCF3E5',
  greenBorder: '#A8DDBE',
  blueInk: '#1F4FB8',
  blueBg: '#E1ECFF',
  blueBorder: '#B6CCF4',
  amberInk: '#8A5A11',
  amberBg: '#FBE6A8',
  amberBorder: '#F2D27A',
  redInk: '#B91C1C',
  redBg: '#FCE7E7',
  redBorder: '#F2BCBC',
  greyInk: '#4B5563',
  greyBg: '#EEF1F4',
  greyBorder: '#D5DBE2',

  // Accents (kept for variety in expenses/legacy)
  lime: '#D4FF3F',
  limeDeep: '#B8E62E',
  clay: '#C75D3F',
  moss: '#6B7F3A',
  amber: '#E8A33D',
  ocean: '#3B6E7F',
  rose: '#D4847A',

  // Overtime accent
  otInk: '#E2602A',
} as const;

export type EntryStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'submitted' | 'paid';

// Timecard-level status — the user's flow: current (no chip) → submitted → approved → paid
// plus a draft state for future periods.
export type TimecardStatus = 'draft' | 'current' | 'submitted' | 'approved' | 'paid';

export const STATUS_META: Record<EntryStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Draft',     color: C.greyInk,  bg: C.greyBg },
  pending:   { label: 'Pending',   color: C.amberInk, bg: C.amberBg },
  approved:  { label: 'Approved',  color: C.greenInk, bg: C.greenBg },
  rejected:  { label: 'Rejected',  color: C.redInk,   bg: C.redBg },
  submitted: { label: 'Submitted', color: C.blueInk,  bg: C.blueBg },
  paid:      { label: 'Paid',      color: C.greenInk, bg: C.greenBg },
};

export const TIMECARD_STATUS_META: Record<TimecardStatus, { label: string; color: string; bg: string; border: string } | null> = {
  draft:     { label: 'Draft',     color: C.greyInk,  bg: C.greyBg,   border: C.greyBorder },
  current:   null, // current week has no chip
  submitted: { label: 'Submitted', color: C.blueInk,  bg: C.blueBg,   border: C.blueBorder },
  approved:  { label: 'Approved',  color: C.greenInk, bg: C.greenBg,  border: C.greenBorder },
  paid:      { label: 'Paid',      color: C.greenInk, bg: C.greenBg,  border: C.greenBorder },
};

export const FONTS = {
  sans: 'Geist, system-ui, sans-serif',
  serif: 'Instrument Serif, serif',
  mono: 'JetBrains Mono, ui-monospace, monospace',
} as const;
