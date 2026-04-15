import type { NormalizedSinistro } from '../types/sinistro';
import { maskSensitiveIdentifier } from './privacy';

const CSV_COLUMNS: Array<{ key: keyof NormalizedSinistro; label: string }> = [
  { key: 'id_sinistro', label: 'id_sinistro' },
  { key: 'data_servico', label: 'data_servico' },
  { key: 'hora_acidente', label: 'hora_acidente' },
  { key: 'turno', label: 'turno' },
  { key: 'situacao_sinistro', label: 'situacao_sinistro' },
  { key: 'tipo_deslocamento', label: 'tipo_deslocamento' },
  { key: 'local_circunstancias', label: 'local_circunstancias' },
  { key: 'condicoes_via', label: 'condicoes_via' },
  { key: 'condicao_climaticas', label: 'condicao_climaticas' },
  { key: 'lesao', label: 'lesao' },
  { key: 'fatalidade', label: 'fatalidade' },
  { key: 'lts', label: 'lts' },
  { key: 'dias_lts', label: 'dias_lts' },
  { key: 'policial_vitima', label: 'policial_vitima' },
  { key: 'resp_registro', label: 'resp_registro' },
];

function escapeCsv(value: unknown): string {
  const text = String(value ?? '');
  if (/[",\n;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function recordsToCsv(records: NormalizedSinistro[], options: { maskSensitive?: boolean } = {}): string {
  const header = CSV_COLUMNS.map((column) => escapeCsv(column.label)).join(';');
  const rows = records.map((record) =>
    CSV_COLUMNS.map((column) => {
      const value =
        options.maskSensitive && column.key === 'policial_vitima'
          ? maskSensitiveIdentifier(record.policial_vitima)
          : record[column.key];
      return escapeCsv(value);
    }).join(';'),
  );

  return [header, ...rows].join('\n');
}

export function downloadCsv(
  records: NormalizedSinistro[],
  filename = 'sinistros-filtrados.csv',
  options: { maskSensitive?: boolean } = { maskSensitive: true },
) {
  const blob = new Blob([`\uFEFF${recordsToCsv(records, options)}`], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
