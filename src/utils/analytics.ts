import { NOT_INFORMED } from '../constants/filters';
import type {
  ChartDatum,
  DatasetSummary,
  ExecutiveSummary,
  FilterState,
  KpiSummary,
  NormalizedSinistro,
  QualityMetric,
  QualitySummary,
  RiskLevel,
  RiskSummary,
  StrategicInsight,
  TimeSeriesDatum,
} from '../types/sinistro';
import { formatDecimal, formatPercent } from './formatters';
import { booleanLabel } from './normalization';

export function percent(part: number, total: number): number {
  if (!total) {
    return 0;
  }

  return (part / total) * 100;
}

export function average(sum: number, total: number): number {
  if (!total) {
    return 0;
  }

  return sum / total;
}

export function countWhere(
  records: NormalizedSinistro[],
  predicate: (record: NormalizedSinistro) => boolean,
): number {
  return records.reduce((total, record) => total + (predicate(record) ? 1 : 0), 0);
}

export function sumBy(
  records: NormalizedSinistro[],
  selector: (record: NormalizedSinistro) => number,
): number {
  return records.reduce((total, record) => total + selector(record), 0);
}

export function calculateKpis(records: NormalizedSinistro[]): KpiSummary {
  const total = records.length;
  const totalLesao = countWhere(records, (record) => record.hasLesao === true);
  const totalLts = countWhere(records, (record) => record.ltsStatus === true);
  const totalFatalidades = countWhere(records, (record) => record.fatalidadeStatus === true);
  const somaDiasLts = sumBy(records, (record) => record.dias_lts);
  const registrosComDiasLts = countWhere(records, (record) => record.dias_lts > 0);
  const totalDanoMaterial = countWhere(records, (record) => record.hasDanoMaterial === true);
  const totalEvitaveis = countWhere(records, (record) => record.poderiaSerEvitadoStatus === true);
  const totalNaoIluminado = countWhere(records, (record) => record.iluminadoStatus === false);
  const totalNaoSinalizado = countWhere(records, (record) => record.sinalizadoStatus === false);

  return {
    total,
    totalLesao,
    totalLts,
    totalFatalidades,
    somaDiasLts,
    mediaDiasLts: average(somaDiasLts, registrosComDiasLts),
    percentualDanoMaterial: percent(totalDanoMaterial, total),
    percentualEvitaveis: percent(totalEvitaveis, total),
    percentualNaoIluminado: percent(totalNaoIluminado, total),
    percentualNaoSinalizado: percent(totalNaoSinalizado, total),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 75) {
    return 'Crítico';
  }

  if (score >= 50) {
    return 'Elevado';
  }

  if (score >= 25) {
    return 'Moderado';
  }

  return 'Baixo';
}

export function calculateRiskSummary(records: NormalizedSinistro[]): RiskSummary {
  if (!records.length) {
    return {
      score: 0,
      level: 'Baixo',
      description: 'Sem registros no recorte atual para cálculo de risco operacional.',
      drivers: ['Sem base filtrada para avaliação.'],
    };
  }

  const kpis = calculateKpis(records);
  const fatalityRate = percent(kpis.totalFatalidades, kpis.total);
  const lesionRate = percent(kpis.totalLesao, kpis.total);
  const ltsRate = percent(kpis.totalLts, kpis.total);
  const highLtsRate = percent(countWhere(records, (record) => record.dias_lts >= 30), kpis.total);
  const visibilityRate = kpis.percentualNaoIluminado + kpis.percentualNaoSinalizado;
  const averageLtsPressure = clamp((kpis.mediaDiasLts / 30) * 10, 0, 10);

  const rawScore =
    clamp(fatalityRate * 1.8, 0, 25) +
    (kpis.totalFatalidades > 0 ? 10 : 0) +
    clamp(lesionRate * 0.22, 0, 18) +
    clamp(ltsRate * 0.22, 0, 18) +
    clamp(kpis.percentualEvitaveis * 0.18, 0, 12) +
    clamp(visibilityRate * 0.16, 0, 12) +
    averageLtsPressure +
    clamp(highLtsRate * 0.5, 0, 5);

  const score = Math.round(clamp(rawScore, 0, 100));
  const level = riskLevelFromScore(score);
  const topTurno = countBy(records, (record) => record.turno)[0];
  const topLocal = countBy(records, (record) => record.local_circunstancias)[0];
  const drivers = [
    `${formatPercent(lesionRate)} dos registros com lesão descrita.`,
    `${formatPercent(ltsRate)} dos registros com LTS.`,
    `${formatPercent(kpis.percentualEvitaveis)} classificados como potencialmente evitáveis.`,
    topTurno ? `Turno ${topTurno.name} concentra ${topTurno.value} registro(s).` : '',
    topLocal ? `${topLocal.name} é o local/circunstância mais recorrente.` : '',
  ].filter(Boolean);

  const description =
    level === 'Crítico'
      ? 'Recorte exige ação gerencial imediata, com prioridade para preservação do efetivo e mitigação de fatores recorrentes.'
      : level === 'Elevado'
        ? 'Recorte demanda acompanhamento operacional próximo e plano preventivo direcionado.'
        : level === 'Moderado'
          ? 'Recorte apresenta risco controlável, mas com sinais relevantes para prevenção e qualificação do registro.'
          : 'Recorte com baixa pressão relativa de risco, mantendo monitoramento preventivo de rotina.';

  return { score, level, description, drivers };
}

export function countBy(
  records: NormalizedSinistro[],
  selector: (record: NormalizedSinistro) => string,
  limit?: number,
): ChartDatum[] {
  const map = new Map<string, number>();

  records.forEach((record) => {
    const key = selector(record) || NOT_INFORMED;
    map.set(key, (map.get(key) ?? 0) + 1);
  });

  const data = [...map.entries()]
    .map(([name, value]) => ({
      name,
      value,
      percent: percent(value, records.length),
    }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, 'pt-BR'));

  return limit ? data.slice(0, limit) : data;
}

export function timeSeriesByMonth(records: NormalizedSinistro[]): TimeSeriesDatum[] {
  const map = new Map<string, { name: string; value: number; key: string }>();

  records.forEach((record) => {
    if (!record.ano || !record.mes || record.mesAnoKey === NOT_INFORMED) {
      return;
    }

    const current = map.get(record.mesAnoKey);
    map.set(record.mesAnoKey, {
      name: current?.name ?? record.mesAno,
      key: record.mesAnoKey,
      value: (current?.value ?? 0) + 1,
    });
  });

  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

export function compareBoolean(
  records: NormalizedSinistro[],
  selector: (record: NormalizedSinistro) => boolean | null,
  positiveLabel: string,
  negativeLabel: string,
): ChartDatum[] {
  const positive = countWhere(records, (record) => selector(record) === true);
  const negative = countWhere(records, (record) => selector(record) === false);
  const unknown = records.length - positive - negative;

  return [
    { name: positiveLabel, value: positive, percent: percent(positive, records.length) },
    { name: negativeLabel, value: negative, percent: percent(negative, records.length) },
    ...(unknown > 0
      ? [{ name: NOT_INFORMED, value: unknown, percent: percent(unknown, records.length) }]
      : []),
  ];
}

export function ltsDaysDistribution(records: NormalizedSinistro[]): ChartDatum[] {
  const buckets = [
    { name: 'Sem afastamento informado', min: 0, max: 0 },
    { name: '1 a 3 dias', min: 1, max: 3 },
    { name: '4 a 7 dias', min: 4, max: 7 },
    { name: '8 a 15 dias', min: 8, max: 15 },
    { name: '16 a 30 dias', min: 16, max: 30 },
    { name: 'Acima de 30 dias', min: 31, max: Number.POSITIVE_INFINITY },
  ];

  return buckets.map((bucket) => {
    const value = countWhere(
      records,
      (record) => record.dias_lts >= bucket.min && record.dias_lts <= bucket.max,
    );

    return {
      name: bucket.name,
      value,
      percent: percent(value, records.length),
    };
  });
}

export function lightingSignalingMatrix(records: NormalizedSinistro[]): ChartDatum[] {
  return [
    {
      name: 'Iluminado e sinalizado',
      value: countWhere(
        records,
        (record) => record.iluminadoStatus === true && record.sinalizadoStatus === true,
      ),
    },
    {
      name: 'Sem iluminação',
      value: countWhere(
        records,
        (record) => record.iluminadoStatus === false && record.sinalizadoStatus !== false,
      ),
    },
    {
      name: 'Sem sinalização',
      value: countWhere(
        records,
        (record) => record.sinalizadoStatus === false && record.iluminadoStatus !== false,
      ),
    },
    {
      name: 'Sem ambos',
      value: countWhere(
        records,
        (record) => record.iluminadoStatus === false && record.sinalizadoStatus === false,
      ),
    },
    {
      name: NOT_INFORMED,
      value: countWhere(
        records,
        (record) => record.iluminadoStatus === null || record.sinalizadoStatus === null,
      ),
    },
  ].map((item) => ({
    ...item,
    percent: percent(item.value, records.length),
  }));
}

export function topAssociatedFactors(records: NormalizedSinistro[], limit = 12): ChartDatum[] {
  const map = new Map<string, number>();
  const add = (factor: string) => {
    if (factor !== NOT_INFORMED) {
      map.set(factor, (map.get(factor) ?? 0) + 1);
    }
  };

  records.forEach((record) => {
    add(`Local: ${record.local_circunstancias}`);
    add(`Via: ${record.condicoes_via}`);
    add(`Clima: ${record.condicao_climaticas}`);
    add(`Deslocamento: ${record.tipo_deslocamento}`);

    if (record.iluminadoStatus === false) {
      add('Ambiente não iluminado');
    }

    if (record.sinalizadoStatus === false) {
      add('Ambiente não sinalizado');
    }

    if (record.poderiaSerEvitadoStatus === true) {
      add('Potencialmente evitável');
    }

    if (record.hasLesao === true) {
      add('Registro com lesão');
    }

    if (record.ltsStatus === true) {
      add('Registro com LTS');
    }
  });

  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      value,
      percent: percent(value, records.length),
    }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, 'pt-BR'))
    .slice(0, limit);
}

export function getDatasetSummary(
  rawTotal: number,
  filteredRecords: NormalizedSinistro[],
): DatasetSummary {
  const sortedDates = filteredRecords
    .map((record) => record.parsedDate)
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => a.getTime() - b.getTime());

  return {
    totalRaw: rawTotal,
    totalFiltered: filteredRecords.length,
    startDate: sortedDates[0] ?? null,
    endDate: sortedDates[sortedDates.length - 1] ?? null,
  };
}

function missingText(records: NormalizedSinistro[], selector: (record: NormalizedSinistro) => string): number {
  return countWhere(records, (record) => selector(record) === NOT_INFORMED);
}

function missingStatus(
  records: NormalizedSinistro[],
  selector: (record: NormalizedSinistro) => boolean | null,
): number {
  return countWhere(records, (record) => selector(record) === null);
}

function qualityStatus(percentMissing: number): QualityMetric['status'] {
  if (percentMissing >= 35) {
    return 'crítico';
  }

  if (percentMissing >= 15) {
    return 'atenção';
  }

  return 'adequado';
}

export function calculateQualitySummary(records: NormalizedSinistro[]): QualitySummary {
  const total = records.length;
  const metricDefinitions: Array<{ field: string; missing: number }> = [
    { field: 'Hora do acidente', missing: missingText(records, (record) => record.hora_acidente) },
    { field: 'Iluminação', missing: missingStatus(records, (record) => record.iluminadoStatus) },
    { field: 'Sinalização', missing: missingStatus(records, (record) => record.sinalizadoStatus) },
    { field: 'Condição da via', missing: missingText(records, (record) => record.condicoes_via) },
    { field: 'Condição climática', missing: missingText(records, (record) => record.condicao_climaticas) },
    { field: 'Evitabilidade', missing: missingStatus(records, (record) => record.poderiaSerEvitadoStatus) },
    { field: 'Local/circunstância', missing: missingText(records, (record) => record.local_circunstancias) },
    { field: 'Data do serviço', missing: countWhere(records, (record) => !record.parsedDate) },
  ];

  if (!total) {
    const metrics = metricDefinitions.map<QualityMetric>((metric) => ({
      field: metric.field,
      missing: 0,
      total: 0,
      percent: 0,
      status: 'crítico',
    }));

    return {
      completeness: 0,
      status: 'crítico',
      metrics,
      criticalFields: [],
    };
  }

  const metrics = metricDefinitions.map<QualityMetric>((metric) => {
    const percentMissing = percent(metric.missing, total);
    return {
      field: metric.field,
      missing: metric.missing,
      total,
      percent: percentMissing,
      status: qualityStatus(percentMissing),
    };
  });

  const averageMissing = metrics.length
    ? metrics.reduce((sum, metric) => sum + metric.percent, 0) / metrics.length
    : 0;
  const completeness = clamp(100 - averageMissing, 0, 100);
  const status = completeness < 65 ? 'crítico' : completeness < 85 ? 'atenção' : 'adequado';
  const criticalFields = [...metrics]
    .sort((a, b) => b.percent - a.percent)
    .filter((metric) => metric.percent > 0)
    .slice(0, 4);

  return { completeness, status, metrics, criticalFields };
}

export function uniqueOptions(records: NormalizedSinistro[], selector: (record: NormalizedSinistro) => string) {
  return [...new Set(records.map(selector).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR', { numeric: true }),
  );
}

export function filterRecords(records: NormalizedSinistro[], filters: FilterState): NormalizedSinistro[] {
  return records.filter((record) => {
    const matches = [
      !filters.ano || String(record.ano ?? '') === filters.ano,
      !filters.mes || String(record.mes ?? '') === filters.mes,
      !filters.turno || record.turno === filters.turno,
      !filters.situacao || record.situacao_sinistro === filters.situacao,
      !filters.tipoDeslocamento || record.tipo_deslocamento === filters.tipoDeslocamento,
      !filters.lesao || booleanLabel(record.hasLesao) === filters.lesao,
      !filters.fatalidade || record.fatalidade === filters.fatalidade,
      !filters.lts || record.lts === filters.lts,
      !filters.localCircunstancia || record.local_circunstancias === filters.localCircunstancia,
      !filters.condicaoVia || record.condicoes_via === filters.condicaoVia,
      !filters.condicaoClimatica || record.condicao_climaticas === filters.condicaoClimatica,
      !filters.poderiaSerEvitado || record.poderia_ser_evitado === filters.poderiaSerEvitado,
      !filters.sinalizado || record.e_sinalizado === filters.sinalizado,
      !filters.iluminado || record.e_iluminado === filters.iluminado,
    ];

    return matches.every(Boolean);
  });
}

function trendDescription(records: NormalizedSinistro[]): string {
  const series = timeSeriesByMonth(records);
  const firstValue = series[0]?.value ?? 0;
  const lastValue = series[series.length - 1]?.value ?? 0;

  if (series.length < 2) {
    return 'Série temporal insuficiente para inferência de tendência.';
  }

  if (lastValue > firstValue) {
    return 'A série temporal filtrada encerra em patamar superior ao início do período.';
  }

  if (lastValue < firstValue) {
    return 'A série temporal filtrada encerra em patamar inferior ao início do período.';
  }

  return 'A série temporal filtrada apresenta estabilidade entre início e fim do período.';
}

export function buildExecutiveSummary(records: NormalizedSinistro[]): ExecutiveSummary {
  if (!records.length) {
    return {
      items: [
        {
          label: 'Recorte atual',
          value: 'Sem dados',
          description: 'Não há registros compatíveis com os filtros selecionados.',
          tone: 'attention',
        },
      ],
      trend: 'Sem base temporal para avaliação.',
      topPriority: 'Recompor os filtros para leitura gerencial.',
    };
  }

  const kpis = calculateKpis(records);
  const quality = calculateQualitySummary(records);
  const risk = calculateRiskSummary(records);
  const topTurno = countBy(records, (record) => record.turno)[0];
  const topLocal = countBy(records, (record) => record.local_circunstancias)[0];
  const topFactor = topAssociatedFactors(records, 1)[0];
  const lesionRate = percent(kpis.totalLesao, records.length);

  return {
    items: [
      {
        label: 'Risco operacional',
        value: `${risk.level} (${risk.score}/100)`,
        description: risk.description,
        tone: risk.level === 'Crítico' ? 'critical' : risk.level === 'Elevado' ? 'attention' : 'neutral',
      },
      {
        label: 'Concentração principal',
        value: topTurno ? `Turno ${topTurno.name}` : NOT_INFORMED,
        description: topTurno
          ? `${topTurno.value} registro(s), ${formatPercent(topTurno.percent ?? 0)} do recorte.`
          : 'Sem turno predominante identificado.',
        tone: 'neutral',
      },
      {
        label: 'Ponto recorrente',
        value: topLocal?.name ?? NOT_INFORMED,
        description: topLocal
          ? `${topLocal.value} ocorrência(s) associadas ao local/circunstância.`
          : 'Sem local/circunstância predominante.',
        tone: 'neutral',
      },
      {
        label: 'Impacto no efetivo',
        value: `${kpis.somaDiasLts} dia(s)`,
        description: `LTS acumulado, com média de ${formatDecimal(kpis.mediaDiasLts)} dia(s) nos casos informados.`,
        tone: kpis.somaDiasLts > 0 ? 'attention' : 'positive',
      },
      {
        label: 'Lesões',
        value: formatPercent(lesionRate),
        description: `${kpis.totalLesao} registro(s) com lesão descrita.`,
        tone: lesionRate >= 50 ? 'attention' : 'neutral',
      },
      {
        label: 'Qualidade da base',
        value: formatPercent(quality.completeness),
        description: quality.status === 'adequado' ? 'Completude adequada para análise.' : 'Há lacunas relevantes de preenchimento.',
        tone: quality.status === 'crítico' ? 'critical' : quality.status === 'atenção' ? 'attention' : 'positive',
      },
    ],
    trend: trendDescription(records),
    topPriority: topFactor
      ? `Priorizar análise de ${topFactor.name.toLocaleLowerCase('pt-BR')}, presente em ${topFactor.value} registro(s).`
      : 'Manter monitoramento preventivo do recorte atual.',
  };
}

export function buildStrategicInsights(records: NormalizedSinistro[]): StrategicInsight[] {
  if (!records.length) {
    return [
      {
        category: 'Achado',
        title: 'Recorte sem registros',
        description:
          'Não há registros compatíveis com os filtros selecionados. Revise os critérios para recompor a leitura operacional.',
        priority: 'Atenção',
      },
    ];
  }

  const kpis = calculateKpis(records);
  const risk = calculateRiskSummary(records);
  const quality = calculateQualitySummary(records);
  const topTurno = countBy(records, (record) => record.turno)[0];
  const topLocal = countBy(records, (record) => record.local_circunstancias)[0];
  const topVia = countBy(records, (record) => record.condicoes_via).find((item) => item.name !== NOT_INFORMED);
  const trend = trendDescription(records);

  const criticalEnvironment = [
    kpis.percentualNaoIluminado > 0
      ? `${kpis.percentualNaoIluminado.toFixed(1).replace('.', ',')}% em ambiente não iluminado`
      : '',
    kpis.percentualNaoSinalizado > 0
      ? `${kpis.percentualNaoSinalizado.toFixed(1).replace('.', ',')}% em ambiente não sinalizado`
      : '',
  ]
    .filter(Boolean)
    .join(' e ');

  return [
    {
      category: 'Achado',
      title: 'Concentração operacional',
      description: `O turno com maior incidência é ${topTurno?.name ?? NOT_INFORMED}, concentrando ${topTurno?.value ?? 0} registro(s) no recorte atual.`,
      priority: 'Atenção',
    },
    {
      category: 'Achado',
      title: 'Local/circunstância predominante',
      description: `A principal localidade ou circunstância associada aos sinistros é ${topLocal?.name ?? NOT_INFORMED}, com ${topLocal?.value ?? 0} ocorrência(s).`,
      priority: 'Atenção',
    },
    {
      category: 'Risco',
      title: 'Impacto no efetivo',
      description: `O impacto operacional soma ${kpis.somaDiasLts} dia(s) de LTS, com média de ${formatDecimal(kpis.mediaDiasLts)} dia(s) nos casos com afastamento informado.`,
      priority: kpis.somaDiasLts > 0 ? 'Prioritário' : 'Rotina',
    },
    {
      category: 'Risco',
      title: 'Risco operacional consolidado',
      description: `O índice composto do recorte é ${risk.level.toLocaleLowerCase('pt-BR')} (${risk.score}/100), considerando gravidade, LTS, evitabilidade e fatores ambientais.`,
      priority: risk.level === 'Crítico' || risk.level === 'Elevado' ? 'Prioritário' : 'Atenção',
    },
    {
      category: 'Risco',
      title: 'Ambiente e infraestrutura',
      description: criticalEnvironment
        ? `Há presença de fatores ambientais críticos: ${criticalEnvironment}.`
        : 'Não há incidência registrada de ambiente não iluminado ou não sinalizado no recorte atual.',
      priority: criticalEnvironment ? 'Atenção' : 'Rotina',
    },
    {
      category: 'Recomendação',
      title: 'Plano preventivo direcionado',
      description: topVia
        ? `Priorizar análise preventiva nos contextos associados à condição de via ${topVia.name}, integrando orientação, fiscalização e revisão de rotas.`
        : 'Qualificar o preenchimento de condição da via para permitir leitura preventiva mais precisa.',
      priority: 'Prioritário',
    },
    {
      category: 'Recomendação',
      title: 'Qualificação da base',
      description: `A completude estimada da base filtrada é ${formatPercent(quality.completeness)}. Campos com maior lacuna devem ser tratados como melhoria de processo de registro.`,
      priority: quality.status === 'adequado' ? 'Rotina' : 'Atenção',
    },
    {
      category: 'Achado',
      title: 'Tendência temporal',
      description: trend,
      priority: 'Rotina',
    },
  ];
}
