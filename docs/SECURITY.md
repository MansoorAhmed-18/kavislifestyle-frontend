# Security Architecture — Kavi's Lifestyle

## 1. Zero Trust Database Access (Supabase RLS)
- Default-deny security model enabled across all operational tables.
- Customers can only view and mutate their own profile, cart, wishlist, and orders.
- Public access is strictly restricted to active products, active categories, and public store branding.
- The Supabase `service_role` secret key is never embedded in client-side code; it resides exclusively in backend server environment variables.

## 2. Payment Security & Integrity
- Server-side order creation ensures prices and totals cannot be manipulated by client browsers.
- Payment signatures from Razorpay are verified using cryptographic `crypto.timingSafeEqual` with HMAC-SHA256, mitigating timing attacks.
- Webhooks verify cryptographic signatures with duplicate event protection for idempotent updates.

## 3. Server Hardening
- **Helmet**: Secures HTTP response headers against clickjacking, MIME sniffing, and cross-site scripting.
- **CORS**: Restricted strictly to authorized frontend origins.
- **Zod Schema Validation**: Every API payload is validated before hitting business logic.
- **Rate Limiting & Safe Error Messages**: Prevents enumeration attacks and hides internal database stack traces from production responses.
