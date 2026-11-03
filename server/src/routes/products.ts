import { Router, Request, Response, NextFunction } from 'express';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase';

const router = Router();

// Fallback initial products in case database is in setup mode
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-wf-001',
    name: 'Kanchipuram Pure Zari Bridal Silk Saree',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    price: 12499,
    discountPrice: 9999,
    rating: 4.9,
    stock: 12
  },
  {
    id: 'prod-df-001',
    name: 'King California Jumbo Almonds (Badam Giri)',
    departmentId: 'dry-fruits-nuts',
    category: 'Almonds',
    price: 349,
    discountPrice: 289,
    rating: 4.9,
    stock: 95
  },
  {
    id: 'prod-pf-001',
    name: 'Imperial Oud & Smoked Amber Eau De Parfum',
    departmentId: 'perfumes-fragrances',
    category: 'Unisex Perfumes',
    price: 2499,
    discountPrice: 1999,
    rating: 4.9,
    stock: 40
  },
  {
    id: 'prod-cb-001',
    name: 'Kumkumadi Miraculous Ayurvedic Radiance Facial Elixir',
    departmentId: 'cosmetics-beauty',
    category: 'Face Care & Ayurvedic',
    price: 1999,
    discountPrice: 1599,
    rating: 4.9,
    stock: 50
  }
];

// GET /api/products
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { department, category, search, limit = '20' } = req.query;

    if (!isSupabaseConfigured) {
      res.json({
        products: DEFAULT_PRODUCTS,
        count: DEFAULT_PRODUCTS.length
      });
      return;
    }

    let query = supabaseAdmin
      .from('products')
      .select('*, product_variants(*), product_images(*)')
      .eq('is_active', true)
      .limit(Number(limit));

    if (department && department !== 'all') {
      query = query.eq('department_id', department as string);
    }
    if (category && category !== 'all') {
      query = query.eq('category_name', category as string);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ products: data, count });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!isSupabaseConfigured) {
      const found = DEFAULT_PRODUCTS.find(p => p.id === slug || p.name.toLowerCase().includes(slug));
      res.json({ product: found || DEFAULT_PRODUCTS[0] });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, product_variants(*), product_images(*), reviews(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product: data });
  } catch (err) {
    next(err);
  }
});

export default router;
