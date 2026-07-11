import { AppBar } from "@/components/layout/AppBar";
import { CategoryChips } from "@/components/listings/CategoryChips";
import { FeaturedCard } from "@/components/listings/FeaturedCard";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  getCategories,
  getFeaturedListings,
  getGridListings,
  getSessionProfile,
  getFavoriteIds,
} from "@/lib/queries";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const categories = await getCategories();
  const activeCategory = cat ? categories.find((c) => c.slug === cat) : undefined;

  const profile = await getSessionProfile();
  const [featured, grid, favoriteIds] = await Promise.all([
    getFeaturedListings(),
    getGridListings(activeCategory?.id),
    profile ? getFavoriteIds(profile.id) : Promise.resolve(new Set<string>()),
  ]);

  return (
    <>
      <AppBar />
      <CategoryChips categories={categories} activeSlug={cat} />

      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1">
            <h2 className="text-[15px] font-extrabold">⭐ Destacados</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-3.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featured.map((listing) => (
              <FeaturedCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-3.5">
        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1">
          <h2 className="text-[15px] font-extrabold">
            {activeCategory ? activeCategory.name_es : "Cerca de ti"}
          </h2>
        </div>

        {grid.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 px-3.5">
            {grid.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                favorited={favoriteIds.has(listing.id)}
                isLoggedIn={Boolean(profile)}
              />
            ))}
          </div>
        ) : (
          <p className="px-3.5 py-10 text-center text-[13px] text-brand-muted">
            Sin resultados en esta categoría.
          </p>
        )}
      </section>
    </>
  );
}
