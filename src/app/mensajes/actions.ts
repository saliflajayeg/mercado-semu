"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/queries";

export type StartResult =
  | { error: "auth" | "own" | "fail" }
  | { id: string };

/** Opens (or creates) the buyer↔seller conversation for a listing. */
export async function startConversation(listingId: string): Promise<StartResult> {
  const profile = await getSessionProfile();
  if (!profile) return { error: "auth" };

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("seller_id")
    .eq("id", listingId)
    .maybeSingle();
  if (!listing) return { error: "fail" };
  if (listing.seller_id === profile.id) return { error: "own" };

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", profile.id)
    .maybeSingle();
  if (existing) return { id: existing.id };

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      listing_id: listingId,
      buyer_id: profile.id,
      seller_id: listing.seller_id,
    })
    .select("id")
    .single();
  if (error || !created) return { error: "fail" };
  return { id: created.id };
}
