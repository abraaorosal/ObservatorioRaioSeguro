import { ChartCard } from '../components/ChartCard';
import { HorizontalBar, TemporalLine, VerticalBar } from '../components/AnalyticalChart';
import { SectionContainer } from '../components/SectionContainer';
import { CHART_COLORS } from '../constants/charts';
import type { ChartDatum, TimeSeriesDatum } from '../types/sinistro';

interface TemporalAnalysisSectionProps {
  charts: {
    temporal: TimeSeriesDatum[];
    diasSemana: ChartDatum[];
    trimestres: ChartDatum[];
  };
}

export function TemporalAnalysisSection({ charts }: TemporalAnalysisSectionProps) {
  return (
    <SectionContainer
      id="analise-temporal"
      eyebrow="Concentração temporal"
      title="Análise Temporal"
      description="Leitura da evolução mensal, distribuição por dia da semana e agrupamento trimestral para orientar ações preventivas e revisão de rotinas."
    >
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <ChartCard title="Série temporal de sinistros por mês/ano" description="Evolução dos registros ao longo do período coberto." className="xl:col-span-1">
          <TemporalLine data={charts.temporal} />
        </ChartCard>
        <ChartCard title="Sinistros por trimestre" description="Consolidação trimestral para leitura de ciclos operacionais.">
          <HorizontalBar data={charts.trimestres} color={CHART_COLORS.secondary} />
        </ChartCard>
      </div>
      <div className="mt-5">
        <ChartCard title="Sinistros por dia da semana" description="Apoio à identificação de recorrência temporal no serviço." className="lg:max-w-none">
          <VerticalBar data={charts.diasSemana} color={CHART_COLORS.graphite} />
        </ChartCard>
      </div>
    </SectionContainer>
  );
}
