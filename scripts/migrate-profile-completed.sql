-- Migration: Add profile_completed column to users table
-- Run: psql $DATABASE_URL -f scripts/migrate-profile-completed.sql

-- 1. Add profile_completed boolean (default false for new users)
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- 2. Backfill: mark users as profile completed if they already have MLBB data
UPDATE users
SET profile_completed = TRUE
WHERE mlbb_uid IS NOT NULL
  AND mlbb_sid IS NOT NULL
  AND name IS NOT NULL
  AND name != '';

-- 3. Also mark email/password users with name as completed (they registered with full data)
UPDATE users
SET profile_completed = TRUE
WHERE password_hash IS NOT NULL
  AND name IS NOT NULL
  AND name != '';
