import { AlertOctagon } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { InstitutionalHeader } from '../components/InstitutionalHeader';
import { LoadingState } from '../components/LoadingState';
import { SectionNav } from '../components/SectionNav';
import { useSinistroDashboard } from '../hooks/useSinistroDashboard';
import { AnalyticalBaseSection } from '../sections/AnalyticalBaseSection';
import { DataQualitySection } from '../sections/DataQualitySection';
import { ExecutiveSummarySection } from '../sections/ExecutiveSummarySection';
import { InsightPanel } from '../sections/InsightPanel';
import { OperationalImpactSection } from '../sections/OperationalImpactSection';
import { OverviewSection } from '../sections/OverviewSection';
import { RiskFactorsSection } from '../sections/RiskFactorsSection';
import { TemporalAnalysisSection } from '../sections/TemporalAnalysisSection';

export function DashboardPage() {
  const {
    filteredRecords,
    filters,
    options,
    loading,
    error,
    kpis,
    risk,
    quality,
    executiveSummary,
    summary,
    charts,
    insights,
    updateFilter,
    clearFilters,
  } = useSinistroDashboard();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-institutional-surface px-4">
        <div className="w-full max-w-2xl rounded-lg border border-red-200 bg-white p-8 shadow-official">
          <AlertOctagon className="mb-4 h-9 w-9 text-institutional-red" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-institutional-ink">Falha na leitura dos dados</h1>
          <p className="mt-3 text-sm leading-6 text-institutional-steel">{error}</p>
          <p className="mt-3 text-sm leading-6 text-institutional-steel">
            Confirme se o arquivo sinistro_transito.json está na raiz do projeto e mantém a estrutura
            workbook/sheets/sinistro_transito.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-institutional-surface">
      <InstitutionalHeader
        totalRecords={summary.totalRaw}
        filteredRecords={summary.totalFiltered}
        startDate={summary.startDate}
        endDate={summary.endDate}
      />
      <SectionNav />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:py-8 md:px-6">
        <FilterBar filters={filters} options={options} onChange={updateFilter} onClear={clearFilters} />

        {filteredRecords.length ? (
          <>
            <ExecutiveSummarySection
              datasetSummary={summary}
              kpis={kpis}
              risk={risk}
              quality={quality}
              executiveSummary={executiveSummary}
              insights={insights}
            />
            <OverviewSection kpis={kpis} charts={charts} />
            <InsightPanel insights={insights} />
            <DataQualitySection quality={quality} />
            <TemporalAnalysisSection charts={charts} />
            <RiskFactorsSection charts={charts} />
            <OperationalImpactSection charts={charts} />
            <AnalyticalBaseSection records={filteredRecords} />
          </>
        ) : (
          <EmptyState />
        )}
      </main>
      <footer className="border-t border-institutional-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 text-sm leading-6 text-institutional-steel md:px-6">
          Programa RAIO SEGURO - CPRaio. Painel institucional para prevenção, inteligência
          operacional e suporte à decisão.
        </div>
      </footer>
    </div>
  );
}
