import { Router, Response } from 'express';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase';

const router = Router();

// Protect all admin routes
router.use(requireAuth);
router.use(requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (req: AuthenticatedRequest, res: Response) => {
  if (!isSupabaseConfigured) {
    res.json({
      totalRevenue: 482650,
      totalOrders: 128,
      pendingOrders: 16,
      completedOrders: 112,
      totalCustomers: 240,
      totalProducts: 16,
      lowStockProducts: 3
    });
    return;
  }

  try {
    const { count: productCount } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true });
    const { count: orderCount } = await supabaseAdmin.from('orders').select('*', { count: 'exact', head: true });
    const { count: customerCount } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });

    res.json({
      totalProducts: productCount || 0,
      totalOrders: orderCount || 0,
      totalCustomers: customerCount || 0
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber, carrier } = req.body;

  if (!isSupabaseConfigured) {
    res.json({ success: true, message: `Order ${id} updated to ${status}` });
    return;
  }

  try {
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (orderError) throw orderError;

    if (trackingNumber) {
      await supabaseAdmin.from('shipments').upsert({
        order_id: id,
        carrier_name: carrier || 'Delivery',
        tracking_number: trackingNumber,
        status: 'in_transit'
      });
    }

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
