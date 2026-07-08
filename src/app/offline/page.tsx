export default function OfflinePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
      <span className="text-4xl">📡</span>
      <p className="text-sm font-bold text-brand-navy">Sin conexión</p>
      <p className="text-xs text-brand-muted">
        No se pudo cargar esta página. Revisa tu conexión a internet e
        inténtalo de nuevo.
      </p>
    </div>
  );
}
