import { useState, type ReactNode } from 'react';
import { CalendarDays, Database, ShieldCheck, Target } from 'lucide-react';
import cpraioLogo from '../../logo_raio.jpg';
import pmceLogo from '../assets/logo_pmce_crest.png';
import heroPanel from '../assets/raio-seguro-panel.svg';
import { formatNumber, formatPeriod } from '../utils/formatters';

interface InstitutionalHeaderProps {
  totalRecords: number;
  filteredRecords: number;
  startDate: Date | null;
  endDate: Date | null;
}

function LogoBlock({
  src,
  alt,
  fallback,
  imageClassName,
  logoBoxClassName = 'h-14 w-16',
  children,
}: {
  src: string;
  alt: string;
  fallback: string;
  imageClassName: string;
  logoBoxClassName?: string;
  children: ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex min-h-20 items-center gap-4 rounded-md border border-institutional-line bg-white p-3 shadow-sm sm:px-4 sm:py-3">
      <div className={`flex flex-none items-center justify-center overflow-hidden rounded-md bg-white ${logoBoxClassName}`}>
        {!failed ? (
          <img src={src} alt={alt} onError={() => setFailed(true)} className={imageClassName} />
        ) : (
          <span className="text-xs font-black uppercase tracking-wide text-institutional-ink">{fallback}</span>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function InstitutionalHeader({
  totalRecords,
  filteredRecords,
  startDate,
  endDate,
}: InstitutionalHeaderProps) {
  return (
    <header className="border-b border-institutional-line bg-white">
      <div className="h-1.5 bg-institutional-orange" aria-hidden="true" />
      <div className="bg-institutional-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white/90 md:px-6">
          <span>Governo do Estado do Ceará</span>
          <span>Secretaria da Segurança Pública e Defesa Social</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
          <LogoBlock
            src={pmceLogo}
            alt="Brasão da Polícia Militar do Ceará"
            fallback="PMCE"
            logoBoxClassName="h-16 w-16"
            imageClassName="h-16 w-16 object-contain"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-institutional-green">
              Polícia Militar do Ceará
            </p>
            <p className="mt-1 text-sm font-semibold leading-5 text-institutional-graphite">
              Secretaria da Segurança Pública e Defesa Social
            </p>
          </LogoBlock>
          <LogoBlock
            src={cpraioLogo}
            alt="Logo do CPRAIO"
            fallback="CPRAIO"
            logoBoxClassName="h-16 w-16"
            imageClassName="h-14 w-14 rounded-full object-cover"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-institutional-green">
              CPRAIO
            </p>
            <p className="mt-1 text-sm font-semibold leading-5 text-institutional-graphite">
              Rondas de Ações Intensivas e Ostensivas
            </p>
          </LogoBlock>
          <div className="flex flex-wrap gap-2 md:col-span-2 lg:col-span-1 lg:justify-end">
            <span className="inline-flex items-center gap-2 rounded-md border border-institutional-line bg-institutional-surface px-3 py-2 text-xs font-bold uppercase text-institutional-graphite">
              <ShieldCheck className="h-4 w-4 text-institutional-green" aria-hidden="true" />
              RAIO Seguro
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-institutional-orange px-3 py-2 text-xs font-bold uppercase text-white">
              <Target className="h-4 w-4" aria-hidden="true" />
              Prevenção
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-institutional-green via-institutional-navy to-institutional-aqua text-white">
        <div className="relative overflow-hidden">
          <img
            src={heroPanel}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 hidden h-full w-auto opacity-10 mix-blend-soft-light lg:block"
          />
          <div className="mx-auto max-w-7xl px-4 py-7 md:px-6 lg:py-10">
            <div className="max-w-5xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/85">
              Comando de Policiamento de Rondas de Ações Intensivas e Ostensivas
            </p>
            <h1 className="max-w-4xl text-2xl font-bold leading-tight sm:text-3xl md:text-5xl">
              Dashboard Institucional de Sinistros de Trânsito
            </h1>
            <p className="mt-3 text-base font-semibold text-white sm:text-lg">Programa RAIO SEGURO - CPRaio</p>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/85 md:text-base">
              Painel de monitoramento estratégico e operacional para prevenção, análise e suporte à
              decisão.
            </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 md:mt-8 md:grid-cols-3">
              <div className="rounded-md border border-white/20 bg-white p-4 text-institutional-ink shadow-official">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-institutional-surface">
                  <Database className="h-5 w-5 text-institutional-green" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold uppercase text-institutional-steel">
                  Registros processados
                </p>
                <strong className="mt-1 block text-3xl font-bold">{formatNumber(totalRecords)}</strong>
              </div>
              <div className="rounded-md border border-white/20 bg-white p-4 text-institutional-ink shadow-official">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-institutional-surface">
                  <ShieldCheck className="h-5 w-5 text-institutional-green" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold uppercase text-institutional-steel">
                  Registros no recorte
                </p>
                <strong className="mt-1 block text-3xl font-bold">{formatNumber(filteredRecords)}</strong>
              </div>
              <div className="rounded-md border border-white/20 bg-white p-4 text-institutional-ink shadow-official">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-institutional-surface">
                  <CalendarDays className="h-5 w-5 text-institutional-green" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold uppercase text-institutional-steel">
                  Período coberto
                </p>
                <strong className="mt-1 block text-base leading-7">{formatPeriod(startDate, endDate)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-2 bg-institutional-orange" aria-hidden="true" />
    </header>
  );
}
