export function ComingSoon({
  title,
  icon,
  note,
}: {
  title: string;
  icon: string;
  note: string;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-brand-navy px-4 py-4 text-white">
        <h2 className="text-base font-extrabold">{title}</h2>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <span className="text-4xl">{icon}</span>
        <p className="text-sm font-bold text-brand-navy">Próximamente</p>
        <p className="text-xs text-brand-muted">{note}</p>
      </div>
    </div>
  );
}
