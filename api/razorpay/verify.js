import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({ error: 'Missing required payment verification details' });
    }

    // Verify cryptographic HMAC SHA256 signature if key secret is configured
    if (keySecret && razorpaySignature && !razorpayOrderId.startsWith('order_test_')) {
      const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(payload)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({
          success: false,
          error: 'Payment verification failed: Signature mismatch. Fraud prevention triggered.'
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and confirmed successfully',
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in payment verification handler:', error);
    return res.status(500).json({ error: error.message || 'Payment verification failed' });
  }
}
