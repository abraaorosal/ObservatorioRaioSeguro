import type { FilterState } from '../types/sinistro';

export const EMPTY_FILTERS: FilterState = {
  ano: '',
  mes: '',
  turno: '',
  situacao: '',
  tipoDeslocamento: '',
  lesao: '',
  fatalidade: '',
  lts: '',
  localCircunstancia: '',
  condicaoVia: '',
  condicaoClimatica: '',
  poderiaSerEvitado: '',
  sinalizado: '',
  iluminado: '',
};

export const FILTER_ALL_LABEL = 'Todos';
export const NOT_INFORMED = 'Não informado';
export const YES_LABEL = 'Sim';
export const NO_LABEL = 'Não';
