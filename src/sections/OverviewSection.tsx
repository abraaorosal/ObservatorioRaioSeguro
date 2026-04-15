import {
  AlertTriangle,
  Ambulance,
  Bike,
  CalendarOff,
  Clock,
  Crosshair,
  FileWarning,
  HeartPulse,
  MapPinned,
  Route,
} from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { DonutChart, HorizontalBar, VerticalBar } from '../components/AnalyticalChart';
import { KPICard } from '../components/KPICard';
import { SectionContainer } from '../components/SectionContainer';
import type { ChartDatum, KpiSummary } from '../types/sinistro';
import { formatDecimal, formatNumber, formatPercent } from '../utils/formatters';
import { CHART_COLORS } from '../constants/charts';

interface OverviewSectionProps {
  kpis: KpiSummary;
  charts: {
    porTurno: ChartDatum[];
    porSituacao: ChartDatum[];
    porTipoDeslocamento: ChartDatum[];
  };
}

export function OverviewSection({ kpis, charts }: OverviewSectionProps) {
  return (
    <SectionContainer
      id="visao-geral"
      eyebrow="Síntese executiva"
      title="Visão Geral"
      description="Indicadores consolidados para leitura imediata do volume de sinistros, gravidade, afastamentos e fatores de prevenção."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KPICard
          title="Total de sinistros"
          value={formatNumber(kpis.total)}
          helper="Registros no recorte selecionado."
          icon={<Crosshair className="h-5 w-5" />}
        />
        <KPICard
          title="Com lesão"
          value={formatNumber(kpis.totalLesao)}
          helper="Ocorrências com lesão descrita."
          icon={<HeartPulse className="h-5 w-5" />}
          tone="warning"
          trend="up"
        />
        <KPICard
          title="Com LTS"
          value={formatNumber(kpis.totalLts)}
          helper="Registros com afastamento."
          icon={<CalendarOff className="h-5 w-5" />}
          tone="warning"
        />
        <KPICard
          title="Fatalidades"
          value={formatNumber(kpis.totalFatalidades)}
          helper="Casos com fatalidade registrada."
          icon={<AlertTriangle className="h-5 w-5" />}
          tone={kpis.totalFatalidades > 0 ? 'critical' : 'positive'}
        />
        <KPICard
          title="Dias de LTS"
          value={formatNumber(kpis.somaDiasLts)}
          helper={`Média de ${formatDecimal(kpis.mediaDiasLts)} dia(s).`}
          icon={<Ambulance className="h-5 w-5" />}
          tone="warning"
        />
        <KPICard
          title="Média de dias LTS"
          value={formatDecimal(kpis.mediaDiasLts)}
          helper="Média nos casos com dias informados."
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="Dano material"
          value={formatPercent(kpis.percentualDanoMaterial)}
          helper="Percentual com dano material descrito."
          icon={<FileWarning className="h-5 w-5" />}
          tone="warning"
        />
        <KPICard
          title="Potencialmente evitáveis"
          value={formatPercent(kpis.percentualEvitaveis)}
          helper="Proporção com evitabilidade indicada."
          icon={<Route className="h-5 w-5" />}
          tone="warning"
        />
        <KPICard
          title="Não iluminado"
          value={formatPercent(kpis.percentualNaoIluminado)}
          helper="Ocorrências em ambiente sem iluminação."
          icon={<MapPinned className="h-5 w-5" />}
          tone="critical"
        />
        <KPICard
          title="Não sinalizado"
          value={formatPercent(kpis.percentualNaoSinalizado)}
          helper="Ocorrências em ambiente sem sinalização."
          icon={<Bike className="h-5 w-5" />}
          tone="critical"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <ChartCard title="Sinistros por turno" description="Concentração operacional por turno informado.">
          <VerticalBar data={charts.porTurno} color={CHART_COLORS.primary} />
        </ChartCard>
        <ChartCard title="Situação do sinistro" description="Distribuição dos registros por situação institucional.">
          <DonutChart data={charts.porSituacao} />
        </ChartCard>
        <ChartCard title="Tipo de deslocamento" description="Perfil de deslocamento associado ao evento.">
          <HorizontalBar data={charts.porTipoDeslocamento} color={CHART_COLORS.teal} />
        </ChartCard>
      </div>
    </SectionContainer>
  );
}
