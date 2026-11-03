# Deployment Guide — Kavi's Lifestyle

## 1. Frontend Deployment (Vercel)
1. Push the repository to GitHub / GitLab.
2. In Vercel, click **Add New Project** and select the repository.
3. Root Directory: `client`
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_BASE_URL` (URL of your deployed backend, e.g. `https://api.kavislifestyle.com/api`)
   - `VITE_RAZORPAY_KEY_ID`

## 2. Backend Deployment (Render / Railway / AWS ECS)
Deploy the `server` directory as a persistent Node.js web service.

- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Environment Variables**:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `CLIENT_URL=https://kavislifestyle.com`
  - `PUBLIC_SITE_URL=https://kavislifestyle.com`
  - `SUPABASE_URL=...`
  - `SUPABASE_ANON_KEY=...`
  - `SUPABASE_SERVICE_ROLE_KEY=...`
  - `RAZORPAY_KEY_ID=...`
  - `RAZORPAY_KEY_SECRET=...`
  - `RAZORPAY_WEBHOOK_SECRET=...`

## 3. Custom Domain Configuration
- Main Store: `https://kavislifestyle.com` -> CNAME to Vercel
- API Endpoint: `https://api.kavislifestyle.com` -> CNAME to Node.js backend
