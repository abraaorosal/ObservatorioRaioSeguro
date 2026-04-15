import { ChartCard } from '../components/ChartCard';
import { DonutChart, HorizontalBar, MatrixBar } from '../components/AnalyticalChart';
import { SectionContainer } from '../components/SectionContainer';
import { CHART_COLORS } from '../constants/charts';
import type { ChartDatum } from '../types/sinistro';

interface RiskFactorsSectionProps {
  charts: {
    porLocal: ChartDatum[];
    porCondicaoVia: ChartDatum[];
    porCondicaoClimatica: ChartDatum[];
    evitabilidade: ChartDatum[];
    iluminacaoSinalizacao: ChartDatum[];
    fatoresFrequentes: ChartDatum[];
  };
}

export function RiskFactorsSection({ charts }: RiskFactorsSectionProps) {
  return (
    <SectionContainer
      id="fatores-risco"
      eyebrow="Prevenção e inteligência operacional"
      title="Fatores de Risco"
      description="Análise de recorrências por local, via, clima, visibilidade, sinalização e fatores associados aos sinistros."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Local/circunstância" description="Ranking dos contextos de maior incidência.">
          <HorizontalBar data={charts.porLocal} color={CHART_COLORS.primary} />
        </ChartCard>
        <ChartCard title="Condição da via" description="Indícios de vulnerabilidade estrutural ou ambiental da via.">
          <HorizontalBar data={charts.porCondicaoVia} color={CHART_COLORS.secondary} />
        </ChartCard>
        <ChartCard title="Condição climática" description="Distribuição por condições climáticas informadas.">
          <HorizontalBar data={charts.porCondicaoClimatica} color={CHART_COLORS.teal} />
        </ChartCard>
        <ChartCard title="Potencialmente evitáveis vs não evitáveis" description="Leitura de preventibilidade declarada nos registros.">
          <DonutChart data={charts.evitabilidade} />
        </ChartCard>
        <ChartCard title="Iluminação e sinalização" description="Relação entre visibilidade, sinalização e ocorrência.">
          <MatrixBar data={charts.iluminacaoSinalizacao} />
        </ChartCard>
        <ChartCard title="Fatores mais frequentes associados" description="Ranking consolidado de fatores recorrentes nos sinistros.">
          <HorizontalBar data={charts.fatoresFrequentes} color={CHART_COLORS.red} />
        </ChartCard>
      </div>
    </SectionContainer>
  );
}
