import Link from "next/link";
import type { ListingCard as ListingCardData } from "@/lib/queries";
import { formatXAF } from "@/lib/format";
import { Thumbnail } from "./Thumbnail";
import { FavoriteButton } from "./FavoriteButton";

export function ListingCard({
  listing,
  favorited = false,
  isLoggedIn = false,
}: {
  listing: ListingCardData;
  favorited?: boolean;
  isLoggedIn?: boolean;
}) {
  const image = listing.images?.[0]?.url ?? null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-white">
      <Link href={`/listing/${listing.id}`} className="block">
        <div className="relative h-30">
          <Thumbnail
            emoji={listing.emoji}
            bgColor={listing.bg_color}
            imageUrl={image}
            alt={listing.title}
          />
          {listing.is_featured && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-brand-red px-2 py-[3px] text-[9.5px] font-extrabold tracking-wide text-white">
              ⭐ DESTACADO
            </span>
          )}
        </div>
        <div className="px-2.5 pb-3 pt-2">
          <div className="text-[15px] font-extrabold text-brand-navy">
            {formatXAF(listing.price_xaf)}
          </div>
          <div className="mt-0.5 line-clamp-2 h-[30px] text-xs leading-tight text-[#43506b]">
            {listing.title}
          </div>
          <div className="mt-1.5 text-[10px] text-brand-muted">
            📍 {listing.zone ?? listing.city}
          </div>
        </div>
      </Link>
      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton
          listingId={listing.id}
          initialFavorited={favorited}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}
