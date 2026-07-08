import Link from "next/link";
import type { ListingCard as ListingCardData } from "@/lib/queries";
import { formatXAF } from "@/lib/format";
import { Thumbnail } from "./Thumbnail";

export function FeaturedCard({ listing }: { listing: ListingCardData }) {
  const image = listing.images?.[0]?.url ?? null;

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="w-[170px] shrink-0 overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_6px_18px_rgba(20,30,60,0.08)]"
    >
      <div className="relative h-[110px]">
        <Thumbnail
          emoji={listing.emoji}
          bgColor={listing.bg_color}
          imageUrl={image}
          alt={listing.title}
        />
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-brand-red px-2 py-[3px] text-[9.5px] font-extrabold tracking-wide text-white">
          ⭐ DESTACADO
        </span>
      </div>
      <div className="px-2.5 pb-3 pt-2">
        <div className="text-[15px] font-extrabold text-brand-navy">
          {formatXAF(listing.price_xaf)}
        </div>
        <div className="mt-0.5 line-clamp-2 h-[31px] text-[12.5px] leading-tight text-[#43506b]">
          {listing.title}
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[10.5px] text-brand-muted">
          {listing.seller?.is_verified ? "✔" : "•"}{" "}
          {listing.seller?.full_name ?? "Vendedor"}
        </div>
      </div>
    </Link>
  );
}
