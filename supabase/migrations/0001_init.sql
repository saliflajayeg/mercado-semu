-- ============================================================================
-- Mercado Semu — Milestone 2: schema, enums, RLS, triggers
-- Run this in the Supabase Dashboard → SQL Editor. Safe to run once.
-- ============================================================================

-- ---------- Enums -----------------------------------------------------------
create type public.plan            as enum ('basico', 'pro', 'premium');
create type public.listing_status  as enum ('active', 'sold', 'removed');
create type public.payment_type    as enum ('subscription', 'boost');
create type public.payment_method  as enum ('mobile_money', 'cash', 'transfer');
create type public.payment_status  as enum ('pending', 'confirmed', 'rejected');

-- ---------- Tables ----------------------------------------------------------

-- Profiles: a user's public identity. `auth_user_id` links to the login
-- account (null for the demo/seed sellers, set automatically for real users).
create table public.profiles (
  id              uuid primary key default gen_random_uuid(),
  auth_user_id    uuid unique references auth.users(id) on delete cascade,
  full_name       text,
  phone           text,
  avatar_url      text,
  zone            text,
  city            text not null default 'Malabo',
  is_verified     boolean not null default false,
  is_admin        boolean not null default false,
  plan            public.plan not null default 'basico',
  plan_expires_at timestamptz,
  created_at      timestamptz not null default now()
);

create table public.categories (
  id      bigint generated always as identity primary key,
  slug    text unique not null,
  name_es text not null,
  icon    text not null,
  sort    int  not null default 0
);

create table public.listings (
  id            uuid primary key default gen_random_uuid(),
  seller_id     uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  description   text not null default '',
  price_xaf     bigint not null check (price_xaf >= 0),
  category_id   bigint references public.categories(id),
  zone          text,
  city          text not null default 'Malabo',
  status        public.listing_status not null default 'active',
  is_featured   boolean not null default false,
  featured_until timestamptz,
  emoji         text,   -- fallback thumbnail (prototype style) when no photo
  bg_color      text,   -- fallback thumbnail background
  views         int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index listings_status_created_idx on public.listings (status, created_at desc);
create index listings_category_idx       on public.listings (category_id);
create index listings_seller_idx         on public.listings (seller_id);
create index listings_featured_idx       on public.listings (is_featured, featured_until);

create table public.listing_images (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url        text not null,
  sort       int  not null default 0
);
create index listing_images_listing_idx on public.listing_images (listing_id, sort);

create table public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

create table public.conversations (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id   uuid not null references public.profiles(id) on delete cascade,
  seller_id  uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (listing_id, buyer_id)
);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  body            text not null,
  created_at      timestamptz not null default now(),
  read_at         timestamptz
);
create index messages_conversation_idx on public.messages (conversation_id, created_at);

create table public.payments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  type          public.payment_type not null,
  ref_listing_id uuid references public.listings(id) on delete set null,
  plan          public.plan,
  amount_xaf    bigint not null check (amount_xaf >= 0),
  method        public.payment_method not null,
  status        public.payment_status not null default 'pending',
  reference     text not null default '',
  created_at    timestamptz not null default now(),
  confirmed_by  uuid references public.profiles(id),
  confirmed_at  timestamptz
);
create index payments_status_idx on public.payments (status, created_at desc);

-- ---------- Helper functions (SECURITY DEFINER: bypass RLS, no recursion) ---
create or replace function public.my_profile_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select id from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where auth_user_id = auth.uid() and is_admin
  );
$$;

-- ---------- Trigger: create a profile row on signup -------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (auth_user_id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Trigger: keep listings.updated_at fresh -------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger trg_listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- ---------- Trigger: enforce the 5-listing free-plan limit in the DB --------
create or replace function public.enforce_free_listing_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  seller_plan  public.plan;
  active_count int;
begin
  if new.status = 'active' then
    select plan into seller_plan from public.profiles where id = new.seller_id;
    if seller_plan = 'basico' then
      select count(*) into active_count
        from public.listings
        where seller_id = new.seller_id
          and status = 'active'
          and id <> new.id;
      if active_count >= 5 then
        raise exception 'FREE_LIMIT_REACHED'
          using message = 'Los vendedores del plan Básico pueden tener hasta 5 anuncios activos. Hazte PRO para publicar más.';
      end if;
    end if;
  end if;
  return new;
end;
$$;
create trigger trg_free_listing_limit
  before insert or update on public.listings
  for each row execute function public.enforce_free_listing_limit();

-- ---------- Trigger: apply a payment when an admin confirms it --------------
create or replace function public.apply_payment_confirmation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'confirmed' and old.status is distinct from 'confirmed' then
    if new.type = 'subscription' then
      update public.profiles
        set plan = coalesce(new.plan, plan),
            plan_expires_at = now() + interval '30 days',
            is_verified = case when new.plan in ('pro', 'premium') then true else is_verified end
        where id = new.user_id;
    elsif new.type = 'boost' and new.ref_listing_id is not null then
      update public.listings
        set is_featured = true,
            featured_until = now() + interval '7 days'
        where id = new.ref_listing_id;
    end if;
    new.confirmed_at = now();
  end if;
  return new;
end;
$$;
create trigger trg_apply_payment
  before update on public.payments
  for each row execute function public.apply_payment_confirmation();

-- ---------- Row Level Security ----------------------------------------------
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.listings       enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites      enable row level security;
alter table public.conversations  enable row level security;
alter table public.messages       enable row level security;
alter table public.payments       enable row level security;

-- profiles: public read; edit only your own (admins can edit anyone)
create policy profiles_select_all on public.profiles
  for select using (true);
create policy profiles_insert_self on public.profiles
  for insert with check (auth_user_id = auth.uid());
create policy profiles_update_self on public.profiles
  for update using (auth_user_id = auth.uid() or public.is_admin())
  with check (auth_user_id = auth.uid() or public.is_admin());

-- categories: public read; no client writes (managed via SQL / service role)
create policy categories_select_all on public.categories
  for select using (true);

-- listings: read active ones (or your own, or as admin); write only your own
create policy listings_select on public.listings
  for select using (
    status = 'active' or seller_id = public.my_profile_id() or public.is_admin()
  );
create policy listings_insert_own on public.listings
  for insert with check (seller_id = public.my_profile_id());
create policy listings_update_own on public.listings
  for update using (seller_id = public.my_profile_id() or public.is_admin())
  with check (seller_id = public.my_profile_id() or public.is_admin());
create policy listings_delete_own on public.listings
  for delete using (seller_id = public.my_profile_id() or public.is_admin());

-- listing_images: readable when the listing is; writable by the listing owner
create policy listing_images_select on public.listing_images
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'active' or l.seller_id = public.my_profile_id() or public.is_admin())
    )
  );
create policy listing_images_write on public.listing_images
  for all using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.seller_id = public.my_profile_id() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.seller_id = public.my_profile_id() or public.is_admin())
    )
  );

-- favorites: fully private to the owner
create policy favorites_select_own on public.favorites
  for select using (user_id = public.my_profile_id());
create policy favorites_insert_own on public.favorites
  for insert with check (user_id = public.my_profile_id());
create policy favorites_delete_own on public.favorites
  for delete using (user_id = public.my_profile_id());

-- conversations: only the buyer or seller (or admin) can see/start them
create policy conversations_select on public.conversations
  for select using (
    buyer_id = public.my_profile_id() or seller_id = public.my_profile_id() or public.is_admin()
  );
create policy conversations_insert on public.conversations
  for insert with check (buyer_id = public.my_profile_id());

-- messages: only participants can read; only the sender can send
create policy messages_select on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.buyer_id = public.my_profile_id() or c.seller_id = public.my_profile_id())
    )
  );
create policy messages_insert on public.messages
  for insert with check (
    sender_id = public.my_profile_id()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.buyer_id = public.my_profile_id() or c.seller_id = public.my_profile_id())
    )
  );
create policy messages_update_participant on public.messages
  for update using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.buyer_id = public.my_profile_id() or c.seller_id = public.my_profile_id())
    )
  );

-- payments: see your own (or all, as admin); create your own pending request;
-- only admins can change status (confirm/reject)
create policy payments_select on public.payments
  for select using (user_id = public.my_profile_id() or public.is_admin());
create policy payments_insert_own on public.payments
  for insert with check (user_id = public.my_profile_id() and status = 'pending');
create policy payments_update_admin on public.payments
  for update using (public.is_admin()) with check (public.is_admin());
