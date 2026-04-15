import { AlertTriangle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'Nenhum registro localizado',
  description = 'Os filtros atuais não retornaram resultados. Ajuste os critérios para recompor a análise.',
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-institutional-line bg-white p-8 text-center">
      <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-institutional-amber" aria-hidden="true" />
      <h3 className="text-lg font-bold text-institutional-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-institutional-steel">{description}</p>
    </div>
  );
}
