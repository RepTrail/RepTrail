-- Add Asaas fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS asaas_customer_id text,
ADD COLUMN IF NOT EXISTS asaas_subscription_id text,
ADD COLUMN IF NOT EXISTS asaas_billing_type text; -- BOLETO, PIX, CREDIT_CARD

-- Create index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_profiles_asaas_customer_id ON profiles(asaas_customer_id);
