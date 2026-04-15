import { ChartCard } from '../components/ChartCard';
import { DonutChart, MatrixBar, VerticalBar } from '../components/AnalyticalChart';
import { SectionContainer } from '../components/SectionContainer';
import type { ChartDatum } from '../types/sinistro';

interface OperationalImpactSectionProps {
  charts: {
    lesao: ChartDatum[];
    lts: ChartDatum[];
    fatalidade: ChartDatum[];
    diasLts: ChartDatum[];
  };
}

export function OperationalImpactSection({ charts }: OperationalImpactSectionProps) {
  return (
    <SectionContainer
      id="impacto-operacional"
      eyebrow="Proteção do efetivo"
      title="Impacto Operacional"
      description="Indicadores de lesão, fatalidade, afastamento e duração de LTS para suporte a decisões de prevenção e preservação da capacidade operacional."
    >
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Com e sem lesão" description="Comparativo de registros com lesão descrita.">
          <DonutChart data={charts.lesao} />
        </ChartCard>
        <ChartCard title="Com e sem LTS" description="Comparativo de afastamento do efetivo.">
          <DonutChart data={charts.lts} />
        </ChartCard>
        <ChartCard title="Fatalidade e não fatalidade" description="Distribuição dos casos quanto à fatalidade.">
          <DonutChart data={charts.fatalidade} />
        </ChartCard>
        <ChartCard title="Distribuição de dias de LTS" description="Faixas de duração de afastamento informado.">
          <VerticalBar data={charts.diasLts} />
        </ChartCard>
      </div>
      <div className="mt-5">
        <ChartCard title="Afastamento por faixas" description="Leitura operacional de duração do afastamento." className="max-w-none">
          <MatrixBar data={charts.diasLts} />
        </ChartCard>
      </div>
    </SectionContainer>
  );
}
