# Administrator Setup & Dashboard Operations

## 1. Accessing the Dashboard
- The admin dashboard is accessible at `/admin`.
- In production, it requires an authenticated account with an active entry in the `admin_users` database table.

## 2. Admin Privileges Setup
1. Register on the website or create a user in Supabase Auth.
2. In Supabase SQL Editor:
```sql
INSERT INTO public.admin_users (user_id, role, is_active)
VALUES ('<YOUR_USER_UUID>', 'super_admin', true);
```

## 3. Operational Capabilities
- **Overview**: Real-time sales, order volume, revenue metrics, and low stock notifications.
- **Product Management**: View, add, edit, and deactivate products across the 4 departments.
- **Category Management**: Edit department metadata, descriptions, and category hierarchies.
- **Order Management**: Track customer shipments, update delivery tracking numbers, and view payment statuses.
