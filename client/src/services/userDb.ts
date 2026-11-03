import { UserProfile, ShippingAddress } from '../types';

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

// Pre-seeded accounts for testing & demo
const SEED_USERS: StoredUserAccount[] = [
  {
    id: 'usr-demo-01',
    fullName: 'Priyadarshini Sundaram',
    email: 'priya@kavislifestyle.com',
    password: 'demo123456',
    phone: '+91 98400 12345',
    role: 'customer',
    createdAt: '2026-01-15T10:00:00.000Z',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Priyadarshini Sundaram',
        phone: '+91 98400 12345',
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
    fullName: 'mansoor',
    email: 'simplysarath01@gmail.com',
    password: 'man@123',
    phone: '',
    role: 'customer',
    createdAt: '2026-03-01T10:00:00.000Z',
    addresses: [],
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
          return { ...u, password: 'man@123', addresses: (u.addresses || []).filter((a) => a.id !== 'addr-1') };
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
  return updatedAccount;
}

