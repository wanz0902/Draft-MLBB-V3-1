-- Migration: Ensure ALL profile + membership columns exist on users table
-- Safe to run multiple times (IF NOT EXISTS)
-- Run: psql $DATABASE_URL -f scripts/migrate-all-missing-columns.sql

-- Profile personalization fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_role TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS showcase_hero TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_banner TEXT DEFAULT 'default';

-- MLBB profile fields (may already exist from migrate-local-auth.sql)
ALTER TABLE users ADD COLUMN IF NOT EXISTS mlbb_uid TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mlbb_sid TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mlbb_nickname TEXT;

-- Profile completion flag (may already exist from migrate-profile-completed.sql)
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- Membership fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_plan TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_started_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;

-- Local auth (may already exist from migrate-local-auth.sql)
ALTER TABLE users ALTER COLUMN google_id DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
