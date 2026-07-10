"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/queries";
import { getPlan, BOOST_PRICE_XAF, type PlanId } from "@/lib/pricing";

export type PaymentResult = { error: string } | { ok: true };

export async function submitSubscriptionPayment(
  plan: PlanId,
  reference: string,
): Promise<PaymentResult> {
  const profile = await getSessionProfile();
  if (!profile) return { error: "Inicia sesión para continuar." };

  const info = getPlan(plan);
  if (!info || info.priceXaf <= 0) return { error: "Plan no válido." };
  if (!reference.trim())
    return { error: "Escribe la referencia del pago de MuniDinero." };

  const supabase = await createClient();
  const { error } = await supabase.from("payments").insert({
    user_id: profile.id,
    type: "subscription",
    plan,
    amount_xaf: info.priceXaf,
    method: "mobile_money",
    reference: reference.trim(),
  });
  if (error) return { error: "No se pudo registrar el pago. Inténtalo de nuevo." };

  revalidatePath("/mis-pagos");
  return { ok: true };
}

export async function submitBoostPayment(
  listingId: string,
  reference: string,
): Promise<PaymentResult> {
  const profile = await getSessionProfile();
  if (!profile) return { error: "Inicia sesión para continuar." };
  if (!reference.trim())
    return { error: "Escribe la referencia del pago de MuniDinero." };

  const supabase = await createClient();
  // Only the owner can boost their own listing.
  const { data: listing } = await supabase
    .from("listings")
    .select("id")
    .eq("id", listingId)
    .eq("seller_id", profile.id)
    .maybeSingle();
  if (!listing) return { error: "No puedes destacar este anuncio." };

  const { error } = await supabase.from("payments").insert({
    user_id: profile.id,
    type: "boost",
    ref_listing_id: listingId,
    amount_xaf: BOOST_PRICE_XAF,
    method: "mobile_money",
    reference: reference.trim(),
  });
  if (error) return { error: "No se pudo registrar el pago. Inténtalo de nuevo." };

  revalidatePath("/mis-pagos");
  return { ok: true };
}
