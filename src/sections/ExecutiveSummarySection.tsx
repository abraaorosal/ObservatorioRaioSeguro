import { Download, Gauge, Target } from 'lucide-react';
import { SectionContainer } from '../components/SectionContainer';
import type {
  DatasetSummary,
  ExecutiveSummary,
  KpiSummary,
  QualitySummary,
  RiskSummary,
  StrategicInsight,
} from '../types/sinistro';
import { buildExecutiveReportHtml, downloadExecutiveReport } from '../utils/report';

const toneClasses = {
  neutral: 'border-institutional-line bg-white',
  positive: 'border-green-200 bg-green-50/70',
  attention: 'border-institutional-orange/30 bg-orange-50/70',
  critical: 'border-red-200 bg-red-50/70',
};

function riskBarColor(level: RiskSummary['level']) {
  if (level === 'Crítico') {
    return 'bg-institutional-red';
  }

  if (level === 'Elevado') {
    return 'bg-institutional-orange';
  }

  if (level === 'Moderado') {
    return 'bg-institutional-amber';
  }

  return 'bg-institutional-green';
}

interface ExecutiveSummarySectionProps {
  datasetSummary: DatasetSummary;
  kpis: KpiSummary;
  risk: RiskSummary;
  quality: QualitySummary;
  executiveSummary: ExecutiveSummary;
  insights: StrategicInsight[];
}

export function ExecutiveSummarySection({
  datasetSummary,
  kpis,
  risk,
  quality,
  executiveSummary,
  insights,
}: ExecutiveSummarySectionProps) {
  const handleReportDownload = () => {
    const html = buildExecutiveReportHtml({
      summary: datasetSummary,
      kpis,
      risk,
      quality,
      executiveSummary,
      insights,
    });
    downloadExecutiveReport(html);
  };

  return (
    <SectionContainer
      id="resumo-executivo"
      eyebrow="Leitura gerencial"
      title="Resumo Executivo"
      description="Síntese de decisão para comando e gestão, combinando risco operacional, impacto no efetivo, tendência e prioridade preventiva."
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-lg border border-institutional-line bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-institutional-surface px-3 py-2 text-sm font-bold text-institutional-graphite">
                <Gauge className="h-4 w-4 text-institutional-green" aria-hidden="true" />
                Índice de Risco Operacional
              </div>
              <h3 className="text-3xl font-bold text-institutional-ink md:text-4xl">
                {risk.level} <span className="text-lg text-institutional-steel">({risk.score}/100)</span>
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-institutional-steel">
                {risk.description}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReportDownload}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-institutional-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-institutional-graphite"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Gerar relatório executivo
            </button>
          </div>

          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-institutional-surface">
              <div
                className={`h-full rounded-full ${riskBarColor(risk.level)}`}
                style={{ width: `${risk.score}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold text-institutional-steel">
              <span>Baixo</span>
              <span>Moderado</span>
              <span>Elevado</span>
              <span>Crítico</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {risk.drivers.map((driver) => (
              <div key={driver} className="rounded-md border border-institutional-line bg-institutional-surface p-3">
                <p className="text-sm leading-6 text-institutional-graphite">{driver}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-institutional-line bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-institutional-orange" aria-hidden="true" />
            <h3 className="text-lg font-bold text-institutional-ink">Prioridade do recorte</h3>
          </div>
          <p className="text-sm leading-7 text-institutional-graphite">{executiveSummary.topPriority}</p>
          <div className="mt-5 rounded-md border border-institutional-line bg-institutional-surface p-4">
            <p className="text-xs font-bold uppercase text-institutional-steel">Tendência observada</p>
            <p className="mt-2 text-sm leading-6 text-institutional-graphite">{executiveSummary.trend}</p>
          </div>
          <div className="mt-5 rounded-md border border-institutional-line bg-institutional-surface p-4">
            <p className="text-xs font-bold uppercase text-institutional-steel">Governança</p>
            <p className="mt-2 text-sm leading-6 text-institutional-graphite">
              A visualização macro prioriza dados agregados. Identificações pessoais são mascaradas por
              padrão na base analítica e na exportação CSV.
            </p>
          </div>
        </article>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {executiveSummary.items.map((item) => (
          <article key={item.label} className={`rounded-lg border p-4 shadow-sm ${toneClasses[item.tone]}`}>
            <p className="text-xs font-bold uppercase text-institutional-steel">{item.label}</p>
            <strong className="mt-2 block text-xl font-bold text-institutional-ink">{item.value}</strong>
            <p className="mt-2 text-sm leading-6 text-institutional-steel">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
