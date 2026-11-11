import { UserProfile, ShippingAddress } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

export interface StoredUserAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  addresses: ShippingAddress[];
}

const USERS_DB_KEY = 'kavis_users_database_v1';
export const SYS_USERS_REGISTRY_ID = 'sys-kavis-users-registry';
export const SYS_USERS_REGISTRY_ORDER = 'KV-SYS-USERS';

// Pre-seeded accounts for testing & demo
const SEED_USERS: StoredUserAccount[] = [
  {
    id: 'usr-demo-01',
    fullName: 'Priyadarshini Sundaram',
    email: 'priya@kavislifestyle.com',
    password: 'demo123456',
    phone: '+91 90953 16566',
    role: 'customer',
    createdAt: '2026-01-15T10:00:00.000Z',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Priyadarshini Sundaram',
        phone: '+91 90953 16566',
        street: '14B, Alacrity Greens, 4th Main Road',
        apartment: 'Flat 202',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600040',
        country: 'India',
        isDefault: true,
      },
    ],
  },
  {
    id: 'usr-admin-01',
    fullName: 'Kavi (Store Administrator)',
    email: 'admin@kavislifestyle.com',
    password: 'admin123456',
    phone: '+91 98400 99999',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
    addresses: [],
  },
  {
    id: 'usr-mansoor-01',
    fullName: 'Mansoor',
    email: 'simplysarath01@gmail.com',
    password: 'man@123',
    phone: '+91 90953 16566',
    role: 'customer',
    createdAt: '2026-03-01T10:00:00.000Z',
    addresses: [
      {
        id: 'addr-mansoor-1',
        fullName: 'Mansoor',
        phone: '+91 90953 16566',
        street: 'Near Railway Station, Tiruvallur Road',
        apartment: '',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600075',
        country: 'India',
        isDefault: true,
      },
    ],
  },
];

/**
 * Retrieve all registered users from persistent database storage
 */
export function getAllStoredUsers(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      // First-time setup: initialize with seed users
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Clean up any unintended demo address that may have leaked to other user accounts
      const cleaned = parsed.map((u: StoredUserAccount) => {
        if (u.email.toLowerCase().trim() === 'simplysarath01@gmail.com') {
          const nonAddr1 = (u.addresses || []).filter((a) => a.id !== 'addr-1');
          const finalAddresses = nonAddr1.length > 0 ? nonAddr1 : SEED_USERS[2].addresses;
          return { ...u, fullName: u.fullName || 'Mansoor', password: 'man@123', addresses: finalAddresses };
        }
        if (u.email.toLowerCase().trim() !== 'priya@kavislifestyle.com') {
          const filteredAddresses = (u.addresses || []).filter((a) => a.id !== 'addr-1');
          return { ...u, addresses: filteredAddresses };
        }
        return u;
      });

      // Ensure seed users exist in database
      const existingEmails = new Set(cleaned.map((u) => u.email.toLowerCase().trim()));
      const missingSeeds = SEED_USERS.filter(
        (s) => !existingEmails.has(s.email.toLowerCase().trim())
      );
      const merged = missingSeeds.length > 0 ? [...cleaned, ...missingSeeds] : cleaned;
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(merged));
      return merged;
    }
    return SEED_USERS;
  } catch (e) {
    console.error('Failed to read users database from localStorage', e);
    return SEED_USERS;
  }
}

/**
 * Find user account by email address (case-insensitive)
 */
export function findUserByEmail(email: string): StoredUserAccount | undefined {
  const users = getAllStoredUsers();
  const normalized = email.toLowerCase().trim();
  return users.find((u) => u.email.toLowerCase().trim() === normalized);
}

/**
 * Synchronize user accounts with Supabase Cloud Database (cross-device: Laptop <-> Mobile)
 */
export async function syncUsersFromCloud(): Promise<StoredUserAccount[]> {
  if (!isSupabaseConfigured) {
    return getAllStoredUsers();
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', SYS_USERS_REGISTRY_ORDER)
      .maybeSingle();

    if (error) {
      console.warn('[UserDB] Error syncing users registry from Supabase:', error.message);
      return getAllStoredUsers();
    }

    const localUsers = getAllStoredUsers();
    const map = new Map<string, StoredUserAccount>();

    // 1. Pre-seed default accounts
    SEED_USERS.forEach((su) => map.set(su.email.toLowerCase().trim(), su));

    // 2. Add users stored in Supabase Cloud
    let cloudUsersList: StoredUserAccount[] = [];
    if (data?.raw_data?.users && Array.isArray(data.raw_data.users)) {
      cloudUsersList = data.raw_data.users;
      cloudUsersList.forEach((cu) => {
        if (cu && cu.email) {
          map.set(cu.email.toLowerCase().trim(), cu);
        }
      });
    }

    // 3. Merge local users (preserve any account created offline or before sync)
    let hasLocalOnlyAccounts = false;
    localUsers.forEach((lu) => {
      if (lu && lu.email) {
        const key = lu.email.toLowerCase().trim();
        if (!map.has(key)) {
          map.set(key, lu);
          hasLocalOnlyAccounts = true;
        } else {
          const existing = map.get(key)!;
          const mergedAddresses =
            lu.addresses && lu.addresses.length > (existing.addresses?.length || 0)
              ? lu.addresses
              : (existing.addresses || lu.addresses || []);
          map.set(key, {
            ...existing,
            ...lu,
            password: lu.password || existing.password,
            addresses: mergedAddresses,
          });
        }
      }
    });

    const merged = Array.from(map.values());
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(merged));

    // If local has accounts not yet saved in cloud or cloud registry didn't exist, upsert to Supabase
    if (hasLocalOnlyAccounts || !data) {
      try {
        await supabase.from('orders').upsert(
          {
            id: SYS_USERS_REGISTRY_ID,
            order_number: SYS_USERS_REGISTRY_ORDER,
            created_at: data?.created_at || new Date().toISOString(),
            user_id: 'sys-admin',
            user_email: 'admin@kavislifestyle.com',
            guest_email: 'admin@kavislifestyle.com',
            status: 'delivered',
            subtotal: 0,
            discount_amount: 0,
            shipping_charge: 0,
            total_amount: 0,
            raw_data: {
              is_system_registry: true,
              users: merged,
              updatedAt: new Date().toISOString(),
            },
          },
          { onConflict: 'order_number' }
        );
      } catch (upsertErr) {
        console.warn('[UserDB] Failed to push merged users registry to Supabase:', upsertErr);
      }
    }

    return merged;
  } catch (err) {
    console.warn('[UserDB] syncUsersFromCloud exception:', err);
    return getAllStoredUsers();
  }
}

/**
 * Push an individual or updated user account directly into Supabase Cloud
 */
export async function pushUserToCloud(user: StoredUserAccount): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { data: row } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', SYS_USERS_REGISTRY_ORDER)
      .maybeSingle();

    const currentUsers: StoredUserAccount[] =
      row?.raw_data?.users && Array.isArray(row.raw_data.users)
        ? row.raw_data.users
        : getAllStoredUsers();

    const normalizedEmail = user.email.toLowerCase().trim();
    const filtered = currentUsers.filter((u) => u.email.toLowerCase().trim() !== normalizedEmail);
    const nextUsers = [...filtered, user];

    await supabase.from('orders').upsert(
      {
        id: SYS_USERS_REGISTRY_ID,
        order_number: SYS_USERS_REGISTRY_ORDER,
        created_at: row?.created_at || new Date().toISOString(),
        user_id: 'sys-admin',
        user_email: 'admin@kavislifestyle.com',
        guest_email: 'admin@kavislifestyle.com',
        status: 'delivered',
        subtotal: 0,
        discount_amount: 0,
        shipping_charge: 0,
        total_amount: 0,
        raw_data: {
          is_system_registry: true,
          users: nextUsers,
          updatedAt: new Date().toISOString(),
        },
      },
      { onConflict: 'order_number' }
    );
  } catch (err) {
    console.warn('[UserDB] pushUserToCloud error:', err);
  }
}

/**
 * Synchronize user accounts with shared cross-device server
 */
export async function syncUsersFromServer(): Promise<StoredUserAccount[]> {
  // First sync with Supabase Cloud so mobile and laptop are always unified
  await syncUsersFromCloud();

  const isLocalServer = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (!isLocalServer) return getAllStoredUsers();

  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        const serverUsers: StoredUserAccount[] = data.users;
        const localUsers = getAllStoredUsers();
        const map = new Map<string, StoredUserAccount>();

        serverUsers.forEach((u) => map.set(u.email.toLowerCase().trim(), u));
        localUsers.forEach((lu) => {
          const key = lu.email.toLowerCase().trim();
          if (!map.has(key)) {
            map.set(key, lu);
            // Push missing local account to shared server
            try {
              fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lu),
              }).catch(() => { });
            } catch { }
          }
        });

        const merged = Array.from(map.values());
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch {
    // Offline fallback
  }
  return getAllStoredUsers();
}

/**
 * Register and save a new user account to the database
 */
export function registerUserInDb(
  data: Omit<StoredUserAccount, 'id' | 'createdAt' | 'addresses'> & { addresses?: ShippingAddress[] }
): StoredUserAccount {
  const users = getAllStoredUsers();
  const normalizedEmail = data.email.toLowerCase().trim();

  const existing = users.find((u) => u.email.toLowerCase().trim() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newAccount: StoredUserAccount = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    fullName: data.fullName.trim(),
    email: normalizedEmail,
    password: data.password,
    phone: data.phone?.trim() || '',
    role: data.role || (normalizedEmail.includes('admin') ? 'admin' : 'customer'),
    createdAt: new Date().toISOString(),
    addresses: data.addresses || [],
  };

  const updatedUsers = [...users, newAccount];
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsers));

  // Push new user to Supabase Cloud Database for instant cross-device login
  pushUserToCloud(newAccount);

  // Push new user to shared server for local dev
  try {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAccount),
    }).catch(() => { });
  } catch { }

  return newAccount;
}

/**
 * Update an existing user in the database
 */
export function updateUserInDb(
  email: string,
  updates: Partial<Omit<StoredUserAccount, 'id' | 'email'>>
): StoredUserAccount | null {
  const users = getAllStoredUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const index = users.findIndex((u) => u.email.toLowerCase().trim() === normalizedEmail);

  if (index === -1) return null;

  const updatedAccount: StoredUserAccount = {
    ...users[index],
    ...updates,
    fullName: updates.fullName !== undefined ? updates.fullName.trim() : users[index].fullName,
    phone: updates.phone !== undefined ? updates.phone.trim() : users[index].phone,
  };

  users[index] = updatedAccount;
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

  // Push updated user to Supabase Cloud Database for cross-device availability
  pushUserToCloud(updatedAccount);

  // Push updated user to shared server
  try {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAccount),
    }).catch(() => { });
  } catch { }

  return updatedAccount;
}

