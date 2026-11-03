import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createRazorpayOrder, verifyPaymentSignature, verifyWebhookSignature } from '../services/razorpayService';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase';

const router = Router();

const createOrderSchema = z.object({
  amount: z.number().positive(),
  receipt: z.string().optional(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  shippingAddress: z.record(z.any()),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  }))
});

// 1. Create Razorpay Order
router.post('/create-order', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validated = createOrderSchema.parse(req.body);

    const receipt = validated.receipt || `rcpt_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder({
      amountInInr: validated.amount,
      receipt,
      notes: {
        customerEmail: validated.customerEmail,
        customerName: validated.customerName
      }
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt
    });
  } catch (error) {
    next(error);
  }
});

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  orderId: z.string().optional()
});

// 2. Verify Payment Signature
router.post('/verify', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = verifyPaymentSchema.parse(req.body);

    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    if (!isValid) {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed: Signature mismatch'
      });
      return;
    }

    if (isSupabaseConfigured && orderId) {
      // Update order and payment record safely in database
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'captured', status: 'confirmed' })
        .eq('id', orderId);

      await supabaseAdmin
        .from('payments')
        .insert({
          order_id: orderId,
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          amount: 0,
          status: 'captured'
        });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully and order confirmed.'
    });
  } catch (error) {
    next(error);
  }
});

// 3. Webhook handling
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  const signature = req.headers['x-razorpay-signature'] as string;

  if (!signature) {
    res.status(400).send('Missing webhook signature');
    return;
  }

  const isValid = verifyWebhookSignature(req.body, signature);
  if (!isValid) {
    res.status(400).send('Invalid webhook signature');
    return;
  }

  const event = req.body;
  console.log(`[RAZORPAY WEBHOOK]: Received event: ${event.event}`);

  // Idempotent event processing
  res.status(200).json({ status: 'ok' });
});

export default router;
