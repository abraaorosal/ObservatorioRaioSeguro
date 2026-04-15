import { useEffect, useMemo, useRef, useState } from 'react';
import { EMPTY_FILTERS, NO_LABEL, NOT_INFORMED, YES_LABEL } from '../constants/filters';
import { loadSinistrosFromFile, loadSinistrosFromWorkbook } from '../data/loadSinistros';
import type { FilterState, NormalizedSinistro } from '../types/sinistro';
import {
  buildStrategicInsights,
  buildExecutiveSummary,
  calculateKpis,
  calculateQualitySummary,
  calculateRiskSummary,
  compareBoolean,
  countBy,
  filterRecords,
  getDatasetSummary,
  lightingSignalingMatrix,
  ltsDaysDistribution,
  timeSeriesByMonth,
  topAssociatedFactors,
  uniqueOptions,
} from '../utils/analytics';

export function useSinistroDashboard() {
  const [records, setRecords] = useState<NormalizedSinistro[]>([]);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [rawCount, setRawCount] = useState(0);
  const [datasetLabel, setDatasetLabel] = useState('Demo (public/sinistro_transito.json)');
  const [datasetSource, setDatasetSource] = useState<'public' | 'file'>('public');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadPublicDataset = () => {
    setLoading(true);
    setError(null);

    return loadSinistrosFromWorkbook()
      .then(({ records: loadedRecords, rawCount: loadedRawCount }) => {
        if (!isMountedRef.current) {
          return;
        }
        setRecords(loadedRecords);
        setRawCount(loadedRawCount);
        setDatasetSource('public');
        setDatasetLabel('Demo (public/sinistro_transito.json)');
      })
      .catch((cause: unknown) => {
        if (!isMountedRef.current) {
          return;
        }
        setError(cause instanceof Error ? cause.message : 'Não foi possível processar o arquivo JSON.');
        setRecords([]);
        setRawCount(0);
      })
      .finally(() => {
        if (isMountedRef.current) {
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    isMountedRef.current = true;
    loadPublicDataset().catch(() => {});

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDatasetFromFile = (file: File) => {
    setLoading(true);
    setError(null);

    return loadSinistrosFromFile(file)
      .then(({ records: loadedRecords, rawCount: loadedRawCount, label }) => {
        if (!isMountedRef.current) {
          return;
        }
        setRecords(loadedRecords);
        setRawCount(loadedRawCount);
        setDatasetSource('file');
        setDatasetLabel(label);
      })
      .catch((cause: unknown) => {
        if (!isMountedRef.current) {
          return;
        }
        setError(cause instanceof Error ? cause.message : 'Não foi possível processar o arquivo enviado.');
      })
      .finally(() => {
        if (isMountedRef.current) {
          setLoading(false);
        }
      });
  };

  const filteredRecords = useMemo(() => filterRecords(records, filters), [records, filters]);

  const options = useMemo(() => {
    const years = [...new Set(records.map((record) => record.ano).filter(Boolean))]
      .map(String)
      .sort((a, b) => Number(a) - Number(b));
    const months = [...new Set(records.map((record) => record.mes).filter(Boolean))]
      .map((month) => ({
        value: String(month),
        label: `${String(month).padStart(2, '0')} - ${
          records.find((record) => record.mes === month)?.mesNome ?? NOT_INFORMED
        }`,
      }))
      .sort((a, b) => Number(a.value) - Number(b.value));
    const booleanOptions = [YES_LABEL, NO_LABEL, NOT_INFORMED];

    return {
      years,
      months,
      turnos: uniqueOptions(records, (record) => record.turno),
      situacoes: uniqueOptions(records, (record) => record.situacao_sinistro),
      tiposDeslocamento: uniqueOptions(records, (record) => record.tipo_deslocamento),
      lesoes: booleanOptions,
      fatalidades: booleanOptions,
      lts: booleanOptions,
      locais: uniqueOptions(records, (record) => record.local_circunstancias),
      condicoesVia: uniqueOptions(records, (record) => record.condicoes_via),
      condicoesClimaticas: uniqueOptions(records, (record) => record.condicao_climaticas),
      poderiaSerEvitado: booleanOptions,
      sinalizado: booleanOptions,
      iluminado: booleanOptions,
    };
  }, [records]);

  const kpis = useMemo(() => calculateKpis(filteredRecords), [filteredRecords]);
  const risk = useMemo(() => calculateRiskSummary(filteredRecords), [filteredRecords]);
  const quality = useMemo(() => calculateQualitySummary(filteredRecords), [filteredRecords]);
  const executiveSummary = useMemo(() => buildExecutiveSummary(filteredRecords), [filteredRecords]);
  const summary = useMemo(
    () => getDatasetSummary(rawCount, filteredRecords),
    [filteredRecords, rawCount],
  );

  const charts = useMemo(
    () => ({
      temporal: timeSeriesByMonth(filteredRecords),
      porTurno: countBy(filteredRecords, (record) => record.turno),
      porSituacao: countBy(filteredRecords, (record) => record.situacao_sinistro),
      porTipoDeslocamento: countBy(filteredRecords, (record) => record.tipo_deslocamento),
      porLocal: countBy(filteredRecords, (record) => record.local_circunstancias, 12),
      porCondicaoVia: countBy(filteredRecords, (record) => record.condicoes_via, 12),
      porCondicaoClimatica: countBy(filteredRecords, (record) => record.condicao_climaticas, 12),
      lesao: compareBoolean(filteredRecords, (record) => record.hasLesao, 'Com lesão', 'Sem lesão'),
      lts: compareBoolean(filteredRecords, (record) => record.ltsStatus, 'Com LTS', 'Sem LTS'),
      fatalidade: compareBoolean(
        filteredRecords,
        (record) => record.fatalidadeStatus,
        'Com fatalidade',
        'Sem fatalidade',
      ),
      diasLts: ltsDaysDistribution(filteredRecords),
      evitabilidade: compareBoolean(
        filteredRecords,
        (record) => record.poderiaSerEvitadoStatus,
        'Potencialmente evitável',
        'Não evitável',
      ),
      iluminacaoSinalizacao: lightingSignalingMatrix(filteredRecords),
      fatoresFrequentes: topAssociatedFactors(filteredRecords),
      diasSemana: countBy(filteredRecords, (record) => record.diaSemana),
      trimestres: countBy(filteredRecords, (record) => record.trimestre),
    }),
    [filteredRecords],
  );

  const insights = useMemo(() => buildStrategicInsights(filteredRecords), [filteredRecords]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  return {
    records,
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
    dataset: {
      source: datasetSource,
      label: datasetLabel,
      rawCount,
    },
    loadDatasetFromFile,
    loadPublicDataset,
  };
}
