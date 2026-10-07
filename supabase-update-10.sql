-- Tag custom order for admin (all 3 pages)
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS tag_orders (
  page TEXT NOT NULL,
  tag TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (page, tag)
);

ALTER TABLE tag_orders ENABLE ROW LEVEL SECURITY;

-- Public can read (so visitors see the custom order)
DROP POLICY IF EXISTS "Public read tag orders" ON tag_orders;
CREATE POLICY "Public read tag orders" ON tag_orders
  FOR SELECT USING (true);

-- Only admin can write
DROP POLICY IF EXISTS "Admin write tag orders" ON tag_orders;
CREATE POLICY "Admin write tag orders" ON tag_orders
  FOR ALL USING (
    (auth.jwt() ->> 'email') = 'talhamohsin216@gmail.com'
  );
