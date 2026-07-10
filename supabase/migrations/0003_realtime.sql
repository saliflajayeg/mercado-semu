-- ============================================================================
-- Mercado Semu — Milestone 7: enable Realtime for chat messages
-- Run in the Supabase Dashboard → SQL Editor. Safe to run once.
-- ============================================================================

-- Let Supabase broadcast INSERTs on messages so both chat participants see new
-- messages live. Row Level Security still applies: users only receive messages
-- from conversations they belong to.
alter publication supabase_realtime add table public.messages;
