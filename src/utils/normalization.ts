import { NO_LABEL, NOT_INFORMED, YES_LABEL } from '../constants/filters';
import type { BooleanStatus, NormalizedSinistro, NullableField, RawSinistro } from '../types/sinistro';
import { getMonthName, getWeekdayName } from './formatters';

const EMPTY_VALUES = new Set(['', '-', '--', 'null', 'undefined', 'nan', 'n/a', 'nao informado', 'não informado']);

const YES_VALUES = new Set(['sim', 's', 'true', 'verdadeiro', '1', 'yes']);
const NO_VALUES = new Set(['não', 'nao', 'n', 'false', 'falso', '0', 'no']);

const NO_CONTENT_PATTERNS = [
  /^n[aã]o$/,
  /^n[aã]o houve/,
  /^sem\b/,
  /^n[aã]o informado$/,
  /^nenhum/,
  /^inexistente/,
];

const LOWERCASE_WORDS = new Set([
  'a',
  'ao',
  'aos',
  'as',
  'com',
  'da',
  'das',
  'de',
  'do',
  'dos',
  'e',
  'em',
  'na',
  'nas',
  'no',
  'nos',
  'o',
  'os',
  'ou',
  'para',
]);

export function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeText(value: NullableField): string {
  if (value === null || value === undefined) {
    return NOT_INFORMED;
  }

  const raw = String(value).replace(/\s+/g, ' ').trim();
  if (EMPTY_VALUES.has(stripAccents(raw).toLowerCase())) {
    return NOT_INFORMED;
  }

  return raw;
}

export function normalizeCategory(value: NullableField): string {
  const text = normalizeText(value);
  if (text === NOT_INFORMED) {
    return text;
  }

  const words = text
    .toLocaleLowerCase('pt-BR')
    .split(' ')
    .filter(Boolean);

  return words
    .map((part, index) => {
      const normalized = stripAccents(part);
      const isSingleShortCode =
        words.length === 1 && (/^[abc]$/i.test(part) || /^[a-z]*\d/i.test(part) || /^\d+[a-z]?$/i.test(part));

      if (isSingleShortCode) {
        return part.toUpperCase();
      }

      if (LOWERCASE_WORDS.has(normalized)) {
        return index === 0 ? part.charAt(0).toLocaleUpperCase('pt-BR') + part.slice(1) : part;
      }

      return part.charAt(0).toLocaleUpperCase('pt-BR') + part.slice(1);
    })
    .join(' ');
}

export function parseBooleanStatus(value: NullableField): BooleanStatus {
  const text = normalizeText(value);
  if (text === NOT_INFORMED) {
    return null;
  }

  const normalized = stripAccents(text).toLocaleLowerCase('pt-BR');
  if (YES_VALUES.has(normalized)) {
    return true;
  }

  if (NO_VALUES.has(normalized)) {
    return false;
  }

  if (normalized.includes('sim')) {
    return true;
  }

  if (normalized.includes('nao') || normalized.includes('não')) {
    return false;
  }

  return null;
}

export function booleanLabel(value: BooleanStatus): string {
  if (value === true) {
    return YES_LABEL;
  }

  if (value === false) {
    return NO_LABEL;
  }

  return NOT_INFORMED;
}

export function hasMeaningfulContent(value: NullableField): BooleanStatus {
  const text = normalizeText(value);
  if (text === NOT_INFORMED) {
    return null;
  }

  const normalized = stripAccents(text).toLocaleLowerCase('pt-BR');
  if (NO_CONTENT_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return false;
  }

  return true;
}

export function parseNumber(value: NullableField): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const cleaned = String(value)
    .trim()
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseDateInput(value: NullableField): Date | null {
  const text = normalizeText(value);
  if (text === NOT_INFORMED) {
    return null;
  }

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const brMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (brMatch) {
    const [, day, month, year, hour = '0', minute = '0', second = '0'] = brMatch;
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const fallback = new Date(text);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function normalizeSinistro(record: RawSinistro): NormalizedSinistro {
  const parsedDate = parseDateInput(record.data_servico);
  const ano = parsedDate?.getFullYear() ?? null;
  const mes = parsedDate ? parsedDate.getMonth() + 1 : null;
  const mesNome = getMonthName(mes);
  const mesAno = ano && mes ? `${mesNome}/${ano}` : NOT_INFORMED;
  const mesAnoKey = ano && mes ? `${ano}-${String(mes).padStart(2, '0')}` : NOT_INFORMED;
  const trimestre = ano && mes ? `${Math.ceil(mes / 3)}º trimestre/${ano}` : NOT_INFORMED;
  const diaSemana = getWeekdayName(parsedDate);
  const diasLts = parseNumber(record.dias_lts);
  const fatalidadeStatus = parseBooleanStatus(record.fatalidade);
  const ltsStatus = parseBooleanStatus(record.lts);
  const sinalizadoStatus = parseBooleanStatus(record.e_sinalizado);
  const iluminadoStatus = parseBooleanStatus(record.e_iluminado);
  const poderiaSerEvitadoStatus = parseBooleanStatus(record.poderia_ser_evitado);
  const hasLesao = hasMeaningfulContent(record.lesao);
  const hasDanoMaterial = hasMeaningfulContent(record.dano_material);

  return {
    id_sinistro: normalizeText(record.id_sinistro),
    policial_vitima: normalizeText(record.policial_vitima),
    data_servico: parsedDate
      ? parsedDate.toLocaleDateString('pt-BR')
      : normalizeText(record.data_servico),
    hora_acidente: normalizeText(record.hora_acidente),
    turno: normalizeCategory(record.turno),
    placa_veiculo_pm: normalizeText(record.placa_veiculo_pm),
    condicao_veiculo_pneu: normalizeCategory(record.condicao_veiculo_pneu),
    condicao_veiculo_freio: normalizeCategory(record.condicao_veiculo_freio),
    situacao_sinistro: normalizeCategory(record.situacao_sinistro),
    tipo_deslocamento: normalizeCategory(record.tipo_deslocamento),
    e_sinalizado: booleanLabel(sinalizadoStatus),
    e_iluminado: booleanLabel(iluminadoStatus),
    condicoes_via: normalizeCategory(record.condicoes_via),
    local_circunstancias: normalizeCategory(record.local_circunstancias),
    condicao_climaticas: normalizeCategory(record.condicao_climaticas),
    poderia_ser_evitado: booleanLabel(poderiaSerEvitadoStatus),
    avanco_preferencial: normalizeCategory(record.avanco_preferencial),
    percepcao_velocidade_pm: normalizeCategory(record.percepcao_velocidade_pm),
    percepcao_velocidade_outros: normalizeCategory(record.percepcao_velocidade_outros),
    dano_material: normalizeText(record.dano_material),
    lesao: normalizeText(record.lesao),
    fatalidade: booleanLabel(fatalidadeStatus),
    lts: booleanLabel(ltsStatus),
    dias_lts_original: normalizeText(record.dias_lts),
    dias_lts: diasLts,
    data_registro: normalizeText(record.data_registro),
    resp_registro: normalizeText(record.resp_registro),
    parsedDate,
    timestamp: parsedDate?.getTime() ?? null,
    ano,
    mes,
    mesNome,
    mesAno,
    mesAnoKey,
    trimestre,
    diaSemana,
    fatalidadeStatus,
    ltsStatus,
    sinalizadoStatus,
    iluminadoStatus,
    poderiaSerEvitadoStatus,
    hasLesao,
    hasDanoMaterial,
    criticidade:
      fatalidadeStatus === true
        ? 'fatalidade'
        : diasLts >= 30
          ? 'lts-alto'
          : hasLesao === true || ltsStatus === true
            ? 'lesao'
            : 'regular',
  };
}
