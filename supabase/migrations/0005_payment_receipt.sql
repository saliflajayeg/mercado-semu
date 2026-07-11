-- ============================================================================
-- Mercado Semu — comprobante de pago (receipt screenshot)
-- Run in the Supabase Dashboard → SQL Editor. Safe to run once.
--
-- In Equatorial Guinea sellers prove a MuniDinero transfer with a screenshot of
-- the receipt, so each payment can carry an image the admin reviews before
-- confirming. Images are stored in the existing listing-images bucket under the
-- user's folder ({auth uid}/receipts/...), so no new bucket/policies are needed.
-- ============================================================================

alter table public.payments
  add column if not exists receipt_url text;
