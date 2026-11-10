import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();
const dbPath = path.resolve(__dirname, '../../../orders-db.json');

const readOrders = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read orders-db.json in server', e);
  }
  return [];
};

const writeOrders = (orders: any[]) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write orders-db.json in server', e);
  }
};

// GET /api/orders
router.get('/', (req: Request, res: Response) => {
  const orders = readOrders();
  res.json({ success: true, orders });
});

// POST /api/orders
router.post('/', (req: Request, res: Response) => {
  try {
    const newOrder = req.body;
    const orders = readOrders();
    const existingIdx = orders.findIndex((o: any) => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber);
    let nextOrders;
    if (existingIdx >= 0) {
      nextOrders = orders.map((o: any, idx: number) => (idx === existingIdx ? { ...o, ...newOrder } : o));
    } else {
      nextOrders = [newOrder, ...orders];
    }
    writeOrders(nextOrders);
    res.json({ success: true, order: newOrder, orders: nextOrders });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/orders/status or PUT /api/orders/:id/status
router.post('/status', (req: Request, res: Response) => {
  try {
    const { orderId, status, carrier, trackingNumber } = req.body;
    const orders = readOrders();
    let updatedOrder = null;
    const nextOrders = orders.map((o: any) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        updatedOrder = {
          ...o,
          status: status || o.status,
          carrier: carrier || o.carrier,
          trackingNumber: trackingNumber || o.trackingNumber,
          updatedAt: new Date().toISOString()
        };
        return updatedOrder;
      }
      return o;
    });

    writeOrders(nextOrders);
    res.json({ success: true, order: updatedOrder, orders: nextOrders });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/orders/return - Customer submits return request with defect verification video
router.post('/return', (req: Request, res: Response) => {
  try {
    const { orderId, returnRequest } = req.body;
    const orders = readOrders();
    let updatedOrder = null;
    const nextOrders = orders.map((o: any) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        updatedOrder = {
          ...o,
          returnRequest,
          updatedAt: new Date().toISOString()
        };
        return updatedOrder;
      }
      return o;
    });

    writeOrders(nextOrders);
    res.json({ success: true, order: updatedOrder, orders: nextOrders });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/orders/return/approve - Admin approves return & refund
router.post('/return/approve', (req: Request, res: Response) => {
  try {
    const { orderId, refundAmount, remarks } = req.body;
    const orders = readOrders();
    let updatedOrder = null;
    const nextOrders = orders.map((o: any) => {
      if ((o.id === orderId || o.orderNumber === orderId) && o.returnRequest) {
        updatedOrder = {
          ...o,
          returnRequest: {
            ...o.returnRequest,
            status: 'approved',
            refundAmount: refundAmount || o.returnRequest.refundAmount || o.total,
            adminRemarks: remarks || 'Return verified and refund approved by Store Administrator.',
            reviewedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
        return updatedOrder;
      }
      return o;
    });

    writeOrders(nextOrders);
    res.json({ success: true, order: updatedOrder, orders: nextOrders });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/orders/return/reject - Admin declines return
router.post('/return/reject', (req: Request, res: Response) => {
  try {
    const { orderId, remarks } = req.body;
    const orders = readOrders();
    let updatedOrder = null;
    const nextOrders = orders.map((o: any) => {
      if ((o.id === orderId || o.orderNumber === orderId) && o.returnRequest) {
        updatedOrder = {
          ...o,
          returnRequest: {
            ...o.returnRequest,
            status: 'rejected',
            adminRemarks: remarks || 'Return declined after product inspection.',
            reviewedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
        return updatedOrder;
      }
      return o;
    });

    writeOrders(nextOrders);
    res.json({ success: true, order: updatedOrder, orders: nextOrders });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id/status', (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const { status, carrier, trackingNumber } = req.body;
    const orders = readOrders();
    let updatedOrder = null;
    const nextOrders = orders.map((o: any) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        updatedOrder = {
          ...o,
          status: status || o.status,
          carrier: carrier || o.carrier,
          trackingNumber: trackingNumber || o.trackingNumber,
          updatedAt: new Date().toISOString()
        };
        return updatedOrder;
      }
      return o;
    });

    writeOrders(nextOrders);
    res.json({ success: true, order: updatedOrder, orders: nextOrders });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

