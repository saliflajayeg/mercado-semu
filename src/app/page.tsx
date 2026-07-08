import { AppBar } from "@/components/layout/AppBar";

export default function HomePage() {
  return (
    <>
      <AppBar />
      <div className="px-4 py-8 text-center">
        <p className="text-sm font-semibold text-brand-navy">
          Vende, Compra, <span className="text-brand-red">Conecta</span>.
        </p>
        <p className="mt-1 text-xs text-brand-muted">Todo en un solo lugar.</p>

        <div className="mt-8 rounded-2xl border border-brand-line bg-white p-5 text-left shadow-sm">
          <p className="text-sm font-bold text-brand-navy">
            ✅ Milestone 1: proyecto en marcha
          </p>
          <p className="mt-2 text-xs leading-relaxed text-brand-muted">
            Next.js, Tailwind con los colores de marca, la barra inferior y la
            conexión con Supabase ya están listos. El feed de anuncios llega
            en el Milestone 3.
          </p>
        </div>
      </div>
    </>
  );
}
