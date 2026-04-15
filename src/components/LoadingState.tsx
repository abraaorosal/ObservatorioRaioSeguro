export function LoadingState() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-institutional-surface px-6"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-xl rounded-lg border border-institutional-line bg-white p-8 shadow-official">
        <div className="mb-5 h-2 w-40 rounded bg-institutional-gold" />
        <h1 className="text-2xl font-bold text-institutional-ink">Processando base de sinistros</h1>
        <p className="mt-3 text-sm leading-6 text-institutional-steel">
          Leitura, normalização e validação dos registros do arquivo institucional.
        </p>
        <div className="mt-7 space-y-3">
          <div className="h-3 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-10/12 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-8/12 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
