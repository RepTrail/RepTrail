-- Add CPF/CNPJ field to profiles for payment processing
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS cpf_cnpj text;

-- Create index for document lookups if needed
CREATE INDEX IF NOT EXISTS idx_profiles_cpf_cnpj ON profiles(cpf_cnpj);
