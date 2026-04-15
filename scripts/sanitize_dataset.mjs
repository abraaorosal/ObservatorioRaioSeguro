import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT_DATASET = path.resolve('sinistro_transito.json');
const OUT_DATASET = path.resolve('public', 'sinistro_transito.json');

const SENSITIVE_FIELDS = new Set(['policial_vitima', 'placa_veiculo_pm', 'resp_registro']);

function extractRecords(workbook) {
  const direct = workbook?.sheets?.sinistro_transito;
  if (Array.isArray(direct)) return direct;

  const nested = workbook?.workbook?.sheets?.sinistro_transito;
  if (Array.isArray(nested)) return nested;

  return undefined;
}

function sanitizeRecord(record) {
  if (!record || typeof record !== 'object') return record;
  const next = { ...record };
  for (const key of SENSITIVE_FIELDS) {
    if (key in next) next[key] = null;
  }
  return next;
}

const raw = JSON.parse(await fs.readFile(ROOT_DATASET, 'utf8'));
const records = extractRecords(raw);

if (!Array.isArray(records)) {
  throw new Error('Nao encontrei sheets.sinistro_transito (nem workbook.sheets.sinistro_transito) no JSON raiz.');
}

const sanitizedRecords = records.map(sanitizeRecord);

// Preserve the original envelope but replace the dataset locations with the sanitized records.
const out = { ...raw };
out.sheets = { ...(raw.sheets ?? {}), sinistro_transito: sanitizedRecords };
if (raw.workbook && typeof raw.workbook === 'object') {
  out.workbook = { ...raw.workbook };
  out.workbook.sheets = { ...(raw.workbook.sheets ?? {}), sinistro_transito: sanitizedRecords };
}

await fs.mkdir(path.dirname(OUT_DATASET), { recursive: true });
await fs.writeFile(OUT_DATASET, JSON.stringify(out, null, 2) + '\n', 'utf8');

console.log(`OK: ${sanitizedRecords.length} registros gerados em ${OUT_DATASET}`);
