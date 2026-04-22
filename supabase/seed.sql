-- ────────────────────────────────────────────────────────────────────────────
-- Khyairan Soft Drinks — Initial Seed Data
--
-- Source: ~/dev/safi/catalog.html (export catalog, 2026 edition)
-- Prices: catalog lists USD per carton. Converted to NGN at 1 USD = 1,650 NGN.
-- ⚠ NGN prices are estimates based on this rate. Abu should verify before publishing.
--
-- Idempotency:
-- - tags: ON CONFLICT (slug) DO NOTHING
-- - products: INSERT ... WHERE NOT EXISTS (name, size match)
-- - product_tags: ON CONFLICT (product_id, tag_id) DO NOTHING
--
-- All seeded products are published = false (draft). No image yet.
-- ────────────────────────────────────────────────────────────────────────────


-- ── Category tags ─────────────────────────────────────────────────────────────

INSERT INTO tags (name, slug, type, sort_order, published) VALUES
  ('Carbonated Drinks', 'carbonated-drinks', 'category', 1, true),
  ('Juices & Nectars',  'juice',             'category', 2, true),
  ('Malt Drinks',       'malt-drinks',       'category', 3, true),
  ('Energy Drinks',     'energy-drinks',     'category', 4, true),
  ('Water',             'water',             'category', 5, true),
  ('Yogurt & Dairy',    'dairy',             'category', 6, true)
ON CONFLICT (slug) DO NOTHING;


-- ── Brand tags ────────────────────────────────────────────────────────────────

INSERT INTO tags (name, slug, type, sort_order, published) VALUES
  -- Carbonated brands
  ('Coca-Cola',     'coca-cola',     'brand', 1, true),
  ('Sprite',        'sprite',        'brand', 2, true),
  ('7UP',           '7up',           'brand', 3, true),
  ('Bigi',          'bigi',          'brand', 4, true),
  ('Lacasera',      'lacasera',      'brand', 5, true),
  -- Juice brands
  ('Caprisonne',    'caprisonne',    'brand', 6, true),
  ('Five Alive',    'five-alive',    'brand', 7, true),
  ('Exotic',        'exotic',        'brand', 8, true),
  ('Chivita',       'chivita',       'brand', 9, true),
  ('Ribena',        'ribena',        'brand', 10, true),
  -- Malt brands
  ('Maltina',       'maltina',       'brand', 11, true),
  ('Malta Guinness','malta-guinness','brand', 12, true),
  ('Grand Malt',    'grand-malt',    'brand', 13, true),
  ('Amstel Malt',   'amstel-malt',   'brand', 14, true),
  ('Dubic Malt',    'dubic-malt',    'brand', 15, true),
  -- Energy brands
  ('Red Bull',      'red-bull',      'brand', 16, true),
  ('Monster Energy','monster',       'brand', 17, true),
  ('Power Horse',   'power-horse',   'brand', 18, true),
  ('Lucozade',      'lucozade',      'brand', 19, true),
  ('Fearless',      'fearless',      'brand', 20, true),
  ('Predator',      'predator',      'brand', 21, true),
  -- Water brands
  ('Eva Water',     'eva-water',     'brand', 22, true),
  ('B2 Water',      'b2-water',      'brand', 23, true),
  ('Fressia Water', 'fressia-water', 'brand', 24, true),
  -- Dairy brands
  ('Hollandia',     'hollandia',     'brand', 25, true),
  ('Fresh Yoghurt', 'fresh-yoghurt', 'brand', 26, true),
  ('CWay',          'cway',          'brand', 27, true),
  ('Marish Yo',     'marish-yo',     'brand', 28, true)
ON CONFLICT (slug) DO NOTHING;


-- ── Products ──────────────────────────────────────────────────────────────────
-- Each row: (name, size, unit_type, units_per_carton, price_ngn_rounded)
-- price_ngn = USD_price × 1650, rounded to 2 decimal places

INSERT INTO products (name, size, unit_type, units_per_carton, price_ngn, published)
SELECT v.name, v.size, v.unit_type::unit_type, v.units_per_carton, v.price_ngn, false
FROM (VALUES
  -- Carbonated Drinks
  ('Coca-Cola',       '35CL',    'bottle', 12,  3283.50),  -- $1.99
  ('Coca-Cola',       '60CL',    'bottle', 12,  4768.50),  -- $2.89
  ('Coca-Cola',       'CAN',     'can',    24, 10890.00),  -- $6.60
  ('7UP',             '40CL',    'bottle', 12,  2673.00),  -- $1.62 (glass)
  ('7UP',             '50CL',    'bottle', 12,  4422.00),  -- $2.68 (PET)
  ('Sprite',          'CAN',     'can',    24, 10543.50),  -- $6.39
  ('Bigi',            '60CL',    'bottle', 12,  3514.50),  -- $2.13
  ('Lacasera',        '35CL',    'bottle', 12,  2953.50),  -- $1.79
  ('Lacasera',        '60CL',    'bottle', 12,  4141.50),  -- $2.51
  -- Juices & Nectars
  ('Caprisonne',      'x16',     'pouch',  16,  4719.00),  -- $2.86
  ('Five Alive',      'PET',     'bottle', 12,  4257.00),  -- $2.58
  ('Exotic',          '315ML',   'can',    24,  7689.00),  -- $4.66
  ('Exotic',          '1LTR',    'pack',   12, 14751.00),  -- $8.94
  ('Chivita',         '1LTR',    'pack',   12, 21549.00),  -- $13.06
  ('Ribena',          'x16',     'pack',   16,  4240.50),  -- $2.57
  -- Malt Drinks
  ('Maltina',         '330ML',   'can',    24, 12936.00),  -- $7.84
  ('Malta Guinness',  'CAN',     'can',    24, 13051.50),  -- $7.91
  ('Grand Malt',      'CAN',     'can',    24, 11566.50),  -- $7.01
  ('Amstel Malt',     'CAN',     'can',    24, 12936.00),  -- $7.84
  ('Dubic Malt',      'CAN',     'can',    24, 12259.50),  -- $7.43
  -- Energy Drinks
  ('Red Bull',        '250ML',   'can',    24, 78952.50),  -- $47.85
  ('Monster Energy',  'CAN',     'can',    24, 22687.50),  -- $13.75
  ('Power Horse',     'CAN',     'can',    24, 28809.00),  -- $17.46
  ('Lucozade',        '380ML',   'bottle', 12, 11632.50),  -- $7.05
  ('Fearless',        'CAN',     'can',    24, 12474.00),  -- $7.56
  ('Predator Energy', '250ML',   'can',    12,  5329.50),  -- $3.23
  -- Water
  ('Eva Water',       '1.5LTR',  'bottle', 12,  3630.00),  -- $2.20
  ('Eva Water',       '75CL',    'bottle', 12,  2607.00),  -- $1.58
  ('B2 Water',        '33CL',    'bottle', 20,  2376.00),  -- $1.44
  ('Fressia Water',   '50CL',    'bottle', 20,  1419.00),  -- $0.86
  ('Fressia Water',   '75CL',    'bottle', 20,  1584.00),  -- $0.96
  -- Yogurt & Dairy
  ('Hollandia',       '1LTR',    'pack',   12, 17754.00),  -- $10.76
  ('Hollandia',       '315ML',   'pack',   12,  8283.00),  -- $5.02
  ('Hollandia',       '90ML',    'cup',    30,  3514.50),  -- $2.13
  ('Fresh Yoghurt',   '1LTR',    'pack',    6,  9537.00),  -- $5.78
  ('CWay Yoghurt',    'Cup',     'cup',    12,  6814.50),  -- $4.13
  ('Marish Yo',       '33CL',    'bottle', 20,  4306.50)   -- $2.61
) AS v(name, size, unit_type, units_per_carton, price_ngn)
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.name = v.name AND p.size = v.size
);


-- ── Product → Category tag links ──────────────────────────────────────────────

INSERT INTO product_tags (product_id, tag_id, sort_order)
SELECT p.id, t.id, v.sort_order
FROM (VALUES
  -- Carbonated Drinks
  ('Coca-Cola',       '35CL',   'carbonated-drinks', 1),
  ('Coca-Cola',       '60CL',   'carbonated-drinks', 2),
  ('Coca-Cola',       'CAN',    'carbonated-drinks', 3),
  ('7UP',             '40CL',   'carbonated-drinks', 4),
  ('7UP',             '50CL',   'carbonated-drinks', 5),
  ('Sprite',          'CAN',    'carbonated-drinks', 6),
  ('Bigi',            '60CL',   'carbonated-drinks', 7),
  ('Lacasera',        '35CL',   'carbonated-drinks', 8),
  ('Lacasera',        '60CL',   'carbonated-drinks', 9),
  -- Juices & Nectars
  ('Caprisonne',      'x16',    'juice', 1),
  ('Five Alive',      'PET',    'juice', 2),
  ('Exotic',          '315ML',  'juice', 3),
  ('Exotic',          '1LTR',   'juice', 4),
  ('Chivita',         '1LTR',   'juice', 5),
  ('Ribena',          'x16',    'juice', 6),
  -- Malt Drinks
  ('Maltina',         '330ML',  'malt-drinks', 1),
  ('Malta Guinness',  'CAN',    'malt-drinks', 2),
  ('Grand Malt',      'CAN',    'malt-drinks', 3),
  ('Amstel Malt',     'CAN',    'malt-drinks', 4),
  ('Dubic Malt',      'CAN',    'malt-drinks', 5),
  -- Energy Drinks
  ('Red Bull',        '250ML',  'energy-drinks', 1),
  ('Monster Energy',  'CAN',    'energy-drinks', 2),
  ('Power Horse',     'CAN',    'energy-drinks', 3),
  ('Lucozade',        '380ML',  'energy-drinks', 4),
  ('Fearless',        'CAN',    'energy-drinks', 5),
  ('Predator Energy', '250ML',  'energy-drinks', 6),
  -- Water
  ('Eva Water',       '1.5LTR', 'water', 1),
  ('Eva Water',       '75CL',   'water', 2),
  ('B2 Water',        '33CL',   'water', 3),
  ('Fressia Water',   '50CL',   'water', 4),
  ('Fressia Water',   '75CL',   'water', 5),
  -- Yogurt & Dairy
  ('Hollandia',       '1LTR',   'dairy', 1),
  ('Hollandia',       '315ML',  'dairy', 2),
  ('Hollandia',       '90ML',   'dairy', 3),
  ('Fresh Yoghurt',   '1LTR',   'dairy', 4),
  ('CWay Yoghurt',    'Cup',    'dairy', 5),
  ('Marish Yo',       '33CL',   'dairy', 6)
) AS v(name, size, tag_slug, sort_order)
JOIN products p ON p.name = v.name AND p.size = v.size
JOIN tags t ON t.slug = v.tag_slug
ON CONFLICT (product_id, tag_id) DO NOTHING;


-- ── Product → Brand tag links ─────────────────────────────────────────────────

INSERT INTO product_tags (product_id, tag_id, sort_order)
SELECT p.id, t.id, v.sort_order
FROM (VALUES
  -- Coca-Cola brand
  ('Coca-Cola',       '35CL',   'coca-cola', 1),
  ('Coca-Cola',       '60CL',   'coca-cola', 2),
  ('Coca-Cola',       'CAN',    'coca-cola', 3),
  -- Sprite brand
  ('Sprite',          'CAN',    'sprite', 1),
  -- 7UP brand
  ('7UP',             '40CL',   '7up', 1),
  ('7UP',             '50CL',   '7up', 2),
  -- Bigi brand
  ('Bigi',            '60CL',   'bigi', 1),
  -- Lacasera brand
  ('Lacasera',        '35CL',   'lacasera', 1),
  ('Lacasera',        '60CL',   'lacasera', 2),
  -- Caprisonne brand
  ('Caprisonne',      'x16',    'caprisonne', 1),
  -- Five Alive brand
  ('Five Alive',      'PET',    'five-alive', 1),
  -- Exotic brand
  ('Exotic',          '315ML',  'exotic', 1),
  ('Exotic',          '1LTR',   'exotic', 2),
  -- Chivita brand
  ('Chivita',         '1LTR',   'chivita', 1),
  -- Ribena brand
  ('Ribena',          'x16',    'ribena', 1),
  -- Maltina brand
  ('Maltina',         '330ML',  'maltina', 1),
  -- Malta Guinness brand
  ('Malta Guinness',  'CAN',    'malta-guinness', 1),
  -- Grand Malt brand
  ('Grand Malt',      'CAN',    'grand-malt', 1),
  -- Amstel Malt brand
  ('Amstel Malt',     'CAN',    'amstel-malt', 1),
  -- Dubic Malt brand
  ('Dubic Malt',      'CAN',    'dubic-malt', 1),
  -- Red Bull brand
  ('Red Bull',        '250ML',  'red-bull', 1),
  -- Monster brand
  ('Monster Energy',  'CAN',    'monster', 1),
  -- Power Horse brand
  ('Power Horse',     'CAN',    'power-horse', 1),
  -- Lucozade brand
  ('Lucozade',        '380ML',  'lucozade', 1),
  -- Fearless brand
  ('Fearless',        'CAN',    'fearless', 1),
  -- Predator brand
  ('Predator Energy', '250ML',  'predator', 1),
  -- Eva Water brand
  ('Eva Water',       '1.5LTR', 'eva-water', 1),
  ('Eva Water',       '75CL',   'eva-water', 2),
  -- B2 Water brand
  ('B2 Water',        '33CL',   'b2-water', 1),
  -- Fressia Water brand
  ('Fressia Water',   '50CL',   'fressia-water', 1),
  ('Fressia Water',   '75CL',   'fressia-water', 2),
  -- Hollandia brand
  ('Hollandia',       '1LTR',   'hollandia', 1),
  ('Hollandia',       '315ML',  'hollandia', 2),
  ('Hollandia',       '90ML',   'hollandia', 3),
  -- Fresh Yoghurt brand
  ('Fresh Yoghurt',   '1LTR',   'fresh-yoghurt', 1),
  -- CWay brand
  ('CWay Yoghurt',    'Cup',    'cway', 1),
  -- Marish Yo brand
  ('Marish Yo',       '33CL',   'marish-yo', 1)
) AS v(name, size, tag_slug, sort_order)
JOIN products p ON p.name = v.name AND p.size = v.size
JOIN tags t ON t.slug = v.tag_slug
ON CONFLICT (product_id, tag_id) DO NOTHING;
