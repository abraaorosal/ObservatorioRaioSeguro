import type { NormalizedSinistro, RawSinistro, SinistroWorkbook } from '../types/sinistro';
import { normalizeSinistro } from '../utils/normalization';

function extractSinistroRecords(workbook: SinistroWorkbook): RawSinistro[] | undefined {
  const direct = workbook.sheets?.sinistro_transito;
  if (Array.isArray(direct)) {
    return direct;
  }

  const nested = (workbook.workbook as { sheets?: { sinistro_transito?: RawSinistro[] } } | undefined)?.sheets
    ?.sinistro_transito;
  if (Array.isArray(nested)) {
    return nested;
  }

  return undefined;
}

export async function loadSinistrosFromWorkbook(): Promise<{ records: NormalizedSinistro[]; rawCount: number }> {
  // BASE_URL is usually a path (e.g. "/ObservatorioRaioSeguro/") on GitHub Pages, not an absolute URL.
  const datasetPath = `${import.meta.env.BASE_URL}sinistro_transito.json`;
  const response = await fetch(datasetPath, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Não foi possível localizar o arquivo sinistro_transito.json (pasta public).');
  }

  const workbook = (await response.json()) as SinistroWorkbook;
  const rawRecords = extractSinistroRecords(workbook);

  if (!Array.isArray(rawRecords)) {
    throw new Error('A planilha sinistro_transito não foi localizada no JSON (sheets.sinistro_transito).');
  }

  return { records: rawRecords.map(normalizeSinistro), rawCount: rawRecords.length };
}

export async function loadSinistrosFromFile(
  file: File,
): Promise<{ records: NormalizedSinistro[]; rawCount: number; label: string }> {
  const text = await file.text();
  const workbook = JSON.parse(text) as SinistroWorkbook;
  const rawRecords = extractSinistroRecords(workbook);

  if (!Array.isArray(rawRecords)) {
    throw new Error('A planilha sinistro_transito não foi localizada no JSON enviado.');
  }

  return { records: rawRecords.map(normalizeSinistro), rawCount: rawRecords.length, label: file.name };
}
