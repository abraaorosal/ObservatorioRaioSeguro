import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

const toneStyles = {
  neutral: 'border-institutional-line bg-white text-institutional-navy',
  positive: 'border-institutional-line bg-white text-institutional-green',
  warning: 'border-institutional-line bg-white text-institutional-orange',
  critical: 'border-institutional-line bg-white text-institutional-red',
};

type Tone = keyof typeof toneStyles;

interface KPICardProps {
  title: string;
  value: string;
  helper: string;
  icon: ReactNode;
  tone?: Tone;
  trend?: 'up' | 'down' | 'stable';
}

export function KPICard({ title, value, helper, icon, tone = 'neutral', trend = 'stable' }: KPICardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  return (
    <article className={`rounded-lg border border-t-4 border-t-current p-5 shadow-sm ${toneStyles[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-md border border-current/20 bg-institutional-surface p-2" aria-hidden="true">
          {icon}
        </div>
        <TrendIcon className="h-4 w-4 opacity-70" aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm font-semibold text-institutional-steel">{title}</p>
      <strong className="mt-2 block text-3xl font-bold text-institutional-ink">{value}</strong>
      <p className="mt-2 text-xs leading-5 text-institutional-steel">{helper}</p>
    </article>
  );
}
