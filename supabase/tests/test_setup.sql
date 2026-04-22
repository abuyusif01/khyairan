-- ────────────────────────────────────────────────────────────────────────────
-- Persistent mock of Supabase auth infrastructure for local testing.
-- In production, Supabase provides auth schema, auth.uid(), and roles.
-- Run this ONCE on a fresh database before applying migrations.
-- ────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::jsonb->>'sub')::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

DO $$ BEGIN CREATE ROLE anon        NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE ROLE authenticated NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
