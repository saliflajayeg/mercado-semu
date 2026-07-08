# Mercado Semu — Marketplace MVP · Build Specification

**For:** Claude Code (or any developer)
**Prepared:** July 2026
**Deliverable:** A mobile-first web marketplace ("Facebook Marketplace–style") for Guinea Ecuatorial, named **Mercado Semu**.

> There is a working clickable HTML prototype in this same folder: **`Mercado_Semu_prototipo.html`**. Open it first — it shows the exact screens, flows, and visual style the finished app should match. This spec describes how to turn that prototype into a real, database-backed app.

---

## 0. How to use this document with Claude Code

1. Create an empty folder for the project and open Claude Code inside it.
2. Copy the **Kickoff prompt** at the very bottom of this file (Section 15) into Claude Code.
3. Keep this file (`Mercado_Semu_BUILD_SPEC.md`) and the prototype (`Mercado_Semu_prototipo.html`) in the project folder so Claude Code can read them.
4. Build in the milestone order in Section 12 — do not try to build everything at once.

---

## 1. Product summary

Mercado Semu is an open marketplace where anyone in Guinea Ecuatorial can **publish items for sale** and anyone can **browse and contact the seller**. It is inspired by Facebook Marketplace but local: Spanish language, prices in **FCFA (XAF)**, optimized for **mobile phones on slow connections**.

The name comes from *Mercado Semu*, the largest physical market in Malabo — this is its digital version.

**Brand promise / tagline:** *"Vende, Compra, Conecta. Todo en un solo lugar."*

**How it makes money (build these into the MVP):**
- **Seller subscriptions** — free tier + paid monthly plans (PRO, Premium) that unlock more listings, a verified badge, and included featured slots.
- **Featured / boosted listings** — a seller pays a small one-off fee to push a single listing to the top and into the "Destacados" carousel.

---

## 2. Target users & context (important constraints)

- **Location:** Malabo & Bata, Guinea Ecuatorial. Language: **Spanish (es)**.
- **Devices:** Almost entirely **Android phones**, mid/low range. Design **mobile-first** (~360–414px). Desktop is secondary.
- **Network:** Often slow/expensive mobile data → keep pages light, lazy-load and compress images, avoid heavy frameworks and large bundles.
- **Payments:** Card infrastructure is limited. **Do NOT integrate a card payment gateway in the MVP.** Handle subscription/boost payments **manually** (mobile money / cash / bank transfer confirmed by an admin) — see Section 10.
- **Contact:** Buyers and sellers connect via **in-app chat** and a **WhatsApp deep link** (WhatsApp is the dominant channel locally).

---

## 3. Brand & visual design

Match the prototype exactly. Key tokens:

| Token | Value | Use |
|---|---|---|
| Green (primary) | `#6CB33F` (dark `#4C9A2A`) | Buttons, active states, accents, "Vender" (+) |
| Navy (primary dark) | `#101C4E` (secondary `#1A2A6C`) | Headers, top bar, dark sections |
| Red (accent) | `#E23B2E` | "Destacado" badges, notifications, the "Conecta" word |
| Page background | `#F4F6FA` | App background |
| Card | `#FFFFFF` | Listings, panels |
| Text | `#1C2333` ink / `#7A8194` muted | — |

- **Logo:** a phone outline containing a shopping bag, wordmark **"MERCADO SEMU"** (MERCADO navy, SEMU green). Recreate as an SVG component; a placeholder is fine for MVP.
- **Type:** system sans (Inter / Roboto). Headings bold, slightly condensed feel.
- **Style:** rounded corners (12–16px cards), flat, friendly, high-contrast. Bottom tab navigation like a native app.
- Full brand direction is visible in the two source flyers and the HTML prototype.

---

## 4. Recommended tech stack

Chosen to be fast to build, cheap/free to host, well-documented, and easy for Claude Code to generate reliably.

- **Framework:** **Next.js (App Router) + TypeScript**, configured as a **PWA** (installable, works like an app, offline shell).
- **Styling:** **Tailwind CSS** (use the brand tokens above as Tailwind theme colors).
- **Backend / DB / Auth / Storage / Realtime:** **Supabase**
  - Postgres database
  - Supabase Auth (phone OTP if available, otherwise email/password) — phone-first is ideal for this market
  - Supabase Storage for listing images
  - Supabase Realtime for the chat feature
  - Row Level Security (RLS) policies for data safety
- **Hosting:** **Vercel** (frontend) + Supabase cloud (backend). Both have free tiers.
- **Images:** compress/resize on upload (max ~1200px, WebP). Lazy-load below the fold.

> If Supabase is not desired, an acceptable alternative is Next.js + Prisma + a hosted Postgres (Neon/Railway) + a storage bucket (S3/Cloudinary) + NextAuth. But **default to Supabase** unless told otherwise — it removes the most work.

---

## 5. MVP scope

### In scope (build this)
1. User sign-up / login (phone or email).
2. Create / edit / delete a listing (title, category, price, description, photos, location/zone).
3. Home feed: search bar, category filter chips, **Destacados** (featured) carousel, "Cerca de ti" grid.
4. Category browsing + text search.
5. Listing detail page with seller info, **in-app chat** button, and **WhatsApp** button.
6. Simple in-app chat between buyer and seller (Supabase Realtime).
7. Seller profile page (their listings, rating placeholder, member since).
8. **Monetization:** seller plans page (Free / PRO / Premium) + "boost/feature this listing" flow. Payment is **manual/admin-confirmed** in MVP (Section 10).
9. Favorites (save a listing).
10. Minimal **admin** ability to: verify a seller, mark a subscription/boost as paid, remove a listing. (Can be a protected `/admin` page or just DB flags at first.)
11. Spanish UI, FCFA formatting, mobile-first, PWA installable.

### Out of scope for MVP (note as "later")
- Integrated card/mobile-money payment gateway (manual for now).
- Ratings & reviews system (show placeholder only).
- Push notifications.
- Map view / geolocation.
- Delivery/logistics.
- Multi-language beyond Spanish.

Keep these out, but design the data model so they can be added later without a rewrite.

---

## 6. User roles

- **Guest:** browse, search, view listings. Must sign in to chat, favorite, or sell.
- **User (buyer/seller — same account):** anyone can both buy and sell. Create listings, chat, favorite, manage own listings, subscribe to a plan, boost listings.
- **Admin:** verify sellers, confirm manual payments (activate PRO/Premium/boosts), moderate/remove listings.

---

## 7. Core user stories

**Buyer**
- As a visitor I can browse the feed and filter by category without logging in.
- I can search listings by keyword.
- I can open a listing and see photos, price, description, zone, and the seller.
- I can contact the seller via in-app chat or WhatsApp.
- I can save listings to favorites (after login).

**Seller**
- I can register and create a listing with up to 10 photos in a few taps.
- I can see and manage my active listings (edit / mark as sold / delete).
- On the free plan I'm limited to 5 active listings; upgrading removes the limit.
- I can pay (manually) to **feature** a single listing so it appears in "Destacados" and at the top.
- With PRO I get a **verified badge** and included featured slots.

**Admin**
- I can mark a seller as verified.
- I can confirm a payment, which activates a subscription or a boost.
- I can remove an inappropriate listing.

---

## 8. Screens (must match the prototype)

The prototype `Mercado_Semu_prototipo.html` contains all of these — replicate structure and style, wire them to real data.

1. **Home / Feed** — navy app bar with logo + location + notifications; search bar; horizontal category chips (Todo, Congelados, Bebidas, Electrónica, Hogar, Moda, Vehículos, Inmuebles); **Destacados** horizontal carousel (featured listings with red "DESTACADO" badge); "Cerca de ti" 2-column grid of listings.
2. **Listing detail** — big image, price, title, category/zone/time pills, seller card (avatar, name, verified badge, rating placeholder), description, location; sticky bottom action bar: favorite, **Chatear**, **WhatsApp**.
3. **Publish (Vender)** — photo upload area, title, category select, price (FCFA), description, a "Destacar este anuncio" (feature) toggle, "Publicar gratis" button, and a "Hazte vendedor PRO" button linking to plans.
4. **Messages** — list of conversations; a conversation view with realtime messages.
5. **Profile** — user header (avatar, name, stats: listings / rating / sales), menu (Planes de vendedor, Publicar, Mis anuncios, Favoritos, Estadísticas, Ajustes).
6. **Plans (Planes de vendedor)** — three cards: **Básico (Gratis)**, **PRO (9.000 FCFA/mes, "Más popular")**, **Premium Negocio (25.000 FCFA/mes)**; note that single boosts start at 2.000 FCFA without a subscription.
7. **Bottom tab bar** — Inicio, Buscar, **Vender (+)** (center, green), Mensajes, Perfil.

---

## 9. Data model (Postgres / Supabase)

Design for the MVP but leave room to grow. Suggested tables:

**profiles** (extends auth user)
- `id` (uuid, = auth uid), `full_name`, `phone`, `avatar_url`, `zone` (e.g. "Ela Nguema"), `city` (default "Malabo"), `is_verified` (bool, default false), `plan` (enum: `basico` | `pro` | `premium`, default `basico`), `plan_expires_at` (timestamptz, nullable), `created_at`.

**categories**
- `id`, `slug` (congelados, bebidas, electronica, hogar, moda, vehiculos, inmuebles), `name_es`, `icon`, `sort`.

**listings**
- `id` (uuid), `seller_id` → profiles.id, `title`, `description`, `price_xaf` (integer, store whole FCFA), `category_id` → categories.id, `zone`, `city`, `status` (enum: `active` | `sold` | `removed`, default `active`), `is_featured` (bool, default false), `featured_until` (timestamptz, nullable), `views` (int default 0), `created_at`, `updated_at`.

**listing_images**
- `id`, `listing_id` → listings.id, `url`, `sort`.

**favorites**
- `id`, `user_id` → profiles.id, `listing_id` → listings.id, `created_at` (unique on user+listing).

**conversations**
- `id`, `listing_id` → listings.id, `buyer_id` → profiles.id, `seller_id` → profiles.id, `created_at` (unique on listing+buyer).

**messages**
- `id`, `conversation_id` → conversations.id, `sender_id` → profiles.id, `body`, `created_at`, `read_at` (nullable).

**payments** (manual confirmation ledger — powers monetization)
- `id`, `user_id` → profiles.id, `type` (enum: `subscription` | `boost`), `ref_listing_id` (nullable, for boosts), `plan` (nullable, for subscriptions), `amount_xaf`, `method` (e.g. `mobile_money`, `cash`, `transfer`), `status` (enum: `pending` | `confirmed` | `rejected`, default `pending`), `reference` (text the user provides), `created_at`, `confirmed_by` (admin uuid, nullable), `confirmed_at`.

**Business rules to enforce**
- Free (`basico`) sellers: max **5** listings with `status = active`.
- `pro` / `premium`: unlimited active listings; `pro` gets `is_verified` eligibility + N featured slots/month; `premium` more.
- A listing is shown as featured when `is_featured = true` AND `featured_until > now()`.
- When an admin sets a `payments` row to `confirmed`: if `subscription`, update the profile's `plan` and `plan_expires_at`; if `boost`, set the listing `is_featured = true` and `featured_until = now() + 7 days`.
- Apply **RLS**: users can only edit their own profile/listings/messages; anyone can read active listings; only admins can confirm payments or remove others' listings.

---

## 10. Monetization flow (manual payments — MVP)

Because there is no easy card gateway locally, keep it simple and manual:

1. Seller taps "Hazte PRO" or "Destacar anuncio".
2. App shows the price and local payment instructions (mobile money number / bank / cash) and asks the seller to enter a **payment reference** after paying.
3. This creates a `payments` row with `status = pending`.
4. Admin reviews in `/admin`, taps **Confirmar** → the subscription or boost activates automatically (per the rules in Section 9).
5. Seller sees their plan/badge/featured listing update.

Design the `payments` table and admin action now so that a real payment provider (mobile money API, card) can replace steps 2–4 later without schema changes.

---

## 11. Non-functional requirements

- **Mobile-first**, works well at 360px width; usable one-handed; bottom tab nav.
- **Fast on slow networks:** compress images, lazy-load, paginate the feed (infinite scroll or "load more"), minimal JS.
- **PWA:** installable, app icon, splash, offline shell for already-visited pages.
- **Spanish** everywhere; format money as `12.000 FCFA` (dot thousands separator, no decimals).
- **Accessible:** tap targets ≥44px, readable contrast.
- **Secure:** Supabase RLS on every table; never trust client for plan limits — enforce in DB policies / server actions.
- **Seed data:** include a seed script with ~12 sample listings across categories (reuse the examples in the prototype) so the app looks alive on first run.

---

## 12. Suggested build order (milestones)

Build and verify each milestone before moving on.

1. **Setup:** Next.js + TypeScript + Tailwind (brand theme) + Supabase project + PWA config. Deploy a "hello" to Vercel.
2. **Data layer:** create tables, enums, categories seed, RLS policies. Seed ~12 listings + images.
3. **Feed & detail (read-only):** Home with categories, Destacados carousel, grid; listing detail page. Wire to Supabase. This should look like the prototype.
4. **Auth:** phone or email login, profile creation.
5. **Sell:** create/edit/delete listing with image upload to Storage; enforce the 5-listing free limit.
6. **Favorites** + **search**.
7. **Chat:** conversations + realtime messages; WhatsApp deep-link button on detail.
8. **Monetization:** plans page, boost/subscribe flow, `payments` table, minimal `/admin` to confirm payments and verify sellers; featured logic in the feed.
9. **Polish:** loading states, empty states, image compression, PWA install, Spanish copy pass, mobile QA.

---

## 13. Acceptance criteria (MVP is "done" when…)

- A new user can register, publish a listing with photos, and see it live in the feed within the right category.
- A visitor can browse, filter, search, open a listing, and message the seller (in-app + WhatsApp).
- Free sellers are blocked at 6 active listings with a clear upgrade prompt.
- A seller can request PRO or a boost; after an admin confirms the payment, the badge/featured status updates automatically.
- The app is installable on Android, loads acceptably on a slow connection, and is fully in Spanish with FCFA prices.

---

## 14. Reference files in this folder

- `Mercado_Semu_prototipo.html` — the clickable visual prototype (source of truth for screens & style).
- `Mercado_Semu_BUILD_SPEC.md` — this document.

---

## 15. Kickoff prompt — paste this into Claude Code

```
You are building "Mercado Semu", a mobile-first web marketplace for Guinea Ecuatorial
(Spanish language, prices in FCFA/XAF), similar to Facebook Marketplace. The name is the
biggest physical market in Malabo — this is its digital version.

Read the two files in this folder before writing code:
- Mercado_Semu_BUILD_SPEC.md  (full spec — follow it)
- Mercado_Semu_prototipo.html  (clickable visual prototype — match its screens and style)

Tech stack: Next.js (App Router) + TypeScript + Tailwind CSS as a PWA, with Supabase for
Postgres, Auth, Storage, and Realtime. Host on Vercel + Supabase. Do NOT integrate a card
payment gateway — subscriptions and listing boosts are confirmed manually by an admin
(see the spec's payments table and monetization flow).

Brand colors: green #6CB33F, navy #101C4E, red accent #E23B2E, bg #F4F6FA. Tagline:
"Vende, Compra, Conecta. Todo en un solo lugar." UI must be in Spanish, mobile-first,
fast on slow networks, with a bottom tab bar (Inicio, Buscar, Vender +, Mensajes, Perfil).

Scope = the "MVP scope / in scope" list in the spec. Keep the "out of scope" items out but
design the data model so they can be added later.

Start with Milestone 1 (project setup) from the spec. Before generating a lot of code:
1) Confirm the plan and folder structure you intend to create.
2) List the environment variables / Supabase setup steps I need to do myself.
Then proceed milestone by milestone, pausing after each so I can test. Explain setup steps
in simple terms — I am not a professional developer.
```

---

*Prepared as a hand-off brief. Ask for a Spanish version or a deeper section (e.g. exact SQL schema, RLS policies, or the Supabase setup steps) any time.*
