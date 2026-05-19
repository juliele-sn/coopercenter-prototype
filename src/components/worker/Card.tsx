import { C } from '@/lib/design';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const PAD: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <section
      className={`rounded-lg ${PAD[padding]} ${className}`}
      style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
    >
      {children}
    </section>
  );
}
