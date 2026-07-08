-- ============================================================================
-- Mercado Semu — Milestone 2: seed data (7 categories, 12 demo sellers/listings)
-- Run AFTER 0001_init.sql, in the Supabase Dashboard → SQL Editor.
-- Safe to run more than once (uses ON CONFLICT DO NOTHING).
-- ============================================================================

-- ---------- Categories ------------------------------------------------------
insert into public.categories (slug, name_es, icon, sort) values
  ('congelados',  'Congelados',  '🧊', 1),
  ('bebidas',     'Bebidas',     '🍺', 2),
  ('electronica', 'Electrónica', '📱', 3),
  ('hogar',       'Hogar',       '🛋️', 4),
  ('moda',        'Moda',        '👕', 5),
  ('vehiculos',   'Vehículos',   '🚗', 6),
  ('inmuebles',   'Inmuebles',   '🏠', 7)
on conflict (slug) do nothing;

-- ---------- Demo seller profiles (no login account attached) ----------------
insert into public.profiles (id, full_name, zone, city, is_verified, plan) values
  ('d1000000-0000-4000-8000-000000000001', 'Martínez Distribución', 'Ela Nguema',            'Malabo', true,  'pro'),
  ('d1000000-0000-4000-8000-000000000002', 'Bar El Puerto',         'Centro',                'Malabo', false, 'basico'),
  ('d1000000-0000-4000-8000-000000000003', 'Ana G.',                'Malabo II',             'Malabo', false, 'basico'),
  ('d1000000-0000-4000-8000-000000000004', 'Pesca Fresca GE',       'Semu',                  'Malabo', true,  'pro'),
  ('d1000000-0000-4000-8000-000000000005', 'Casa Bella',            'Caracolas',             'Malabo', false, 'basico'),
  ('d1000000-0000-4000-8000-000000000006', 'Distri Malabo',         'Centro',                'Malabo', false, 'basico'),
  ('d1000000-0000-4000-8000-000000000007', 'Nzang Style',           'Ela Nguema',            'Malabo', false, 'basico'),
  ('d1000000-0000-4000-8000-000000000008', 'AutoMalabo',            'Carretera aeropuerto',  'Malabo', false, 'basico'),
  ('d1000000-0000-4000-8000-000000000009', 'Mercado Semu',          'Semu',                  'Malabo', true,  'premium'),
  ('d1000000-0000-4000-8000-000000000010', 'TecnoGE',               'Malabo II',             'Malabo', false, 'basico'),
  ('d1000000-0000-4000-8000-000000000011', 'FoodBox GE',            'Centro',                'Malabo', false, 'basico'),
  ('d1000000-0000-4000-8000-000000000012', 'Inmo Bioko',            'Paraíso',               'Malabo', false, 'basico')
on conflict (id) do nothing;

-- ---------- Listings --------------------------------------------------------
-- Featured ones get a 30-day feature window so they show in "Destacados".
insert into public.listings
  (id, seller_id, title, description, price_xaf, category_id, zone, city,
   status, is_featured, featured_until, emoji, bg_color) values
  ('e2000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000001',
   'Caja de pollo congelado 10 kg',
   'Caja completa de muslos de pollo congelado, ideal para tu hogar o negocio. Producto sellado, cadena de frío garantizada. Entrega a domicilio en Malabo.',
   45000, (select id from public.categories where slug='congelados'), 'Ela Nguema', 'Malabo',
   'active', true, now() + interval '30 days', '🍗', '#eaf6df'),

  ('e2000000-0000-4000-8000-000000000002', 'd1000000-0000-4000-8000-000000000002',
   'Caja cerveza Castel x24',
   'Caja de 24 cervezas Castel 33cl. Precio para bares y revendedores. Suministro rápido y confiable.',
   12000, (select id from public.categories where slug='bebidas'), 'Centro', 'Malabo',
   'active', true, now() + interval '30 days', '🍺', '#e7eefc'),

  ('e2000000-0000-4000-8000-000000000003', 'd1000000-0000-4000-8000-000000000003',
   'iPhone 13 · 128GB · como nuevo',
   'iPhone 13 en excelente estado, batería 92%, con caja y cargador. Sin arañazos. Se acepta prueba.',
   185000, (select id from public.categories where slug='electronica'), 'Malabo II', 'Malabo',
   'active', true, now() + interval '30 days', '📱', '#f0e9fb'),

  ('e2000000-0000-4000-8000-000000000004', 'd1000000-0000-4000-8000-000000000004',
   'Caja de pescado congelado 20 kg',
   'Caballa y jurel congelados, caja de 20kg. Ideal para restaurantes. Entrega diaria.',
   28000, (select id from public.categories where slug='congelados'), 'Semu', 'Malabo',
   'active', true, now() + interval '30 days', '🐟', '#e2f3f6'),

  ('e2000000-0000-4000-8000-000000000005', 'd1000000-0000-4000-8000-000000000005',
   'Sofá 3 plazas gris',
   'Sofá de 3 plazas, tela gris, poco uso, muy cómodo. Se entrega a domicilio en Malabo.',
   150000, (select id from public.categories where slug='hogar'), 'Caracolas', 'Malabo',
   'active', false, null, '🛋️', '#fdeede'),

  ('e2000000-0000-4000-8000-000000000006', 'd1000000-0000-4000-8000-000000000006',
   'Caja Coca-Cola lata x24',
   'Caja de 24 latas de Coca-Cola 33cl. Precio mayorista para tu negocio.',
   9500, (select id from public.categories where slug='bebidas'), 'Centro', 'Malabo',
   'active', false, null, '🥤', '#fde9ec'),

  ('e2000000-0000-4000-8000-000000000007', 'd1000000-0000-4000-8000-000000000007',
   'Vestido africano a medida',
   'Vestido en tela africana, confección a medida. Colores a elegir. Encargo en 3 días.',
   15000, (select id from public.categories where slug='moda'), 'Ela Nguema', 'Malabo',
   'active', false, null, '👗', '#f3e9f7'),

  ('e2000000-0000-4000-8000-000000000008', 'd1000000-0000-4000-8000-000000000008',
   'Toyota RAV4 2016',
   'Toyota RAV4 2016, 98.000 km, aire acondicionado, papeles al día. Se acepta inspección mecánica.',
   4200000, (select id from public.categories where slug='vehiculos'), 'Carretera aeropuerto', 'Malabo',
   'active', false, null, '🚗', '#e7eefc'),

  ('e2000000-0000-4000-8000-000000000009', 'd1000000-0000-4000-8000-000000000009',
   'Caja mixta carne y pollo',
   'Caja mixta de res, pollo y hamburguesas congeladas. Perfecta para la familia. Entrega el mismo día.',
   35000, (select id from public.categories where slug='congelados'), 'Semu', 'Malabo',
   'active', false, null, '🧊', '#e2f3f6'),

  ('e2000000-0000-4000-8000-000000000010', 'd1000000-0000-4000-8000-000000000010',
   'Smart TV 43" Full HD',
   'Televisor Smart 43 pulgadas, nuevo en caja, con garantía de 6 meses. WiFi y Netflix.',
   120000, (select id from public.categories where slug='electronica'), 'Malabo II', 'Malabo',
   'active', false, null, '📺', '#f0e9fb'),

  ('e2000000-0000-4000-8000-000000000011', 'd1000000-0000-4000-8000-000000000011',
   'Caja patatas fritas congeladas',
   'Caja de patatas fritas congeladas 2,5kg x4. Ideal para restaurantes y eventos.',
   11000, (select id from public.categories where slug='congelados'), 'Centro', 'Malabo',
   'active', false, null, '🍟', '#fdf3df'),

  ('e2000000-0000-4000-8000-000000000012', 'd1000000-0000-4000-8000-000000000012',
   'Apartamento 2 hab. amueblado',
   'Apartamento de 2 habitaciones amueblado, zona tranquila, agua y luz. Contrato flexible.',
   250000, (select id from public.categories where slug='inmuebles'), 'Paraíso', 'Malabo',
   'active', false, null, '🏠', '#eaf6df')
on conflict (id) do nothing;
