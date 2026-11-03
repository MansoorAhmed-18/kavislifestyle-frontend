# Supabase Database & Security Setup Guide

## 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create or open your project.
2. Under **Project Settings > API**, note down:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (Secret — keep confidential!)

## 2. Execute SQL Scripts
Execute the SQL files located in `/supabase/` inside the Supabase SQL Editor in the following order:

1. `schema.sql`: Creates core normalized tables, indexes, and constraints.
2. `functions.sql`: Installs `set_updated_at`, `handle_new_user`, and atomic inventory decrement functions.
3. `policies.sql`: Enables default-deny Row Level Security (RLS) and defines customer and admin permissions.
4. `seed.sql`: Seeds default store settings, initial departments, categories, and promo coupons.

## 3. Storage Buckets Setup
In Supabase Dashboard > **Storage**, create 3 public buckets:
- `product-images`
- `category-images`
- `store-assets`

Set the bucket policy to allow public read access for storefront images.

## 4. Bootstrapping Admin User
To grant administrative access to your account:
1. Register your customer account via the website or Supabase Auth.
2. Find your `id` in `auth.users` or `public.profiles`.
3. In SQL Editor, run:
```sql
INSERT INTO public.admin_users (user_id, role, is_active)
VALUES ('<YOUR_USER_UUID>', 'super_admin', true)
ON CONFLICT (user_id) DO UPDATE SET is_active = true, role = 'super_admin';
```
4. You now have full access to `/admin` and privileged backend operations.
