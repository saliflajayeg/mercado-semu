"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/queries";

async function requireAdmin() {
  const profile = await getSessionProfile();
  if (!profile?.is_admin) return null;
  return profile;
}

/** Confirming a payment fires the DB trigger that upgrades the plan or
 *  features the listing automatically. */
export async function confirmPayment(paymentId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const supabase = await createClient();
  await supabase
    .from("payments")
    .update({ status: "confirmed", confirmed_by: admin.id })
    .eq("id", paymentId);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function rejectPayment(paymentId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const supabase = await createClient();
  await supabase
    .from("payments")
    .update({ status: "rejected", confirmed_by: admin.id })
    .eq("id", paymentId);
  revalidatePath("/admin");
}

export async function setSellerVerified(
  profileId: string,
  verified: boolean,
): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const supabase = await createClient();
  await supabase
    .from("profiles")
    .update({ is_verified: verified })
    .eq("id", profileId);
  revalidatePath("/admin");
}

export async function removeListing(listingId: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  const supabase = await createClient();
  await supabase
    .from("listings")
    .update({ status: "removed" })
    .eq("id", listingId);
  revalidatePath("/admin");
  revalidatePath("/");
}
