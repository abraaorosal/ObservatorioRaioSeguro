export type NullableField = string | number | boolean | null | undefined;

export interface RawSinistro {
  id_sinistro?: NullableField;
  policial_vitima?: NullableField;
  data_servico?: NullableField;
  hora_acidente?: NullableField;
  turno?: NullableField;
  placa_veiculo_pm?: NullableField;
  condicao_veiculo_pneu?: NullableField;
  condicao_veiculo_freio?: NullableField;
  situacao_sinistro?: NullableField;
  tipo_deslocamento?: NullableField;
  e_sinalizado?: NullableField;
  e_iluminado?: NullableField;
  condicoes_via?: NullableField;
  local_circunstancias?: NullableField;
  condicao_climaticas?: NullableField;
  poderia_ser_evitado?: NullableField;
  avanco_preferencial?: NullableField;
  percepcao_velocidade_pm?: NullableField;
  percepcao_velocidade_outros?: NullableField;
  dano_material?: NullableField;
  lesao?: NullableField;
  fatalidade?: NullableField;
  lts?: NullableField;
  dias_lts?: NullableField;
  data_registro?: NullableField;
  resp_registro?: NullableField;
}

export interface SinistroWorkbook {
  workbook?: unknown;
  sheets?: {
    sinistro_transito?: RawSinistro[];
  };
}

export type BooleanStatus = boolean | null;

export interface NormalizedSinistro {
  id_sinistro: string;
  policial_vitima: string;
  data_servico: string;
  hora_acidente: string;
  turno: string;
  placa_veiculo_pm: string;
  condicao_veiculo_pneu: string;
  condicao_veiculo_freio: string;
  situacao_sinistro: string;
  tipo_deslocamento: string;
  e_sinalizado: string;
  e_iluminado: string;
  condicoes_via: string;
  local_circunstancias: string;
  condicao_climaticas: string;
  poderia_ser_evitado: string;
  avanco_preferencial: string;
  percepcao_velocidade_pm: string;
  percepcao_velocidade_outros: string;
  dano_material: string;
  lesao: string;
  fatalidade: string;
  lts: string;
  dias_lts_original: string;
  dias_lts: number;
  data_registro: string;
  resp_registro: string;
  parsedDate: Date | null;
  timestamp: number | null;
  ano: number | null;
  mes: number | null;
  mesNome: string;
  mesAno: string;
  mesAnoKey: string;
  trimestre: string;
  diaSemana: string;
  fatalidadeStatus: BooleanStatus;
  ltsStatus: BooleanStatus;
  sinalizadoStatus: BooleanStatus;
  iluminadoStatus: BooleanStatus;
  poderiaSerEvitadoStatus: BooleanStatus;
  hasLesao: BooleanStatus;
  hasDanoMaterial: BooleanStatus;
  criticidade: 'fatalidade' | 'lts-alto' | 'lesao' | 'regular';
}

export interface FilterState {
  ano: string;
  mes: string;
  turno: string;
  situacao: string;
  tipoDeslocamento: string;
  lesao: string;
  fatalidade: string;
  lts: string;
  localCircunstancia: string;
  condicaoVia: string;
  condicaoClimatica: string;
  poderiaSerEvitado: string;
  sinalizado: string;
  iluminado: string;
}

export interface ChartDatum {
  name: string;
  value: number;
  percent?: number;
  [key: string]: string | number | undefined;
}

export interface TimeSeriesDatum {
  name: string;
  value: number;
  key: string;
}

export interface KpiSummary {
  total: number;
  totalLesao: number;
  totalLts: number;
  totalFatalidades: number;
  somaDiasLts: number;
  mediaDiasLts: number;
  percentualDanoMaterial: number;
  percentualEvitaveis: number;
  percentualNaoIluminado: number;
  percentualNaoSinalizado: number;
}

export type RiskLevel = 'Baixo' | 'Moderado' | 'Elevado' | 'Crítico';

export interface RiskSummary {
  score: number;
  level: RiskLevel;
  description: string;
  drivers: string[];
}

export interface QualityMetric {
  field: string;
  missing: number;
  total: number;
  percent: number;
  status: 'adequado' | 'atenção' | 'crítico';
}

export interface QualitySummary {
  completeness: number;
  status: 'adequado' | 'atenção' | 'crítico';
  metrics: QualityMetric[];
  criticalFields: QualityMetric[];
}

export interface ExecutiveSummaryItem {
  label: string;
  value: string;
  description: string;
  tone: 'neutral' | 'positive' | 'attention' | 'critical';
}

export interface ExecutiveSummary {
  items: ExecutiveSummaryItem[];
  trend: string;
  topPriority: string;
}

export interface StrategicInsight {
  category: 'Achado' | 'Risco' | 'Recomendação';
  title: string;
  description: string;
  priority: 'Rotina' | 'Atenção' | 'Prioritário';
}

export interface DatasetSummary {
  totalRaw: number;
  totalFiltered: number;
  startDate: Date | null;
  endDate: Date | null;
}

export type SortDirection = 'asc' | 'desc';

export type SortKey =
  | 'id_sinistro'
  | 'data_servico'
  | 'hora_acidente'
  | 'turno'
  | 'situacao_sinistro'
  | 'tipo_deslocamento'
  | 'local_circunstancias'
  | 'condicoes_via'
  | 'condicao_climaticas'
  | 'lesao'
  | 'fatalidade'
  | 'lts'
  | 'dias_lts'
  | 'policial_vitima'
  | 'resp_registro';
