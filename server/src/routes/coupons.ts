import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase';

const router = Router();

const validateCouponSchema = z.object({
  code: z.string().min(1),
  orderSubtotal: z.number().positive()
});

router.post('/validate', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, orderSubtotal } = validateCouponSchema.parse(req.body);
    const upperCode = code.trim().toUpperCase();

    // Default built-in coupons
    if (upperCode === 'KAVI10') {
      if (orderSubtotal < 999) {
        res.status(400).json({ error: 'Minimum order amount of ₹999 required for coupon KAVI10' });
        return;
      }
      const discount = Math.min((orderSubtotal * 10) / 100, 500);
      res.json({
        valid: true,
        code: 'KAVI10',
        discountType: 'percentage',
        discountValue: 10,
        discountAmount: discount
      });
      return;
    }

    if (upperCode === 'FESTIVE500') {
      if (orderSubtotal < 2999) {
        res.status(400).json({ error: 'Minimum order amount of ₹2,999 required for coupon FESTIVE500' });
        return;
      }
      res.json({
        valid: true,
        code: 'FESTIVE500',
        discountType: 'fixed',
        discountValue: 500,
        discountAmount: 500
      });
      return;
    }

    if (isSupabaseConfigured) {
      const { data: coupon, error } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', upperCode)
        .eq('is_active', true)
        .single();

      if (error || !coupon) {
        res.status(404).json({ error: 'Invalid or expired coupon code' });
        return;
      }

      if (orderSubtotal < coupon.min_order_value) {
        res.status(400).json({
          error: `Minimum order amount of ₹${coupon.min_order_value} required for this coupon`
        });
        return;
      }

      let discount = 0;
      if (coupon.discount_type === 'percentage') {
        const calc = (orderSubtotal * coupon.discount_value) / 100;
        discount = coupon.max_discount ? Math.min(calc, coupon.max_discount) : calc;
      } else {
        discount = coupon.discount_value;
      }

      res.json({
        valid: true,
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        discountAmount: discount
      });
      return;
    }

    res.status(404).json({ error: 'Coupon code not found' });
  } catch (err) {
    next(err);
  }
});

export default router;
