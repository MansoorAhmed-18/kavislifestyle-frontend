# Razorpay Payment Integration Guide

## 1. Razorpay Account & API Keys
1. Sign in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Navigate to **Settings > API Keys**.
3. Generate your **Key ID** and **Key Secret**.
   - Test mode keys start with `rzp_test_...`
   - Live mode keys start with `rzp_live_...`

## 2. Environment Variables Configuration
In your backend `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

In your client `.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

## 3. Webhook Setup
To ensure orders are confirmed even if a customer closes their browser during payment:
1. In Razorpay Dashboard, go to **Settings > Webhooks > Add New Webhook**.
2. Webhook URL: `https://your-api-domain.com/api/payments/webhook`
3. Secret: Enter the same secret set in `RAZORPAY_WEBHOOK_SECRET`.
4. Active Events to subscribe:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
   - `refund.processed`

## 4. Verification Flow
- Payment order created server-side via `/api/payments/create-order`.
- Customer completes checkout on Razorpay.
- Frontend submits signature to `/api/payments/verify`.
- Backend validates cryptographic HMAC-SHA256 signature using `crypto.timingSafeEqual` before marking payment captured.
