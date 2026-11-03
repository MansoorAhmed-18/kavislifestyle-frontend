import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env';

let razorpayClient: Razorpay | null = null;
if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  razorpayClient = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET
  });
}

export const isRazorpayConfigured = razorpayClient !== null;

export interface CreateOrderParams {
  amountInInr: number;
  receipt: string;
  notes?: Record<string, string>;
}

export const createRazorpayOrder = async (params: CreateOrderParams) => {
  if (!razorpayClient) throw new Error('Razorpay not configured');
  const amountInPaise = Math.round(params.amountInInr * 100);
  return await razorpayClient.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: params.receipt,
    notes: params.notes || {}
  });
};

export const verifyPaymentSignature = (params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean => {
  if (!env.RAZORPAY_KEY_SECRET) return false;
  const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf-8'),
    Buffer.from(params.razorpaySignature, 'utf-8')
  );
};

export const verifyWebhookSignature = (
  rawBody: string | Buffer,
  webhookSignature: string
): boolean => {
  if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf-8'),
    Buffer.from(webhookSignature, 'utf-8')
  );
};
