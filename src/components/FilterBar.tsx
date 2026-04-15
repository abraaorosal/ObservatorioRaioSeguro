import { RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FILTER_ALL_LABEL } from '../constants/filters';
import type { FilterState } from '../types/sinistro';

interface Option {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: FilterState;
  options: {
    years: string[];
    months: Option[];
    turnos: string[];
    situacoes: string[];
    tiposDeslocamento: string[];
    lesoes: string[];
    fatalidades: string[];
    lts: string[];
    locais: string[];
    condicoesVia: string[];
    condicoesClimaticas: string[];
    poderiaSerEvitado: string[];
    sinalizado: string[];
    iluminado: string[];
  };
  onChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: keyof FilterState;
  label: string;
  value: string;
  options: Array<string | Option>;
  onChange: (key: keyof FilterState, value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-institutional-ink">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
        className="min-h-11 rounded-md border border-institutional-line bg-white px-3 py-2 text-sm font-medium text-institutional-graphite shadow-sm transition hover:border-institutional-gold"
      >
        <option value="">{FILTER_ALL_LABEL}</option>
        {options.map((option) => {
          const normalized = typeof option === 'string' ? { value: option, label: option } : option;
          return (
            <option key={`${id}-${normalized.value}`} value={normalized.value}>
              {normalized.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export function FilterBar({ filters, options, onChange, onClear }: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeFilters = useMemo(() => {
    return (Object.entries(filters) as Array<[keyof FilterState, string]>).filter(([, value]) => Boolean(value));
  }, [filters]);

  const activeFilterCount = activeFilters.length;

  const filterLabels: Record<keyof FilterState, string> = {
    ano: 'Ano',
    mes: 'Mês',
    turno: 'Turno',
    situacao: 'Situação',
    tipoDeslocamento: 'Deslocamento',
    lesao: 'Lesão',
    fatalidade: 'Fatalidade',
    lts: 'LTS',
    localCircunstancia: 'Local/circunstância',
    condicaoVia: 'Condição da via',
    condicaoClimatica: 'Condição climática',
    poderiaSerEvitado: 'Evitável',
    sinalizado: 'Sinalizado',
    iluminado: 'Iluminado',
  };

  const resolveFilterValueLabel = (key: keyof FilterState, value: string) => {
    if (key === 'mes') {
      const monthLabel = options.months.find((option) => option.value === value)?.label;
      return monthLabel ?? value;
    }

    return value;
  };

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <section
      id="filtros"
      className="scroll-mt-28 rounded-lg border border-institutional-line bg-white p-4 shadow-sm md:p-5"
      aria-labelledby="filtros-globais"
    >
      <div className="mb-4 flex flex-col gap-4 md:mb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-institutional-gold" aria-hidden="true" />
            <h2 id="filtros-globais" className="text-lg font-bold text-institutional-ink">
              Filtros globais
            </h2>
          </div>
          <p className="mt-1 text-sm leading-6 text-institutional-steel">
            Os critérios abaixo atualizam indicadores, gráficos, leituras estratégicas e tabela.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-institutional-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-institutional-graphite md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {activeFilterCount ? `Ajustar filtros (${activeFilterCount})` : 'Ajustar filtros'}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-institutional-line bg-institutional-surface px-4 py-2 text-sm font-bold text-institutional-graphite transition hover:border-institutional-gold hover:bg-white"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Limpar filtros
          </button>
        </div>
      </div>

      {activeFilterCount ? (
        <div className="scrollbar-official md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {activeFilters.map(([key, value]) => (
              <span
                key={`active-${key}`}
                className="whitespace-nowrap rounded-md border border-institutional-line bg-institutional-surface px-3 py-2 text-xs font-bold text-institutional-graphite"
              >
                {filterLabels[key]}: {resolveFilterValueLabel(key, value)}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="md:hidden text-sm leading-6 text-institutional-steel">
          Nenhum filtro aplicado. Toque em Ajustar filtros para refinar o recorte.
        </p>
      )}

      <div className="hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
        <SelectField id="ano" label="Ano" value={filters.ano} options={options.years} onChange={onChange} />
        <SelectField id="mes" label="Mês" value={filters.mes} options={options.months} onChange={onChange} />
        <SelectField id="turno" label="Turno" value={filters.turno} options={options.turnos} onChange={onChange} />
        <SelectField
          id="situacao"
          label="Situação do sinistro"
          value={filters.situacao}
          options={options.situacoes}
          onChange={onChange}
        />
        <SelectField
          id="tipoDeslocamento"
          label="Tipo de deslocamento"
          value={filters.tipoDeslocamento}
          options={options.tiposDeslocamento}
          onChange={onChange}
        />
        <SelectField id="lesao" label="Lesão" value={filters.lesao} options={options.lesoes} onChange={onChange} />
        <SelectField
          id="fatalidade"
          label="Fatalidade"
          value={filters.fatalidade}
          options={options.fatalidades}
          onChange={onChange}
        />
        <SelectField id="lts" label="LTS" value={filters.lts} options={options.lts} onChange={onChange} />
        <SelectField
          id="localCircunstancia"
          label="Local/circunstância"
          value={filters.localCircunstancia}
          options={options.locais}
          onChange={onChange}
        />
        <SelectField
          id="condicaoVia"
          label="Condição da via"
          value={filters.condicaoVia}
          options={options.condicoesVia}
          onChange={onChange}
        />
        <SelectField
          id="condicaoClimatica"
          label="Condição climática"
          value={filters.condicaoClimatica}
          options={options.condicoesClimaticas}
          onChange={onChange}
        />
        <SelectField
          id="poderiaSerEvitado"
          label="Poderia ser evitado"
          value={filters.poderiaSerEvitado}
          options={options.poderiaSerEvitado}
          onChange={onChange}
        />
        <SelectField
          id="sinalizado"
          label="Ambiente sinalizado"
          value={filters.sinalizado}
          options={options.sinalizado}
          onChange={onChange}
        />
        <SelectField
          id="iluminado"
          label="Ambiente iluminado"
          value={filters.iluminado}
          options={options.iluminado}
          onChange={onChange}
        />
      </div>

      {mobileOpen ? (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filtros-mobile-title"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-xl border border-institutional-line bg-white p-4 shadow-official"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-institutional-steel">
                  Recorte institucional
                </p>
                <h3 id="filtros-mobile-title" className="mt-1 text-lg font-bold text-institutional-ink">
                  Ajustar filtros
                </h3>
                <p className="mt-1 text-sm leading-6 text-institutional-steel">
                  As mudanças são aplicadas imediatamente ao dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-institutional-line bg-white text-institutional-graphite"
                aria-label="Fechar filtros"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-4">
              <SelectField id="ano" label="Ano" value={filters.ano} options={options.years} onChange={onChange} />
              <SelectField id="mes" label="Mês" value={filters.mes} options={options.months} onChange={onChange} />
              <SelectField id="turno" label="Turno" value={filters.turno} options={options.turnos} onChange={onChange} />
              <SelectField
                id="situacao"
                label="Situação do sinistro"
                value={filters.situacao}
                options={options.situacoes}
                onChange={onChange}
              />
              <SelectField
                id="tipoDeslocamento"
                label="Tipo de deslocamento"
                value={filters.tipoDeslocamento}
                options={options.tiposDeslocamento}
                onChange={onChange}
              />
              <SelectField id="lesao" label="Lesão" value={filters.lesao} options={options.lesoes} onChange={onChange} />
              <SelectField
                id="fatalidade"
                label="Fatalidade"
                value={filters.fatalidade}
                options={options.fatalidades}
                onChange={onChange}
              />
              <SelectField id="lts" label="LTS" value={filters.lts} options={options.lts} onChange={onChange} />
              <SelectField
                id="localCircunstancia"
                label="Local/circunstância"
                value={filters.localCircunstancia}
                options={options.locais}
                onChange={onChange}
              />
              <SelectField
                id="condicaoVia"
                label="Condição da via"
                value={filters.condicaoVia}
                options={options.condicoesVia}
                onChange={onChange}
              />
              <SelectField
                id="condicaoClimatica"
                label="Condição climática"
                value={filters.condicaoClimatica}
                options={options.condicoesClimaticas}
                onChange={onChange}
              />
              <SelectField
                id="poderiaSerEvitado"
                label="Poderia ser evitado"
                value={filters.poderiaSerEvitado}
                options={options.poderiaSerEvitado}
                onChange={onChange}
              />
              <SelectField
                id="sinalizado"
                label="Ambiente sinalizado"
                value={filters.sinalizado}
                options={options.sinalizado}
                onChange={onChange}
              />
              <SelectField
                id="iluminado"
                label="Ambiente iluminado"
                value={filters.iluminado}
                options={options.iluminado}
                onChange={onChange}
              />
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={onClear}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-institutional-line bg-institutional-surface px-4 py-2 text-sm font-bold text-institutional-graphite transition hover:border-institutional-gold hover:bg-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Limpar filtros
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-institutional-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-institutional-graphite"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
