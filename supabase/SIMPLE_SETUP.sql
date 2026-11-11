-- =============================================================================
-- KAVI'S LIFESTYLE — SIMPLE PRODUCTION DATABASE SETUP
-- Safe, Idempotent SQL script to create and configure tables in Supabase
-- Copy and run this in your Supabase Dashboard: SQL Editor -> New query -> Run
-- =============================================================================

-- 1. ORDERS TABLE (Core order management, returns & defect videos)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    user_id TEXT,
    user_email TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    status TEXT NOT NULL DEFAULT 'placed',
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    shipping_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'Prepaid Online',
    payment_status TEXT NOT NULL DEFAULT 'paid',
    carrier TEXT DEFAULT 'BlueDart Express',
    tracking_number TEXT,
    customer JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enable Row Level Security (RLS) on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read and write access for store orders (using anon key)
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE USING (true);

-- 2. PRODUCTS TABLE (Optional: edit products directly in Supabase Table Editor)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department_id TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    discount_price NUMERIC(10,2),
    rating NUMERIC(3,2) DEFAULT 4.85,
    reviews_count INT DEFAULT 12,
    stock INT DEFAULT 15,
    in_stock BOOLEAN DEFAULT true,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT,
    short_description TEXT,
    fabric TEXT,
    color TEXT,
    variants JSONB DEFAULT '[]'::jsonb,
    blouse_options JSONB DEFAULT '[]'::jsonb,
    is_new_arrival BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
CREATE POLICY "Admin can manage products" ON public.products FOR ALL USING (true);

-- 3. COUPONS TABLE (Manage store discounts in Supabase)
CREATE TABLE IF NOT EXISTS public.coupons (
    code TEXT PRIMARY KEY,
    discount_percent INT NOT NULL DEFAULT 10,
    max_discount NUMERIC(10,2) DEFAULT 500,
    min_order_amount NUMERIC(10,2) DEFAULT 999,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view coupons" ON public.coupons;
CREATE POLICY "Public can view coupons" ON public.coupons FOR SELECT USING (true);

-- Seed active store coupons
INSERT INTO public.coupons (code, discount_percent, max_discount, min_order_amount, is_active, description)
VALUES 
    ('FESTIVE10', 10, 500, 999, true, '10% OFF on all Festive Sarees and Gift Boxes'),
    ('WELCOME15', 15, 750, 1499, true, '15% OFF on first order above ₹1,499'),
    ('KAVIS50', 5, 200, 499, true, 'Flat 5% OFF on all daily essentials')
ON CONFLICT (code) DO UPDATE SET 
    discount_percent = EXCLUDED.discount_percent,
    max_discount = EXCLUDED.max_discount,
    min_order_amount = EXCLUDED.min_order_amount,
    is_active = EXCLUDED.is_active;

-- Enable Realtime replication for instant cross-device updates
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.orders, public.products;
COMMIT;
