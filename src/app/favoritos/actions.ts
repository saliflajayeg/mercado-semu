"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/queries";

export type ToggleResult =
  | { error: "auth" }
  | { ok: true; favorited: boolean };

export async function toggleFavorite(listingId: string): Promise<ToggleResult> {
  const profile = await getSessionProfile();
  if (!profile) return { error: "auth" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", profile.id)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    revalidatePath("/favoritos");
    return { ok: true, favorited: false };
  }

  await supabase
    .from("favorites")
    .insert({ user_id: profile.id, listing_id: listingId });
  revalidatePath("/favoritos");
  return { ok: true, favorited: true };
}
