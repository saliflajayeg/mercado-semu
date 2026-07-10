-- ============================================================================
-- Mercado Semu — Milestone 8: protect sensitive profile columns
-- Run in the Supabase Dashboard → SQL Editor. Safe to run once.
--
-- RLS lets a user edit their own profile row (name, phone, zone...). But that
-- row also holds is_admin, plan, plan_expires_at and is_verified, which must
-- ONLY change via an admin action or the payment-confirmation trigger — never
-- by a user editing their own row. This BEFORE UPDATE trigger freezes those
-- columns for non-admins, so nobody can self-promote to admin or grant
-- themselves a paid plan / verified badge through the API.
-- ============================================================================

create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Freeze protected columns for a logged-in non-admin. When auth.uid() is null
  -- the update comes from a trusted context (SQL editor / service role, both of
  -- which bypass RLS anyway), e.g. bootstrapping the first admin — leave it be.
  if auth.uid() is not null and not public.is_admin() then
    new.is_admin        := old.is_admin;
    new.plan            := old.plan;
    new.plan_expires_at := old.plan_expires_at;
    new.is_verified     := old.is_verified;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile on public.profiles;
create trigger trg_protect_profile
  before update on public.profiles
  for each row execute function public.protect_profile_columns();
