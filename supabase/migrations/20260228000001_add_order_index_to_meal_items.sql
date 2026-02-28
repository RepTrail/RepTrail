
-- Add order_index to meal_items to allow reordering
ALTER TABLE public.meal_items ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- Initialize order_index for existing items based on their ID (since created_at doesn't exist)
WITH numbered_items AS (
    SELECT id, row_number() OVER (PARTITION BY meal_id ORDER BY id) - 1 as new_order
    FROM public.meal_items
)
UPDATE public.meal_items
SET order_index = numbered_items.new_order
FROM numbered_items
WHERE public.meal_items.id = numbered_items.id;
