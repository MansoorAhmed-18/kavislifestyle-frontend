-- =============================================================================
-- KAVI'S LIFESTYLE — DATABASE SEED DATA
-- Initial Departments, Store Settings, and Coupons
-- =============================================================================

-- Initial Store Settings
INSERT INTO public.store_settings (
    store_name,
    tagline,
    support_email,
    support_phone,
    flagship_address,
    announcement_text,
    free_shipping_threshold,
    brand_colors
) VALUES (
    'Kavi''s Lifestyle',
    'Everything You Love, Under One Roof.',
    'care@kavislifestyle.com',
    '+91 98400 12345',
    'Kavi Boutique, T. Nagar, Chennai, Tamil Nadu — 600017',
    'Festive Launch: FREE Shipping across India on orders above ₹999 | Use code KAVI10',
    999.00,
    '{"primary": "#173F46", "secondary": "#F26B4F", "background": "#FFF8EF", "accent": "#F2D9A6"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Initial Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_value, max_discount)
VALUES
    ('KAVI10', 'percentage', 10.00, 999.00, 500.00),
    ('FESTIVE500', 'fixed', 500.00, 2999.00, 500.00)
ON CONFLICT (code) DO NOTHING;

-- Seed Departments and Categories
INSERT INTO public.categories (department_id, name, slug, description, display_order, subcategories)
VALUES
    ('womens-fashion', 'Sarees', 'sarees', 'Handwoven pure silks, cottons, and brocades.', 1, ARRAY['Kanchipuram Silk Sarees', 'Cotton Sarees', 'Semi-Silk Sarees', 'Katan Silk Sarees']),
    ('womens-fashion', 'Salwar Collections', 'salwar-collections', 'Unstitched materials and stitched suits up to 3XL.', 2, ARRAY['Unstitched Salwar Materials', 'Stitched Salwar Suits', 'Plus-size Collections up to 3XL']),
    ('womens-fashion', 'Western Wear', 'western-wear', 'Chic tops and three-piece co-ord sets.', 3, ARRAY['Tops', 'Co-ord Sets', 'Three-piece Sets']),
    ('womens-fashion', 'Bottom Wear', 'bottom-wear', '4-way leggings, palazzos, and cotton pants.', 4, ARRAY['4-way Leggings', 'Jeggings', 'Cotton Pants', 'Patiala', 'Palazzo']),
    ('womens-fashion', 'Other Collections', 'other-collections', 'Shawls, nightwear, Pranjul gowns, and shapewear.', 5, ARRAY['Shawls', 'Pranjul Nightwear', 'Nightwear Gowns', 'Shapewear (M–XXL)']),

    ('dry-fruits-nuts', 'Almonds', 'almonds', 'King California and Kashmiri Mamra almonds.', 1, ARRAY['California Almonds', 'Mamra Giri']),
    ('dry-fruits-nuts', 'Cashews', 'cashews', 'Jumbo W180 and W240 whole crunchy cashews.', 2, ARRAY['Jumbo W180 Cashews', 'W240 Whole Cashews']),
    ('dry-fruits-nuts', 'Pistachios', 'pistachios', 'Roasted salted Californian and Irani pistachios.', 3, ARRAY['Roasted & Salted Pistachios']),
    ('dry-fruits-nuts', 'Walnuts', 'walnuts', 'Kashmiri snow white walnut halves.', 4, ARRAY['Kashmiri Snow White Halves']),
    ('dry-fruits-nuts', 'Gift Packs & Mixed Boxes', 'gift-packs', 'Royal wooden gifting hampers and wellness boxes.', 5, ARRAY['Royal Wooden 4-in-1 Box', 'Festive Celebration Tray']),

    ('perfumes-fragrances', 'Unisex Perfumes', 'unisex-perfumes', 'Royal amber and Cambodian oudh blends.', 1, ARRAY['Royal Amber Oudh', 'Velvet Musk']),
    ('perfumes-fragrances', 'Traditional Attars', 'attars', 'Pure Kannauj steam-distilled non-alcoholic attars.', 2, ARRAY['Ruh Gulab', 'Mitti Attar', 'Mysore Sandalwood']),
    ('perfumes-fragrances', 'Men''s Perfumes', 'mens-perfumes', 'Woody, leather, and bergamot citrus notes.', 3, ARRAY['Woody & Leather', 'Fresh Aquatic']),
    ('perfumes-fragrances', 'Women''s Perfumes', 'womens-perfumes', 'Velvety vanilla and night blooming jasmine.', 4, ARRAY['Floral Bouquet', 'Warm Vanilla']),

    ('cosmetics-beauty', 'Face Care & Ayurvedic', 'face-care', 'Kumkumadi facial elixirs and saffron ubtan.', 1, ARRAY['Kumkumadi Facial Oils', 'Saffron Radiance Ubtan']),
    ('cosmetics-beauty', 'Makeup', 'makeup', 'Weightless velvet matte lipsticks and herbal kajal.', 2, ARRAY['Lipsticks & Glosses', 'Herbal Kajal']),
    ('cosmetics-beauty', 'Hair Care', 'hair-care', 'Cold-pressed Bhringraj and red onion scalp oils.', 3, ARRAY['Bhringraj Scalp Oils', 'Gentle Cleansers'])
ON CONFLICT (slug) DO NOTHING;
