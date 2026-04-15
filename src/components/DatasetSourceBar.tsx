import { UploadCloud } from 'lucide-react';
import { useRef } from 'react';

interface DatasetSourceBarProps {
  source: 'public' | 'file';
  label: string;
  rawCount: number;
  onLoadFile: (file: File) => void;
  onReset: () => void;
}

export function DatasetSourceBar({ source, label, rawCount, onLoadFile, onReset }: DatasetSourceBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="rounded-lg border border-institutional-line bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-institutional-steel">Base de dados</p>
          <h2 className="mt-1 text-lg font-bold text-institutional-ink">{label}</h2>
          <p className="mt-1 text-sm leading-6 text-institutional-steel">
            {rawCount ? `${rawCount} registro(s) carregado(s).` : 'Nenhum registro carregado.'}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              onLoadFile(file);
              // Allows selecting the same file again.
              event.target.value = '';
            }}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-institutional-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-institutional-graphite"
          >
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            Carregar JSON
          </button>

          {source === 'file' ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-institutional-line bg-institutional-surface px-4 py-2 text-sm font-bold text-institutional-graphite transition hover:border-institutional-gold hover:bg-white"
            >
              Voltar para demo
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

