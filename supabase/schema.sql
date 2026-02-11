-- Campus Delivery System Schema
-- Run this in Supabase SQL Editor

-- Locations: Campus spots
create table if not exists locations (
  id text primary key,
  name text not null,
  type text not null
);

-- Items: Deliverable goods with physical constraints
create table if not exists items (
  id text primary key,
  name text not null,
  category text not null,
  pickup_location_id text references locations(id),
  weight_kg float not null,
  fragile boolean default false,
  available boolean default true,
  max_quantity int default 1
);

-- Delivery Partners: The couriers with specific capabilities
create table if not exists delivery_partners (
  id text primary key,
  name text not null,
  current_location_id text references locations(id),
  max_weight_kg float not null,
  can_handle_fragile boolean default false,
  is_available boolean default true
);

-- Orders: The core tracking table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  item_id text references items(id),
  partner_id text references delivery_partners(id),
  drop_location_id text references locations(id),
  status text check (status in ('requested', 'assigned', 'picked_up', 'delivered', 'cancelled')) default 'requested',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Realtime for orders and delivery_partners (skip if already added)
do $$
begin
  -- Add orders table to realtime if not already added
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table orders;
  end if;
  
  -- Add delivery_partners table to realtime if not already added
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'delivery_partners'
  ) then
    alter publication supabase_realtime add table delivery_partners;
  end if;
end $$;

-- Row Level Security (RLS) Policies
alter table locations enable row level security;
alter table items enable row level security;
alter table delivery_partners enable row level security;
alter table orders enable row level security;

-- Locations: Anyone can read
drop policy if exists "Locations are viewable by everyone" on locations;
create policy "Locations are viewable by everyone"
  on locations for select
  using (true);

-- Items: Anyone can read
drop policy if exists "Items are viewable by everyone" on items;
create policy "Items are viewable by everyone"
  on items for select
  using (true);

-- Delivery Partners: Anyone can read
drop policy if exists "Partners are viewable by everyone" on delivery_partners;
create policy "Partners are viewable by everyone"
  on delivery_partners for select
  using (true);

-- Orders: Users can view their own orders
drop policy if exists "Users can view own orders" on orders;
create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Orders: Users can create orders
drop policy if exists "Users can create orders" on orders;
create policy "Users can create orders"
  on orders for insert
  with check (auth.uid() = user_id);

-- Orders: Users can update their own orders (for status simulation)
drop policy if exists "Users can update own orders" on orders;
create policy "Users can update own orders"
  on orders for update
  using (auth.uid() = user_id);
