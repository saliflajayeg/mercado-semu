import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Listing,
  ListingImage,
  ListingStatus,
  Profile,
} from "@/lib/types";

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

/** Set of listing ids the given profile has favorited (for showing heart state). */
export async function getFavoriteIds(profileId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", profileId);
  return new Set((data ?? []).map((r) => r.listing_id as string));
}

export async function getFavoriteListings(
  profileId: string,
): Promise<ListingCard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select(`listing:listings!listing_id(${CARD_SELECT})`)
    .eq("user_id", profileId)
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as unknown as { listing: ListingCard | null }[];
  return rows
    .map((row) => row.listing)
    .filter((l): l is ListingCard => l !== null)
    .filter((l) => l.status === "active");
}

export async function searchListings(term: string): Promise<ListingCard[]> {
  const q = term.trim();
  if (!q) return [];
  const supabase = await createClient();
  const escaped = q.replace(/[%_,]/g, " ");
  const { data } = await supabase
    .from("listings")
    .select(CARD_SELECT)
    .eq("status", "active")
    .or(`title.ilike.%${escaped}%,description.ilike.%${escaped}%`)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);
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

type ConvParty = { id: string; full_name: string | null };
type ConvListing = {
  id: string;
  title: string;
  emoji: string | null;
  bg_color: string | null;
  status: ListingStatus;
  images: { url: string; sort: number }[];
};
type ConvMessage = {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
  read_at: string | null;
};

export type ConversationRow = {
  id: string;
  created_at: string;
  buyer_id: string;
  seller_id: string;
  listing: ConvListing | null;
  buyer: ConvParty | null;
  seller: ConvParty | null;
  messages: ConvMessage[];
};

const CONVERSATION_SELECT =
  "id, created_at, buyer_id, seller_id, listing:listings!listing_id(id, title, emoji, bg_color, status, images:listing_images(url, sort)), buyer:profiles!buyer_id(id, full_name), seller:profiles!seller_id(id, full_name), messages(id, body, created_at, sender_id, read_at)";

export async function getConversations(
  profileId: string,
): Promise<ConversationRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .or(`buyer_id.eq.${profileId},seller_id.eq.${profileId}`);
  const rows = (data ?? []) as unknown as ConversationRow[];
  // Sort by most recent activity (last message, else conversation creation).
  return rows.sort((a, b) => lastActivity(b) - lastActivity(a));
}

export async function getConversation(
  id: string,
): Promise<ConversationRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .eq("id", id)
    .maybeSingle();
  return (data as unknown as ConversationRow | null) ?? null;
}

function lastActivity(c: ConversationRow): number {
  const times = c.messages.map((m) => new Date(m.created_at).getTime());
  return times.length ? Math.max(...times) : new Date(c.created_at).getTime();
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
