import { NOT_INFORMED } from '../constants/filters';

export function maskSensitiveIdentifier(value: string): string {
  if (!value || value === NOT_INFORMED) {
    return NOT_INFORMED;
  }

  const compact = value.trim();
  if (compact.length <= 4) {
    return `${compact.slice(0, 1)}***`;
  }

  return `${compact.slice(0, 3)}${'*'.repeat(Math.max(3, compact.length - 5))}${compact.slice(-2)}`;
}
