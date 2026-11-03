# Kavi's Lifestyle — Production E-Commerce Platform

> **"Everything You Love, Under One Roof."**  
> A premium Indian lifestyle shopping destination offering Women's Fashion, Gourmet Dry Fruits & Nuts, Artisanal Perfumes & Attars, and Ayurvedic Cosmetics & Beauty.

---

## 🌟 Brand & Business Highlights

Expanding from the esteemed **Kavi Boutique** heritage, Kavi's Lifestyle unifies four core lifestyle departments under one unified shopping experience:

1. **Women's Fashion**: Heritage Kanchipuram silks, breathable Chanderi cotton sarees, designer salwar suits (up to 3XL), 4-way leggings, and daily nightwear.
2. **Dry Fruits & Nuts**: King California almonds, W180 cashews, Kashmiri snow white walnuts, Afghani dates, and luxury celebration gift boxes (100g, 250g, 500g, 1kg).
3. **Perfumes & Fragrances**: Imperial Oud EDP, pure steam-distilled non-alcoholic Kannauj attars, and luxury discovery sets (30ml, 50ml, 100ml).
4. **Cosmetics & Beauty**: Authentic Kumkumadi Thailam, saffron ubtan, transfer-proof velvet lipsticks, and cold-pressed Bhringraj oils.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, React Router, Framer Motion, Three.js (interactive 3D hero emblem), Lucide React.
- **Backend**: Node.js, Express, TypeScript, REST API architecture, Zod validation, Helmet security, Morgan logging.
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS), Supabase Storage.
- **Payments**: Razorpay server-side order generation, cryptographic HMAC-SHA256 signature verification with timing-safe comparison, and webhook processing.
- **Deployment**: Vercel (Frontend) + Node.js Web Service (Backend).

---

## 📁 Repository Structure

```
kavis-lifestyle/
├── client/                     # React + Vite + TypeScript Frontend
│   ├── public/                 # Static assets, logos, and icons
│   ├── src/
│   │   ├── admin/              # Admin dashboard components
│   │   ├── components/         # Navbar, Hero, 3D Showcase, Cards, Drawer
│   │   ├── context/            # Cart, Wishlist, Currency Contexts
│   │   ├── data/               # Department & product catalogs
│   │   ├── pages/              # Home, Shop, Cart, Checkout, Wishlist
│   │   ├── services/           # Supabase client integration
│   │   ├── types/              # Comprehensive TypeScript interfaces
│   │   ├── App.tsx             # Routing & global providers
│   │   ├── index.css           # Design tokens, typography & animations
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # Zod environment & Supabase admin configs
│   │   ├── middleware/         # Auth, Admin & centralized error handling
│   │   ├── routes/             # Products, categories, payments, coupons, admin
│   │   ├── services/           # Razorpay SDK & order services
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # Server entrypoint
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/                   # Supabase Database & Security Files
│   ├── schema.sql              # Core normalized tables & constraints
│   ├── functions.sql           # Database triggers & inventory functions
│   ├── policies.sql            # Default-deny Row Level Security (RLS)
│   └── seed.sql                # Initial settings, coupons & categories
│
└── docs/                       # Project Documentation
    ├── DATABASE_SETUP.md       # Supabase setup & admin bootstrapping
    ├── RAZORPAY_SETUP.md       # Payment keys & webhook setup
    ├── DEPLOYMENT.md           # Production deployment on Vercel & Node
    ├── SECURITY.md             # RLS policies & payment encryption
    └── ADMIN_SETUP.md          # Admin portal access & management
```

---

## 🚀 Quick Start (Local Development)

### 1. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Storefront opens at: `http://localhost:5173`

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
API server runs at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

---

## 💳 Razorpay & International Checkout
- Currency Switcher supports **INR (₹)**, **USD ($)**, **AED (AED)**, and **GBP (£)**.
- Free shipping threshold automatically calculated (orders ₹999+ within India).
- Built-in test coupons:
  - `KAVI10`: 10% off on orders above ₹999.
  - `FESTIVE500`: Flat ₹500 off on festive orders above ₹2,999.
