import { DataTable } from '../components/DataTable';
import { SectionContainer } from '../components/SectionContainer';
import type { NormalizedSinistro } from '../types/sinistro';

interface AnalyticalBaseSectionProps {
  records: NormalizedSinistro[];
}

export function AnalyticalBaseSection({ records }: AnalyticalBaseSectionProps) {
  return (
    <SectionContainer
      id="base-analitica"
      eyebrow="Consulta controlada"
      title="Base Analítica"
      description="Tabela profissional para auditoria, consulta e exportação do recorte filtrado. A identificação pessoal fica disponível para análise autorizada, sem protagonismo na visão macro."
    >
      <DataTable records={records} />
    </SectionContainer>
  );
}
