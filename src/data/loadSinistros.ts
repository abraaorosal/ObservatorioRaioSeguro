import type { NormalizedSinistro, SinistroWorkbook } from '../types/sinistro';
import { normalizeSinistro } from '../utils/normalization';

export async function loadSinistrosFromWorkbook(): Promise<{ records: NormalizedSinistro[]; rawCount: number }> {
  const response = await fetch('/sinistro_transito.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Não foi possível localizar o arquivo sinistro_transito.json (pasta public).');
  }

  const workbook = (await response.json()) as SinistroWorkbook;
  const rawRecords = workbook.sheets?.sinistro_transito;

  if (!Array.isArray(rawRecords)) {
    throw new Error('A planilha sinistro_transito não foi localizada no arquivo JSON.');
  }

  return { records: rawRecords.map(normalizeSinistro), rawCount: rawRecords.length };
}
