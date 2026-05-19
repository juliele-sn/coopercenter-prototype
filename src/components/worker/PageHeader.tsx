import { C, FONTS } from '@/lib/design';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <h1
        className="text-[26px] leading-tight tracking-tight"
        style={{ color: C.ink, fontFamily: FONTS.sans, fontWeight: 600 }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-[13px] mt-1" style={{ color: C.muted, fontFamily: FONTS.sans }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
