import Link from "next/link";
import {
  searchListings,
  getCategories,
  getSessionProfile,
  getFavoriteIds,
} from "@/lib/queries";
import { ListingCard } from "@/components/listings/ListingCard";
import { SearchBar } from "./SearchBar";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = (q ?? "").trim();

  const profile = await getSessionProfile();
  const [results, categories, favoriteIds] = await Promise.all([
    term ? searchListings(term) : Promise.resolve([]),
    term ? Promise.resolve([]) : getCategories(),
    profile ? getFavoriteIds(profile.id) : Promise.resolve(new Set<string>()),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="bg-brand-navy px-4 py-3">
        <SearchBar initial={term} />
      </header>

      {!term ? (
        <div className="p-4">
          <h2 className="mb-3 text-sm font-bold text-brand-navy">
            Explora por categoría
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/?cat=${c.slug}`}
                className="flex items-center gap-2 rounded-xl border border-brand-line bg-white px-3 py-3 text-sm font-semibold text-brand-navy"
              >
                <span className="text-lg">{c.icon}</span>
                {c.name_es}
              </Link>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center">
          <span className="text-4xl">🔎</span>
          <p className="text-sm text-brand-muted">
            No encontramos anuncios para <b>“{term}”</b>. Prueba con otra
            palabra.
          </p>
        </div>
      ) : (
        <>
          <p className="px-4 pt-3 text-xs text-brand-muted">
            {results.length}{" "}
            {results.length === 1 ? "resultado" : "resultados"} para “{term}”
          </p>
          <div className="grid grid-cols-2 gap-3 p-4">
            {results.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                favorited={favoriteIds.has(listing.id)}
                isLoggedIn={Boolean(profile)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
