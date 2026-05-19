'use client';

import { C, FONTS } from '@/lib/design';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md';
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  children,
  className = '',
  style,
  ...rest
}: ButtonProps) {
  const h = size === 'sm' ? 30 : 36;
  const fs = size === 'sm' ? 12 : 13;
  const padX = size === 'sm' ? 'px-2.5' : 'px-3.5';

  const base: React.CSSProperties = {
    fontFamily: FONTS.sans,
    fontSize: fs,
    fontWeight: 600,
    height: h,
    borderRadius: 6,
  };

  let palette: React.CSSProperties;
  if (variant === 'primary') {
    palette = { backgroundColor: C.brand, color: '#fff' };
  } else if (variant === 'secondary') {
    palette = { backgroundColor: C.surface, color: C.body, border: `1px solid ${C.border}` };
  } else {
    palette = { backgroundColor: 'transparent', color: C.body };
  }

  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 ${padX} ${className}`}
      style={{ ...base, ...palette, ...style }}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
