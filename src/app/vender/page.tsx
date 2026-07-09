import Link from "next/link";
import { redirect } from "next/navigation";
import { getCategories, getSessionProfile, getListingStats } from "@/lib/queries";
import { VenderForm } from "./VenderForm";

export default async function VenderPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");

  const [categories, stats] = await Promise.all([
    getCategories(),
    getListingStats(profile.id),
  ]);

  const atFreeLimit = profile.plan === "basico" && stats.active >= 5;

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-4 text-white">
        <Link href="/" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <h2 className="text-base font-extrabold">Publicar anuncio</h2>
      </header>

      {atFreeLimit ? (
        <div className="px-4 py-8 text-center">
          <span className="text-4xl">🚦</span>
          <p className="mt-3 text-sm font-bold text-brand-navy">
            Llegaste al límite del plan Básico
          </p>
          <p className="mt-1 text-xs text-brand-muted">
            Tienes 5 anuncios activos. Marca alguno como vendido, elimínalo, o
            hazte PRO para publicar sin límite.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/planes"
              className="rounded-xl bg-brand-green py-3 text-sm font-extrabold text-white"
            >
              Hazte vendedor PRO ⚡
            </Link>
            <Link
              href="/mis-anuncios"
              className="rounded-xl border border-brand-line bg-white py-3 text-sm font-bold text-brand-navy"
            >
              Ver mis anuncios
            </Link>
          </div>
        </div>
      ) : (
        <VenderForm categories={categories} />
      )}
    </div>
  );
}
