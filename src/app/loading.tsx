export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div
        className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand-line border-t-brand-green"
        role="status"
        aria-label="Cargando"
      />
    </div>
  );
}
