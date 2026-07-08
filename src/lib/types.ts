export type Plan = "basico" | "pro" | "premium";
export type ListingStatus = "active" | "sold" | "removed";
export type PaymentType = "subscription" | "boost";
export type PaymentMethod = "mobile_money" | "cash" | "transfer";
export type PaymentStatus = "pending" | "confirmed" | "rejected";

export interface Profile {
  id: string;
  auth_user_id: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  zone: string | null;
  city: string;
  is_verified: boolean;
  is_admin: boolean;
  plan: Plan;
  plan_expires_at: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  slug: string;
  name_es: string;
  icon: string;
  sort: number;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price_xaf: number;
  category_id: number | null;
  zone: string | null;
  city: string;
  status: ListingStatus;
  is_featured: boolean;
  featured_until: string | null;
  emoji: string | null;
  bg_color: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  sort: number;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  type: PaymentType;
  ref_listing_id: string | null;
  plan: Plan | null;
  amount_xaf: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  created_at: string;
  confirmed_by: string | null;
  confirmed_at: string | null;
}
