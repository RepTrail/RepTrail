-- Create store_products table for the marketplace/store
create table if not exists public.store_products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text check (category in ('supplement', 'accessory', 'clothing', 'equipment')),
  image_url text,
  link_url text,
  official_price numeric(10, 2),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Click tracking for products
create table if not exists public.product_clicks (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.store_products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  clicked_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- RLS
alter table public.store_products enable row level security;
alter table public.product_clicks enable row level security;

-- Policies for store_products
create policy "Products are viewable by everyone"
  on public.store_products for select
  using (true);

create policy "Admins can insert products"
  on public.store_products for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update products"
  on public.store_products for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete products"
  on public.store_products for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policies for product_clicks
create policy "Admins can view clicks"
  on public.product_clicks for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Authenticated users can track clicks"
  on public.product_clicks for insert
  with check (auth.role() = 'authenticated');
