-- Users table for Google OAuth 2.0 (Passport.js)
-- Run this on Neon PostgreSQL: psql $DATABASE_URL -f scripts/migrate-users-table.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  google_id     TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
