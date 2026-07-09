import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getCategories,
  getListingById,
  getSessionProfile,
} from "@/lib/queries";
import { VenderForm } from "../VenderForm";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getSessionProfile();
  if (!profile) redirect("/entrar");

  const listing = await getListingById(id);
  if (!listing) notFound();
  if (listing.seller_id !== profile.id) redirect("/mis-anuncios");

  const categories = await getCategories();
  const images = [...listing.images]
    .sort((a, b) => a.sort - b.sort)
    .map((im) => im.url);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 bg-brand-navy px-4 py-4 text-white">
        <Link href="/mis-anuncios" aria-label="Volver" className="text-xl">
          ←
        </Link>
        <h2 className="text-base font-extrabold">Editar anuncio</h2>
      </header>
      <VenderForm
        categories={categories}
        initial={{
          id: listing.id,
          title: listing.title,
          categoryId: listing.category_id,
          priceXaf: listing.price_xaf,
          description: listing.description,
          zone: listing.zone ?? "",
          images,
        }}
      />
    </div>
  );
}
