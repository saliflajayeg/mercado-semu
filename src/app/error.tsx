"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-24 text-center">
      <span className="text-5xl">😕</span>
      <div>
        <h1 className="text-lg font-extrabold text-brand-navy">
          Algo salió mal
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          No pudimos cargar esta página. Revisa tu conexión e inténtalo de
          nuevo.
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-xl bg-brand-green px-6 py-3 text-sm font-extrabold text-white"
      >
        Reintentar
      </button>
    </div>
  );
}
