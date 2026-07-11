import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-24 text-center">
      <span className="text-5xl">🧭</span>
      <div>
        <h1 className="text-lg font-extrabold text-brand-navy">
          Página no encontrada
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          El anuncio o la página que buscas ya no está disponible.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-xl bg-brand-green px-6 py-3 text-sm font-extrabold text-white"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
