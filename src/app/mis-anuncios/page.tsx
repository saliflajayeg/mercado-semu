import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyListings, getSessionProfile } from "@/lib/queries";
import { formatXAF } from "@/lib/format";
import { Thumbnail } from "@/components/listings/Thumbnail";
import { MisAnunciosActions } from "./MisAnunciosActions";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  active: { label: "Activo", className: "bg-green-100 text-brand-green-dark" },
  sold: { label: "Vendido", className: "bg-brand-chip text-brand-muted" },
};

export default async function MisAnunciosPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");

  const listings = await getMyListings(profile.id);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-4 text-white">
        <Link href="/perfil" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <h2 className="text-base font-extrabold">Mis anuncios</h2>
      </header>

      {listings.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
          <span className="text-4xl">📦</span>
          <p className="text-sm text-brand-muted">
            Todavía no has publicado ningún anuncio.
          </p>
          <Link
            href="/vender"
            className="w-full rounded-xl bg-brand-green py-3.5 text-sm font-extrabold text-white"
          >
            Publicar mi primer anuncio
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {listings.map((listing) => {
            const badge = STATUS_BADGE[listing.status];
            return (
              <div
                key={listing.id}
                className="flex gap-3 rounded-2xl border border-brand-line bg-white p-3"
              >
                <Link
                  href={`/listing/${listing.id}`}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                >
                  <Thumbnail
                    emoji={listing.emoji}
                    bgColor={listing.bg_color}
                    imageUrl={listing.images?.[0]?.url ?? null}
                    alt={listing.title}
                    emojiClassName="text-3xl"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-extrabold text-brand-navy">
                      {formatXAF(listing.price_xaf)}
                    </span>
                    {badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    )}
                    {listing.is_featured && (
                      <span className="rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white">
                        Destacado
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-xs text-[#43506b]">
                    {listing.title}
                  </div>
                  <MisAnunciosActions id={listing.id} status={listing.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
