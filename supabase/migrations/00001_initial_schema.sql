-- ── Enums ─────────────────────────────────────────────────────────────────────
CREATE TYPE unit_type AS ENUM ('bottle', 'can', 'pack', 'cup', 'pouch');
CREATE TYPE user_role AS ENUM ('owner', 'manager');

-- ── products ──────────────────────────────────────────────────────────────────
CREATE TABLE products (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  size             text        NOT NULL,
  unit_type        unit_type   NOT NULL,
  units_per_carton integer     NOT NULL,
  price_ngn        numeric     NOT NULL,
  image_path       text,
  published        boolean     NOT NULL DEFAULT false,
  metadata         jsonb       NOT NULL DEFAULT '{}',
  internal_notes   text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_published_requires_image
    CHECK (published = false OR image_path IS NOT NULL)
);

-- ── tags ──────────────────────────────────────────────────────────────────────
CREATE TABLE tags (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  slug       text        NOT NULL UNIQUE,
  type       text        NOT NULL,
  sort_order integer     NOT NULL DEFAULT 0,
  published  boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── product_tags (join table) ─────────────────────────────────────────────────
CREATE TABLE product_tags (
  product_id uuid    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id     uuid    NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, tag_id)
);

-- ── profiles ──────────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id         uuid        PRIMARY KEY,
  full_name  text        NOT NULL,
  role       user_role   NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── updated_at trigger ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = clock_timestamp();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tags_set_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
