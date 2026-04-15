import { CheckCircle2, Database, TriangleAlert } from 'lucide-react';
import { SectionContainer } from '../components/SectionContainer';
import type { QualityMetric, QualitySummary } from '../types/sinistro';
import { formatNumber, formatPercent } from '../utils/formatters';

function statusTone(status: QualityMetric['status']) {
  if (status === 'crítico') {
    return 'text-institutional-red bg-red-50 border-red-200';
  }

  if (status === 'atenção') {
    return 'text-institutional-orange bg-orange-50 border-institutional-orange/25';
  }

  return 'text-institutional-green bg-green-50 border-green-200';
}

interface DataQualitySectionProps {
  quality: QualitySummary;
}

export function DataQualitySection({ quality }: DataQualitySectionProps) {
  const StatusIcon = quality.status === 'adequado' ? CheckCircle2 : TriangleAlert;

  return (
    <SectionContainer
      id="qualidade-base"
      eyebrow="Governança da informação"
      title="Qualidade da Base"
      description="Monitoramento de lacunas de preenchimento que afetam a leitura analítica, a prevenção e a tomada de decisão."
    >
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-lg border border-institutional-line bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-institutional-surface p-2">
              <Database className="h-5 w-5 text-institutional-green" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-institutional-steel">Completude estimada</p>
              <strong className="mt-2 block text-4xl font-bold text-institutional-ink">
                {formatPercent(quality.completeness)}
              </strong>
            </div>
          </div>
          <div className={`mt-5 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold ${statusTone(quality.status)}`}>
            <StatusIcon className="h-4 w-4" aria-hidden="true" />
            Status {quality.status}
          </div>
          <p className="mt-4 text-sm leading-6 text-institutional-steel">
            Campos com maior ausência devem orientar capacitação de registro, revisão de formulário e
            rotinas de auditoria da informação.
          </p>
        </article>

        <div className="grid gap-3 md:grid-cols-2">
          {quality.criticalFields.map((metric) => (
            <article key={metric.field} className="rounded-lg border border-institutional-line bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-institutional-ink">{metric.field}</p>
                  <p className="mt-1 text-xs text-institutional-steel">
                    {formatNumber(metric.missing)} de {formatNumber(metric.total)} registro(s)
                  </p>
                </div>
                <span className={`rounded-md border px-2 py-1 text-xs font-bold ${statusTone(metric.status)}`}>
                  {metric.status}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-institutional-surface">
                <div
                  className="h-full rounded-full bg-institutional-orange"
                  style={{ width: `${metric.percent}%` }}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-2 text-sm font-bold text-institutional-graphite">
                {formatPercent(metric.percent)} ausente
              </p>
            </article>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
