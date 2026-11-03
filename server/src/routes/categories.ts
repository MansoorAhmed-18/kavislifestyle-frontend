import { Router, Request, Response, NextFunction } from 'express';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase';

const router = Router();

const DEFAULT_DEPARTMENTS = [
  { id: 'womens-fashion', title: "Women's Fashion" },
  { id: 'dry-fruits-nuts', title: 'Dry Fruits & Nuts' },
  { id: 'perfumes-fragrances', title: 'Perfumes & Fragrances' },
  { id: 'cosmetics-beauty', title: 'Cosmetics & Beauty' }
];

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!isSupabaseConfigured) {
      res.json({ departments: DEFAULT_DEPARTMENTS });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    res.json({ categories: data, departments: DEFAULT_DEPARTMENTS });
  } catch (err) {
    next(err);
  }
});

export default router;
