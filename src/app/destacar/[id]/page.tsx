import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile, getListingById } from "@/lib/queries";
import { BOOST_PRICE_XAF, BOOST_DAYS } from "@/lib/pricing";
import { PaymentInstructions } from "@/components/payments/PaymentInstructions";
import { PaymentReferenceForm } from "@/components/payments/PaymentReferenceForm";

export default async function BoostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");

  const listing = await getListingById(id);
  if (!listing || listing.seller_id !== profile.id) redirect("/mis-anuncios");

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-4 text-white">
        <Link href="/mis-anuncios" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <h2 className="text-base font-extrabold">Destacar anuncio</h2>
      </header>

      <div className="p-4">
        <div className="mb-3 rounded-2xl border border-[#f4d79a] bg-gradient-to-br from-[#fff7e8] to-[#ffeccf] p-3.5">
          <b className="text-[13.5px] text-[#8a5a10]">⭐ {listing.title}</b>
          <p className="mt-1 text-[11.5px] leading-snug text-[#9a6a20]">
            Aparecerá en la sección <b>Destacados</b> y arriba en los resultados
            durante {BOOST_DAYS} días. Hasta 5× más visitas.
          </p>
        </div>
        <PaymentInstructions amountXaf={BOOST_PRICE_XAF} />
        <PaymentReferenceForm kind="boost" listingId={listing.id} />
      </div>
    </div>
  );
}
