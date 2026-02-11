-- Campus Delivery System Seed Data
-- Run this after schema.sql in Supabase SQL Editor

-- Locations
insert into locations (id, name, type) values
  ('loc_store', 'Campus Store', 'Store'),
  ('loc_library', 'Central Library', 'Library'),
  ('loc_lab', 'Lab Block', 'Academic'),
  ('loc_admin', 'Admin Office', 'Administrative'),
  ('loc_sports', 'Sports Complex', 'Recreation'),
  ('loc_hostel', 'Hostel Area', 'Residential');

-- Items with varied weights and fragility for testing
insert into items (id, name, category, pickup_location_id, weight_kg, fragile, available, max_quantity) values
  ('item_001', 'A4 Notebook Bundle', 'Stationery', 'loc_store', 0.6, false, true, 5),
  ('item_002', 'Engineering Drawing Kit', 'Stationery', 'loc_store', 1.1, true, true, 2),
  ('item_003', 'Data Structures Textbook', 'Books', 'loc_library', 1.4, false, true, 1),
  ('item_004', 'Physics Lab Coat', 'Lab Equipment', 'loc_lab', 0.9, false, true, 1),
  ('item_005', 'Arduino Starter Kit', 'Electronics', 'loc_lab', 0.8, true, true, 1),
  ('item_006', 'Hostel Parcel', 'Parcel', 'loc_admin', 2.5, false, true, 1),
  ('item_007', 'Calculator', 'Electronics', 'loc_store', 0.3, true, true, 2),
  ('item_008', 'Chemistry Record Book', 'Books', 'loc_library', 0.7, false, true, 2),
  ('item_009', 'Sports Equipment Bag', 'Sports', 'loc_sports', 3.2, false, true, 1),
  ('item_010', 'Project Report Printout', 'Documents', 'loc_admin', 0.4, true, true, 3);

-- Delivery Partners with specific capabilities
insert into delivery_partners (id, name, current_location_id, max_weight_kg, can_handle_fragile, is_available) values
  ('dp_001', 'Aarav', 'loc_hostel', 4.0, true, true),
  ('dp_002', 'Meera', 'loc_library', 3.0, false, true),
  ('dp_003', 'Rohan', 'loc_lab', 5.0, true, true),
  ('dp_004', 'Isha', 'loc_store', 2.5, true, true);
