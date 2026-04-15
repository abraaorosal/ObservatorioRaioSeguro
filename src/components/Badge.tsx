import type { ReactNode } from 'react';

const variants = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-green-200 bg-green-50 text-institutional-green',
  warning: 'border-institutional-orange/25 bg-orange-50 text-institutional-orange',
  danger: 'border-red-200 bg-red-50 text-institutional-red',
  info: 'border-institutional-teal/35 bg-cyan-50 text-institutional-navy',
};

export type BadgeVariant = keyof typeof variants;

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
