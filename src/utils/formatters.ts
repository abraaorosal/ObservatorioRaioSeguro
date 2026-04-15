import { NOT_INFORMED } from '../constants/filters';

const numberFormatter = new Intl.NumberFormat('pt-BR');
const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatDecimal(value: number): string {
  return decimalFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(Number.isFinite(value) ? value : 0)}%`;
}

export function formatDatePtBr(date: Date | null): string {
  if (!date) {
    return NOT_INFORMED;
  }

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function formatPeriod(startDate: Date | null, endDate: Date | null): string {
  if (!startDate || !endDate) {
    return NOT_INFORMED;
  }

  return `${formatDatePtBr(startDate)} a ${formatDatePtBr(endDate)}`;
}

export function getMonthName(month: number | null): string {
  if (!month || month < 1 || month > 12) {
    return NOT_INFORMED;
  }

  const text = monthFormatter.format(new Date(2020, month - 1, 1));
  return text.charAt(0).toUpperCase() + text.slice(1).replace('.', '');
}

export function getWeekdayName(date: Date | null): string {
  if (!date) {
    return NOT_INFORMED;
  }

  const text = weekdayFormatter.format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function pluralize(value: number, singular: string, plural: string): string {
  return `${formatNumber(value)} ${value === 1 ? singular : plural}`;
}

export function truncateText(value: string, maxLength = 96): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}
