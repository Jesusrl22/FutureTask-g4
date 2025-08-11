-- Add 'notification_settings' column to 'users' table if it doesn't exist
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS notification_settings jsonb;

-- Add 'theme' column to 'users' table if it doesn't exist
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS theme text;

-- Update RLS policy for users to update their own profile to include new columns
-- This policy already exists, so we'll ensure it covers the new columns.
-- If you have a more restrictive policy, you might need to adjust it.
-- The existing policy "Users can update their own profile." should cover this.
-- No explicit change needed for the policy itself, as it applies to the row.
