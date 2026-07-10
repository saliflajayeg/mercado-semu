import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getSessionProfile,
  getFavoriteListings,
} from "@/lib/queries";
import { ListingCard } from "@/components/listings/ListingCard";

export default async function FavoritosPage() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");

  const listings = await getFavoriteListings(profile.id);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-4 text-white">
        <Link href="/perfil" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <h2 className="text-base font-extrabold">Favoritos</h2>
      </header>

      {listings.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
          <span className="text-4xl">🤍</span>
          <p className="text-sm text-brand-muted">
            Todavía no has guardado ningún anuncio. Toca el corazón en cualquier
            anuncio para guardarlo aquí.
          </p>
          <Link
            href="/"
            className="w-full rounded-xl bg-brand-green py-3.5 text-sm font-extrabold text-white"
          >
            Explorar anuncios
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              favorited
              isLoggedIn
            />
          ))}
        </div>
      )}
    </div>
  );
}
