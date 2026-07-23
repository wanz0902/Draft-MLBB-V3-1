-- Migration: Add profile customization and membership fields to users table
-- Safe for existing users - all fields have defaults or are nullable

-- Profile personalization fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_role TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS showcase_hero TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_banner TEXT DEFAULT 'default';

-- Membership fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_plan TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_started_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;
