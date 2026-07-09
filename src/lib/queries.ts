import { createClient } from "@/lib/supabase/server";
import type { Category, Listing, ListingImage, Profile } from "@/lib/types";

/** The signed-in user's profile row, or null if not logged in. */
export async function getSessionProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  return (data as Profile | null) ?? null;
}

export async function getListingStats(
  profileId: string,
): Promise<{ active: number; sold: number }> {
  const supabase = await createClient();
  const [{ count: active }, { count: sold }] = await Promise.all([
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", profileId)
      .eq("status", "active"),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", profileId)
      .eq("status", "sold"),
  ]);
  return { active: active ?? 0, sold: sold ?? 0 };
}

export type ListingCard = Listing & {
  seller: Pick<Profile, "id" | "full_name" | "is_verified"> | null;
  category: Pick<Category, "slug" | "name_es" | "icon"> | null;
  images: Pick<ListingImage, "url" | "sort">[];
};

export type ListingDetail = Listing & {
  seller: Pick<
    Profile,
    "id" | "full_name" | "is_verified" | "phone" | "zone" | "city" | "plan" | "created_at"
  > | null;
  category: Pick<Category, "slug" | "name_es" | "icon"> | null;
  images: Pick<ListingImage, "url" | "sort">[];
};

const CARD_SELECT =
  "*, seller:profiles!seller_id(id, full_name, is_verified), category:categories!category_id(slug, name_es, icon), images:listing_images(url, sort)";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort", { ascending: true });
  return data ?? [];
}

export async function getFeaturedListings(): Promise<ListingCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select(CARD_SELECT)
    .eq("status", "active")
    .eq("is_featured", true)
    .gt("featured_until", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(12);
  return (data as ListingCard[] | null) ?? [];
}

export async function getGridListings(categoryId?: number): Promise<ListingCard[]> {
  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select(CARD_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(40);
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data } = await query;
  return (data as ListingCard[] | null) ?? [];
}

export async function getMyListings(profileId: string): Promise<ListingCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select(CARD_SELECT)
    .eq("seller_id", profileId)
    .neq("status", "removed")
    .order("created_at", { ascending: false });
  return (data as ListingCard[] | null) ?? [];
}

export async function getListingById(id: string): Promise<ListingDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select(
      "*, seller:profiles!seller_id(id, full_name, is_verified, phone, zone, city, plan, created_at), category:categories!category_id(slug, name_es, icon), images:listing_images(url, sort)",
    )
    .eq("id", id)
    .maybeSingle();
  return (data as ListingDetail | null) ?? null;
}
