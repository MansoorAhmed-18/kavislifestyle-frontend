-- ==============================================================================
-- KAVI'S LIFESTYLE - INSTANT SUPABASE SETUP FOR CROSS-DEVICE ORDER SYNC
-- ==============================================================================
-- Run this script in your Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard/project/yxvsfaqqkfbfcjuymebo
-- 2. Click "SQL Editor" on the left menu
-- 3. Click "New query", paste this entire script, and click "Run" (or Ctrl + Enter)
-- ==============================================================================

-- 1. Create orders table with both structured columns & raw JSONB flexibility
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT,
    user_email TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    status TEXT NOT NULL DEFAULT 'placed',
    subtotal NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    shipping_charge NUMERIC DEFAULT 0,
    total_amount NUMERIC DEFAULT 0,
    customer JSONB DEFAULT '{}'::jsonb,
    items JSONB DEFAULT '[]'::jsonb,
    shipping_address JSONB DEFAULT '{}'::jsonb,
    payment_method TEXT DEFAULT 'Prepaid Online (Razorpay 256-Bit SSL)',
    payment_status TEXT DEFAULT 'paid',
    carrier TEXT DEFAULT 'BlueDart Express',
    tracking_number TEXT DEFAULT '',
    raw_data JSONB DEFAULT '{}'::jsonb
);

-- 2. Create index on status & user_email for high performance queries
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Create open RLS policies so anon client can read, insert, and update orders across laptop and mobile
DROP POLICY IF EXISTS "Allow anon read orders" ON public.orders;
CREATE POLICY "Allow anon read orders" ON public.orders
    FOR SELECT TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow anon insert orders" ON public.orders;
CREATE POLICY "Allow anon insert orders" ON public.orders
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update orders" ON public.orders;
CREATE POLICY "Allow anon update orders" ON public.orders
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Enable Supabase Realtime for live cross-device status pushes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 6. Insert initial orders so laptop and mobile immediately see test and active orders
INSERT INTO public.orders (
    id, order_number, created_at, user_id, user_email, guest_email, guest_phone,
    status, subtotal, discount_amount, shipping_charge, total_amount,
    customer, items, payment_method, payment_status, carrier, tracking_number
) VALUES 
(
    'ord-103024',
    'KV-103024',
    '2026-11-05T14:16:00.000Z',
    'usr-mansoor-01',
    'simplysarath01@gmail.com',
    'simplysarath01@gmail.com',
    '+91 90953 16566',
    'placed',
    599,
    0,
    99,
    698,
    '{"name": "Mansoor", "email": "simplysarath01@gmail.com", "phone": "+91 90953 16566", "address": "Near Railway Station, Tiruvallur Road", "city": "Chennai", "state": "Tamil Nadu", "pincode": "600075"}'::jsonb,
    '[{"id": "item-sms-01", "name": "Semi Silk Saree", "image": "/images/products/sarees/saree-2.jpg", "variant": "Mustard Yellow with Teal Border", "quantity": 1, "unitPrice": 599, "totalPrice": 599}]'::jsonb,
    'Prepaid Online (Razorpay 256-Bit SSL)',
    'paid',
    'BlueDart Express',
    'BD-88103024IN'
),
(
    'ord-406008',
    'KV-406008',
    '2026-11-04T14:30:00.000Z',
    'usr-priya-01',
    'priyakavislifestyle@gmail.com',
    'priyakavislifestyle@gmail.com',
    '+91 90953 16566',
    'placed',
    9999,
    1000,
    0,
    8999,
    '{"name": "Priyadarshini Sundaram", "email": "priyakavislifestyle@gmail.com", "phone": "+91 90953 16566", "address": "14B, Alacrity Greens, 4th Main Road", "city": "Chennai", "state": "Tamil Nadu", "pincode": "600040"}'::jsonb,
    '[{"id": "item-101", "name": "Kanchipuram Pure Zari Bridal Silk Saree", "image": "/images/products/sarees/saree-6.jpg", "variant": "Bridal Crimson Red", "quantity": 1, "unitPrice": 9999, "totalPrice": 9999}]'::jsonb,
    'Prepaid Online (Razorpay 256-Bit SSL)',
    'paid',
    'BlueDart Local Express',
    'BD-406008IN'
)
ON CONFLICT (id) DO NOTHING;

-- Verification query
SELECT id, order_number, user_email, status, total_amount FROM public.orders;

