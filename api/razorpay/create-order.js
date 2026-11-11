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
    const { amount, currency = 'INR', receipt, notes } = req.body || {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'A valid order amount is required' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live or test Razorpay credentials are configured
    const isConfigured = Boolean(
      keyId &&
      keySecret &&
      !keyId.includes('sample') &&
      !keyId.includes('placeholder') &&
      keySecret.length > 5
    );

    const amountInPaise = Math.round(Number(amount) * 100);

    if (isConfigured) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: notes || {}
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Razorpay API response error:', data);
        return res.status(response.status).json({
          error: data.error?.description || 'Razorpay order creation failed'
        });
      }

      return res.status(200).json({
        success: true,
        orderId: data.id,
        amount: data.amount,
        currency: data.currency,
        keyId,
        isMock: false
      });
    }

    // Seamless Demo / Test mode fallback
    return res.status(200).json({
      success: true,
      orderId: `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: amountInPaise,
      currency,
      keyId: keyId || 'rzp_test_sample',
      isMock: true,
      message: 'Operating in Sandbox / Test Mode. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel to activate live gateway.'
    });
  } catch (error) {
    console.error('Error in create-order handler:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
