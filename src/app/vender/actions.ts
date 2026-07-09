"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/queries";

export type ListingInput = {
  id?: string;
  title: string;
  categoryId: number | null;
  priceXaf: number;
  description: string;
  zone: string;
  imageUrls: string[];
};

export type ListingResult = { error: string } | { ok: true; id: string };

const FREE_LIMIT_MESSAGE =
  "Con el plan Básico puedes tener hasta 5 anuncios activos. Hazte PRO para publicar más.";

function isFreeLimitError(message: string): boolean {
  return (
    message.includes("FREE_LIMIT_REACHED") ||
    message.toLowerCase().includes("plan básico")
  );
}

function validate(input: ListingInput): string | null {
  if (!input.title.trim()) return "Escribe qué vendes.";
  if (!input.categoryId) return "Elige una categoría.";
  if (!Number.isFinite(input.priceXaf) || input.priceXaf < 0)
    return "Escribe un precio válido.";
  if (input.imageUrls.length === 0) return "Añade al menos una foto.";
  return null;
}

export async function createListing(
  input: ListingInput,
): Promise<ListingResult> {
  const profile = await getSessionProfile();
  if (!profile) return { error: "Inicia sesión para publicar." };

  const problem = validate(input);
  if (problem) return { error: problem };

  const supabase = await createClient();
  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      seller_id: profile.id,
      title: input.title.trim(),
      description: input.description.trim(),
      price_xaf: input.priceXaf,
      category_id: input.categoryId,
      zone: input.zone.trim() || null,
      city: profile.city,
    })
    .select("id")
    .single();

  if (error || !listing) {
    if (error && isFreeLimitError(error.message)) return { error: FREE_LIMIT_MESSAGE };
    return { error: "No se pudo publicar el anuncio. Inténtalo de nuevo." };
  }

  const rows = input.imageUrls.map((url, sort) => ({
    listing_id: listing.id,
    url,
    sort,
  }));
  await supabase.from("listing_images").insert(rows);

  revalidatePath("/");
  return { ok: true, id: listing.id };
}

export async function updateListing(
  input: ListingInput,
): Promise<ListingResult> {
  const profile = await getSessionProfile();
  if (!profile) return { error: "Inicia sesión para editar." };
  if (!input.id) return { error: "Falta el anuncio a editar." };

  const problem = validate(input);
  if (problem) return { error: problem };

  const supabase = await createClient();

  // Confirm ownership before writing.
  const { data: owned } = await supabase
    .from("listings")
    .select("id")
    .eq("id", input.id)
    .eq("seller_id", profile.id)
    .maybeSingle();
  if (!owned) return { error: "No puedes editar este anuncio." };

  const { error } = await supabase
    .from("listings")
    .update({
      title: input.title.trim(),
      description: input.description.trim(),
      price_xaf: input.priceXaf,
      category_id: input.categoryId,
      zone: input.zone.trim() || null,
    })
    .eq("id", input.id);
  if (error) return { error: "No se pudieron guardar los cambios." };

  // Reconcile images: drop rows no longer present, add the new ones.
  const { data: current } = await supabase
    .from("listing_images")
    .select("url")
    .eq("listing_id", input.id);
  const currentUrls = (current ?? []).map((r) => r.url);
  const toDelete = currentUrls.filter((u) => !input.imageUrls.includes(u));
  const toAdd = input.imageUrls.filter((u) => !currentUrls.includes(u));

  if (toDelete.length) {
    await supabase
      .from("listing_images")
      .delete()
      .eq("listing_id", input.id)
      .in("url", toDelete);
  }
  if (toAdd.length) {
    const startSort = input.imageUrls.length - toAdd.length;
    await supabase.from("listing_images").insert(
      toAdd.map((url, i) => ({ listing_id: input.id, url, sort: startSort + i })),
    );
  }

  revalidatePath("/");
  revalidatePath(`/listing/${input.id}`);
  return { ok: true, id: input.id };
}

export async function setListingStatus(
  id: string,
  status: "active" | "sold" | "removed",
): Promise<void> {
  const profile = await getSessionProfile();
  if (!profile) return;
  const supabase = await createClient();
  await supabase
    .from("listings")
    .update({ status })
    .eq("id", id)
    .eq("seller_id", profile.id);
  revalidatePath("/");
  revalidatePath("/mis-anuncios");
}

export async function deleteListing(id: string): Promise<void> {
  const profile = await getSessionProfile();
  if (!profile) return;
  const supabase = await createClient();
  await supabase.from("listings").delete().eq("id", id).eq("seller_id", profile.id);
  revalidatePath("/");
  revalidatePath("/mis-anuncios");
}
