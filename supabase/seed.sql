-- Campus Delivery System Seed Data
-- Run this after schema.sql in Supabase SQL Editor

-- Locations
insert into locations (id, name, type) values
  ('loc_store', 'Campus Store', 'Commercial'),
  ('loc_library', 'Central Library', 'Academic'),
  ('loc_hostel_a', 'Hostel A', 'Residential'),
  ('loc_hostel_b', 'Hostel B', 'Residential'),
  ('loc_canteen', 'Main Canteen', 'Commercial'),
  ('loc_sports', 'Sports Complex', 'Recreational');

-- Items with varied weights and fragility for testing
insert into items (id, name, category, pickup_location_id, weight_kg, fragile, available) values
  -- Standard items
  ('item_001', 'Notebook Set (5 pack)', 'Stationery', 'loc_store', 0.5, false, true),
  ('item_002', 'Scientific Calculator', 'Stationery', 'loc_store', 0.3, true, true),
  ('item_003', 'Reference Textbook Bundle', 'Books', 'loc_library', 2.5, false, true),
  ('item_004', 'Laptop Charger (Universal)', 'Electronics', 'loc_store', 0.4, true, true),
  
  -- TEST CASE: Fragile item (Meera cannot handle)
  ('item_005', 'Engineering Drawing Kit', 'Stationery', 'loc_store', 1.1, true, true),
  
  -- TEST CASE: Heavy item (Meera and Isha cannot handle)
  ('item_006', 'Sports Equipment Bag', 'Sports', 'loc_sports', 3.2, false, true),
  
  -- Additional items
  ('item_007', 'Wireless Earbuds', 'Electronics', 'loc_store', 0.1, true, true),
  ('item_008', 'Art Supply Box', 'Stationery', 'loc_store', 1.8, true, true),
  ('item_009', 'Water Bottle (1L)', 'General', 'loc_canteen', 1.2, false, true),
  ('item_010', 'Lab Coat', 'Clothing', 'loc_store', 0.6, false, true);

-- Delivery Partners with specific capabilities
insert into delivery_partners (id, name, current_location_id, max_weight_kg, can_handle_fragile, is_available) values
  ('dp_001', 'Aman', 'loc_store', 5.0, true, true),
  ('dp_002', 'Ravi', 'loc_library', 4.0, true, true),
  ('dp_003', 'Meera', 'loc_hostel_a', 3.0, false, true),
  ('dp_004', 'Isha', 'loc_canteen', 2.5, true, true);
