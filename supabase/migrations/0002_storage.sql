-- ============================================================================
-- Mercado Semu — Milestone 5: storage bucket for listing photos
-- Run in the Supabase Dashboard → SQL Editor. Safe to run once.
-- ============================================================================

-- Public bucket so listing photos are viewable by anyone via their URL.
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Anyone can read listing photos (public marketplace).
create policy "listing images: public read"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- A logged-in user may upload/replace/delete files only inside their own
-- folder, where the first path segment is their auth user id.
create policy "listing images: insert own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "listing images: update own"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "listing images: delete own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
