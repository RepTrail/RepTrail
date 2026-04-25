ALTER TABLE public.store_products ADD COLUMN IF NOT EXISTS rating numeric(3, 2);
ALTER TABLE public.store_products ADD COLUMN IF NOT EXISTS reviews_count integer;
