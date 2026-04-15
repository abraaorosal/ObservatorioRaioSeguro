import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Download, Eye, EyeOff, Search } from 'lucide-react';
import { NOT_INFORMED } from '../constants/filters';
import type { NormalizedSinistro, SortDirection, SortKey } from '../types/sinistro';
import { downloadCsv } from '../utils/csv';
import { stripAccents } from '../utils/normalization';
import { maskSensitiveIdentifier } from '../utils/privacy';
import { Badge } from './Badge';
import { EmptyState } from './EmptyState';

interface DataTableProps {
  records: NormalizedSinistro[];
}

interface Column {
  key: SortKey;
  label: string;
  className?: string;
}

const PAGE_SIZE = 12;

const columns: Column[] = [
  { key: 'id_sinistro', label: 'ID' },
  { key: 'data_servico', label: 'Data' },
  { key: 'hora_acidente', label: 'Hora' },
  { key: 'turno', label: 'Turno' },
  { key: 'situacao_sinistro', label: 'Situação' },
  { key: 'tipo_deslocamento', label: 'Deslocamento', className: 'min-w-64' },
  { key: 'local_circunstancias', label: 'Local/circunstância', className: 'min-w-64' },
  { key: 'condicoes_via', label: 'Via', className: 'min-w-48' },
  { key: 'condicao_climaticas', label: 'Clima', className: 'min-w-44' },
  { key: 'lesao', label: 'Lesão', className: 'min-w-64' },
  { key: 'fatalidade', label: 'Fatalidade' },
  { key: 'lts', label: 'LTS' },
  { key: 'dias_lts', label: 'Dias LTS' },
  { key: 'policial_vitima', label: 'Policial vítima' },
  { key: 'resp_registro', label: 'Responsável' },
];

function searchInRecord(
  record: NormalizedSinistro,
  search: string,
  includeSensitiveData: boolean,
): boolean {
  if (!search) {
    return true;
  }

  const normalizedSearch = stripAccents(search).toLocaleLowerCase('pt-BR');
  return columns.some((column) => {
    const rawValue =
      column.key === 'policial_vitima' && !includeSensitiveData
        ? maskSensitiveIdentifier(record.policial_vitima)
        : record[column.key];
    const value = String(rawValue ?? '');
    return stripAccents(value).toLocaleLowerCase('pt-BR').includes(normalizedSearch);
  });
}

function compareRecords(a: NormalizedSinistro, b: NormalizedSinistro, key: SortKey, direction: SortDirection) {
  const multiplier = direction === 'asc' ? 1 : -1;

  if (key === 'dias_lts') {
    return (a.dias_lts - b.dias_lts) * multiplier;
  }

  if (key === 'data_servico') {
    return ((a.timestamp ?? 0) - (b.timestamp ?? 0)) * multiplier;
  }

  return String(a[key] ?? '').localeCompare(String(b[key] ?? ''), 'pt-BR', { numeric: true }) * multiplier;
}

function CriticalBadges({ record }: { record: NormalizedSinistro }) {
  return (
    <div className="flex flex-wrap gap-1">
      {record.fatalidadeStatus === true ? <Badge variant="danger">Fatalidade</Badge> : null}
      {record.ltsStatus === true ? <Badge variant="warning">LTS</Badge> : null}
      {record.hasLesao === true ? <Badge variant="info">Lesão</Badge> : null}
      {record.dias_lts >= 30 ? <Badge variant="danger">LTS elevado</Badge> : null}
      {record.criticidade === 'regular' ? <Badge>Regular</Badge> : null}
    </div>
  );
}

export function DataTable({ records }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('data_servico');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  const searchedRecords = useMemo(
    () => records.filter((record) => searchInRecord(record, search, showSensitiveData)),
    [records, search, showSensitiveData],
  );

  const sortedRecords = useMemo(
    () => [...searchedRecords].sort((a, b) => compareRecords(a, b, sortKey, sortDirection)),
    [searchedRecords, sortDirection, sortKey],
  );

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecords = sortedRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    setPage(1);
    if (key === sortKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return (
    <div className="rounded-lg border border-institutional-line bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-institutional-line p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-institutional-ink">Base analítica</h3>
          <p className="mt-1 text-sm leading-6 text-institutional-steel">
            Consulta tabular com busca, ordenação e paginação. A identificação pessoal é mascarada por
            padrão para governança e proteção de dados.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
          <label className="relative">
            <span className="sr-only">Buscar registros</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-institutional-steel" />
            <input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Buscar na tabela"
              className="min-h-11 w-full rounded-md border border-institutional-line bg-white py-2 pl-9 pr-3 text-sm text-institutional-ink shadow-sm sm:w-72"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowSensitiveData((current) => !current)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-institutional-line bg-white px-4 py-2 text-sm font-bold text-institutional-graphite transition hover:border-institutional-green"
          >
            {showSensitiveData ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
            {showSensitiveData ? 'Mascarar identificação' : 'Exibir identificação'}
          </button>
          <button
            type="button"
            onClick={() =>
              downloadCsv(sortedRecords, 'sinistros-filtrados.csv', {
                maskSensitive: !showSensitiveData,
              })
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-institutional-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-institutional-graphite"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Exportar CSV
          </button>
        </div>
      </div>

      {sortedRecords.length ? (
        <>
          <div className="scrollbar-official overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-institutional-surface text-xs uppercase text-institutional-graphite">
                <tr>
                  <th className="sticky left-0 z-10 border-b border-institutional-line bg-institutional-surface px-4 py-3">
                    Criticidade
                  </th>
                  {columns.map((column) => {
                    const active = column.key === sortKey;
                    const SortIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown;
                    return (
                      <th
                        key={column.key}
                        className={`border-b border-institutional-line px-4 py-3 ${column.className ?? ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSort(column.key)}
                          className="inline-flex items-center gap-1 rounded-md px-1 py-1 font-bold text-institutional-graphite hover:text-institutional-ink"
                        >
                          {column.label}
                          {active ? <SortIcon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((record) => (
                  <tr
                    key={`${record.id_sinistro}-${record.data_servico}`}
                    className={`border-b border-slate-100 align-top hover:bg-institutional-surface/70 ${
                      record.fatalidadeStatus === true
                        ? 'bg-red-50/70'
                        : record.dias_lts >= 30
                          ? 'bg-amber-50/55'
                          : ''
                    }`}
                  >
                    <td className="sticky left-0 z-10 min-w-44 bg-inherit px-4 py-3">
                      <CriticalBadges record={record} />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={`${record.id_sinistro}-${column.key}`}
                        className="max-w-sm px-4 py-3 leading-6 text-institutional-graphite"
                      >
                        {column.key === 'policial_vitima' && !showSensitiveData
                          ? maskSensitiveIdentifier(record.policial_vitima)
                          : String(record[column.key] ?? NOT_INFORMED)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 p-4 text-sm text-institutional-steel md:flex-row md:items-center md:justify-between">
            <span>
              Exibindo {paginatedRecords.length} de {sortedRecords.length} registro(s).
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-institutional-line px-3 py-2 font-semibold text-institutional-graphite disabled:cursor-not-allowed disabled:opacity-45"
              >
                Anterior
              </button>
              <span className="font-semibold text-institutional-ink">
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-institutional-line px-3 py-2 font-semibold text-institutional-graphite disabled:cursor-not-allowed disabled:opacity-45"
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="p-5">
          <EmptyState />
        </div>
      )}
    </div>
  );
}
