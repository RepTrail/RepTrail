-- Add cancellation tracking fields to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_cancel_at_period_end boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_current_period_end timestamptz;
