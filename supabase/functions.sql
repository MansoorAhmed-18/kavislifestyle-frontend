-- =============================================================================
-- KAVI'S LIFESTYLE — DATABASE FUNCTIONS & TRIGGERS
-- =============================================================================

-- 1. Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger across operational tables
DROP TRIGGER IF EXISTS trigger_set_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_store_settings_updated_at ON public.store_settings;
CREATE TRIGGER trigger_set_store_settings_updated_at
BEFORE UPDATE ON public.store_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_products_updated_at ON public.products;
CREATE TRIGGER trigger_set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. New user registration handler: automatically inserts into public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'customer'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Atomic Inventory Deduction Function
CREATE OR REPLACE FUNCTION public.decrement_product_inventory(
    p_product_id UUID,
    p_variant_id UUID,
    p_quantity INT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_available INT;
BEGIN
    SELECT quantity_available INTO v_available
    FROM public.inventory
    WHERE product_id = p_product_id
    AND (p_variant_id IS NULL OR variant_id = p_variant_id)
    FOR UPDATE;

    IF v_available IS NULL OR v_available < p_quantity THEN
        RETURN FALSE;
    END IF;

    UPDATE public.inventory
    SET quantity_available = quantity_available - p_quantity
    WHERE product_id = p_product_id
    AND (p_variant_id IS NULL OR variant_id = p_variant_id);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
