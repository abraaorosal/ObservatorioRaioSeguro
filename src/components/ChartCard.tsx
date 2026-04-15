import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className = '' }: ChartCardProps) {
  return (
    <article
      className={`rounded-lg border border-institutional-line bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-base font-bold text-institutional-ink">{title}</h3>
        {description ? <p className="mt-1 text-sm leading-6 text-institutional-steel">{description}</p> : null}
      </div>
      <div className="h-72 min-h-72 sm:h-80 sm:min-h-80">{children}</div>
    </article>
  );
}
