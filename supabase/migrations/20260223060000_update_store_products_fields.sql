
-- ADD MISSING COLUMNS TO STORE_PRODUCTS
ALTER TABLE public.store_products 
ADD COLUMN IF NOT EXISTS sub_category text,
ADD COLUMN IF NOT EXISTS rating numeric(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviews_count integer DEFAULT 0;

-- Update category check to include PT-BR or match interface better if needed
-- Actually, let's keep it flexible or update the check.
ALTER TABLE public.store_products DROP CONSTRAINT IF EXISTS store_products_category_check;
ALTER TABLE public.store_products ADD CONSTRAINT store_products_category_check 
CHECK (category IN ('supplement', 'accessory', 'clothing', 'equipment', 'Suplemento', 'Acessório', 'Vestuário', 'Equipamento'));
