import { FileText, ShieldAlert } from 'lucide-react';
import type { StrategicInsight } from '../types/sinistro';

interface InsightPanelProps {
  insights: StrategicInsight[];
}

const categoryTone = {
  Achado: 'border-institutional-line bg-institutional-surface text-institutional-graphite',
  Risco: 'border-red-200 bg-red-50 text-institutional-red',
  Recomendação: 'border-institutional-orange/25 bg-orange-50 text-institutional-orange',
};

export function InsightPanel({ insights }: InsightPanelProps) {
  return (
    <aside className="rounded-lg border border-institutional-line bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-md bg-institutional-ink p-2 text-institutional-gold">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-institutional-ink">Leituras Estratégicas</h3>
          <p className="mt-1 text-sm leading-6 text-institutional-steel">
            Síntese automática para apoio ao comando, planejamento preventivo e gestão operacional.
          </p>
        </div>
      </div>
      <ul className="grid gap-3 lg:grid-cols-2">
        {insights.map((insight) => (
          <li
            key={`${insight.category}-${insight.title}`}
            className="flex gap-3 rounded-md border border-slate-100 bg-institutional-surface p-3"
          >
            <ShieldAlert className="mt-1 h-4 w-4 flex-none text-institutional-gold" aria-hidden="true" />
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className={`rounded-md border px-2 py-1 text-xs font-bold ${categoryTone[insight.category]}`}>
                  {insight.category}
                </span>
                <span className="rounded-md border border-institutional-line bg-white px-2 py-1 text-xs font-bold text-institutional-steel">
                  {insight.priority}
                </span>
              </div>
              <strong className="block text-sm font-bold text-institutional-ink">{insight.title}</strong>
              <p className="mt-1 text-sm leading-6 text-institutional-graphite">{insight.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
