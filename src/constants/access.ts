export const FUTURE_ACCESS_PROFILES = [
  'administrador',
  'analista',
  'gestor',
] as const;

export type AccessProfile = (typeof FUTURE_ACCESS_PROFILES)[number];
