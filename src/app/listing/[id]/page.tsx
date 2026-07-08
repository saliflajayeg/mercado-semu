import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/queries";
import { formatXAF, formatRelativeTime, whatsappLink } from "@/lib/format";
import { Thumbnail } from "@/components/listings/Thumbnail";
import { DetailActionBar } from "@/components/listings/DetailActionBar";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing || listing.status === "removed") notFound();

  const image = listing.images?.[0]?.url ?? null;
  const seller = listing.seller;
  const initial = (seller?.full_name ?? "?").charAt(0).toUpperCase();
  const phone = seller?.phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const memberSince = seller?.created_at
    ? new Date(seller.created_at).getFullYear()
    : null;

  return (
    <>
      <div className="relative h-70">
        <Thumbnail
          emoji={listing.emoji}
          bgColor={listing.bg_color}
          imageUrl={image}
          alt={listing.title}
          emojiClassName="text-[120px]"
        />
        <Link
          href="/"
          aria-label="Volver"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-lg text-white"
        >
          ←
        </Link>
      </div>

      <div className="px-4 pb-40 pt-4">
        <div className="text-[26px] font-black text-brand-navy">
          {formatXAF(listing.price_xaf)}
        </div>
        <h1 className="mt-1 text-base font-semibold text-[#2a3350]">
          {listing.title}
        </h1>

        <div className="mt-2 flex flex-wrap gap-2">
          {listing.category && (
            <span className="rounded-full bg-brand-chip px-2.5 py-1 text-[11px] font-semibold text-[#42506b]">
              {listing.category.icon} {listing.category.name_es}
            </span>
          )}
          {listing.zone && (
            <span className="rounded-full bg-brand-chip px-2.5 py-1 text-[11px] font-semibold text-[#42506b]">
              📍 {listing.zone}
            </span>
          )}
          <span className="rounded-full bg-brand-chip px-2.5 py-1 text-[11px] font-semibold text-[#42506b]">
            🕒 {formatRelativeTime(listing.created_at)}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-brand-line bg-white p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-navy text-[17px] font-extrabold text-white">
            {initial}
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-bold">
              {seller?.full_name ?? "Vendedor"}
            </div>
            <div className="mt-0.5 text-[11px] text-brand-muted">
              {seller?.is_verified ? (
                <span className="font-extrabold text-brand-green-dark">
                  ✔ Vendedor verificado
                </span>
              ) : (
                "Vendedor"
              )}
              {memberSince ? ` · Desde ${memberSince}` : ""}
            </div>
          </div>
        </div>

        <h2 className="mb-1.5 mt-4 text-xs font-extrabold uppercase tracking-wide text-brand-navy">
          Descripción
        </h2>
        <p className="text-[13.5px] leading-relaxed text-[#39425c]">
          {listing.description || "Sin descripción."}
        </p>

        <h2 className="mb-1.5 mt-4 text-xs font-extrabold uppercase tracking-wide text-brand-navy">
          Ubicación
        </h2>
        <p className="text-[13.5px] leading-relaxed text-[#39425c]">
          {[listing.zone, listing.city].filter(Boolean).join(" · ") || listing.city}
        </p>
      </div>

      <DetailActionBar whatsappUrl={whatsappLink(phone, listing.title)} />
    </>
  );
}
