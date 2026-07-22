-- Migration: Add local auth + MLBB profile support to users table
-- Run: psql $DATABASE_URL -f scripts/migrate-local-auth.sql

-- 1. Make google_id nullable (email/password users won't have one)
ALTER TABLE users ALTER COLUMN google_id DROP NOT NULL;

-- 2. Add password_hash column for local auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 3. Add unique constraint on email (needed for local login lookup)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);

-- 4. Add MLBB profile columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS mlbb_uid TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mlbb_sid TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mlbb_nickname TEXT;
