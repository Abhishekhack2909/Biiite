-- Add max_quantity column to existing items table
alter table items add column if not exists max_quantity int default 1;
