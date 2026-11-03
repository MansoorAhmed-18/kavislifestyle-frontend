-- =============================================================================
-- KAVI'S LIFESTYLE — ROW LEVEL SECURITY (RLS) POLICIES
-- Default-deny model with precise customer and administrative scopes
-- =============================================================================

-- Enable RLS on all operational tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 2. STORE SETTINGS (Public read, admin write)
CREATE POLICY "Public can view store settings"
ON public.store_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update store settings"
ON public.store_settings FOR ALL
USING (public.is_admin());

-- 3. CATEGORIES (Public read active, admin manage all)
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (public.is_admin());

-- 4. PRODUCTS & ASSETS (Public read active, admin manage)
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
USING (public.is_admin());

CREATE POLICY "Public can view product images"
ON public.product_images FOR SELECT
USING (true);

CREATE POLICY "Admins can manage product images"
ON public.product_images FOR ALL
USING (public.is_admin());

CREATE POLICY "Public can view product variants"
ON public.product_variants FOR SELECT
USING (true);

CREATE POLICY "Admins can manage product variants"
ON public.product_variants FOR ALL
USING (public.is_admin());

-- 5. ADDRESSES (User can view/manage only their own)
CREATE POLICY "Users can view their own addresses"
ON public.addresses FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create their own addresses"
ON public.addresses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
ON public.addresses FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
ON public.addresses FOR DELETE
USING (auth.uid() = user_id);

-- 6. CART ITEMS
CREATE POLICY "Users can manage their own cart"
ON public.cart_items FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. WISHLIST
CREATE POLICY "Users can manage their own wishlist"
ON public.wishlist FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. ORDERS & ORDER ITEMS
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can view their own order items"
ON public.order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Admins can manage orders"
ON public.orders FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can manage order items"
ON public.order_items FOR ALL
USING (public.is_admin());

-- 9. PAYMENTS (Users view their own payment records, server service-role updates)
CREATE POLICY "Users can view their own payment status"
ON public.payments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = payments.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Admins can view all payments"
ON public.payments FOR SELECT
USING (public.is_admin());

-- 10. REVIEWS (Public can read approved, authenticated users can insert)
CREATE POLICY "Public can view approved reviews"
ON public.reviews FOR SELECT
USING (is_approved = true OR public.is_admin());

CREATE POLICY "Authenticated users can submit reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 11. NEWSLETTER SUBSCRIBERS
CREATE POLICY "Public can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
WITH CHECK (true);
