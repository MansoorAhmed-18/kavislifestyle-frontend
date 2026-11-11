import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ShippingAddress } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import {
  findUserByEmail,
  registerUserInDb,
  updateUserInDb,
  syncUsersFromServer,
  syncUsersFromCloud,
  pushUserToCloud,
  StoredUserAccount,
} from '../services/userDb';
import { validateEmail, validatePhone, sanitizeEmailInput, sanitizePhoneInput } from '../utils/validation';

interface AuthContextType {
  user: UserProfile | null;
  addresses: ShippingAddress[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  signup: (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile> & { newPassword?: string }) => { success: boolean; message?: string };
  addAddress: (address: Omit<ShippingAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  loginAsAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // New visitor defaults to null (unauthenticated). Session is persisted in localStorage.
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kavis_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Addresses are strictly tied to the active user profile
  const [addresses, setAddresses] = useState<ShippingAddress[]>(() => {
    try {
      const savedUser = localStorage.getItem('kavis_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.email) {
          const dbAccount = findUserByEmail(parsedUser.email);
          return dbAccount?.addresses || [];
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Synchronize users from server across devices (Laptop <-> Mobile)
  useEffect(() => {
    syncUsersFromCloud();
    syncUsersFromServer();

    const handleFocus = () => {
      syncUsersFromCloud();
      syncUsersFromServer();
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleFocus);
    };
  }, []);

  // Sync active user session & load that user's addresses
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem('kavis_user', JSON.stringify(user));
      const dbAccount = findUserByEmail(user.email);
      setAddresses(dbAccount?.addresses || []);
    } else {
      localStorage.removeItem('kavis_user');
      localStorage.removeItem('kavis_addresses');
      setAddresses([]);
    }
  }, [user]);

  /**
   * Log in an existing user:
   * Validates email exists and password matches exact registered account password
   */
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();

    try {
      if (!cleanEmail) {
        setIsLoading(false);
        return { success: false, message: 'Please enter your email address.' };
      }
      if (!cleanEmail.endsWith('@kavislifestyle.com')) {
        const emailCheck = validateEmail(cleanEmail);
        if (!emailCheck.isValid) {
          setIsLoading(false);
          return { success: false, message: emailCheck.message };
        }
      }
      if (!password) {
        setIsLoading(false);
        return { success: false, message: 'Please enter your account password.' };
      }

      // 1. Sync users from cloud first to ensure latest accounts across mobile and laptop
      await syncUsersFromCloud();
      await syncUsersFromServer();

      // 2. Validate against persistent database storage
      let existingAccount = findUserByEmail(cleanEmail);

      if (existingAccount) {
        // Verify exact password match (trimmed)
        if (existingAccount.password.trim() !== password.trim()) {
          setIsLoading(false);
          return {
            success: false,
            message: 'Incorrect password. Please enter the correct password for your account.',
          };
        }

        // Credentials verified successfully
        const profile: UserProfile = {
          id: existingAccount.id,
          email: existingAccount.email,
          fullName: existingAccount.fullName,
          phone: existingAccount.phone || '',
          role: existingAccount.role,
          createdAt: existingAccount.createdAt,
        };

        setUser(profile);

        // Restore user's saved addresses from database
        if (existingAccount.addresses && existingAccount.addresses.length > 0) {
          setAddresses(existingAccount.addresses);
        }

        setIsLoading(false);
        return { success: true };
      }

      // 3. Fallback: Try Supabase Auth if account was created directly via Supabase Auth
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password.trim(),
          });

          if (!error && data?.user) {
            const profile: UserProfile = {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              fullName: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
              phone: data.user.phone || '',
              role: cleanEmail.includes('admin') ? 'admin' : 'customer',
              createdAt: data.user.created_at,
            };
            setUser(profile);
            setIsLoading(false);
            return { success: true };
          }
        } catch (sbErr) {
          // Fall through
        }
      }

      setIsLoading(false);
      return {
        success: false,
        message: 'No account found with this email. Please check your email or sign up.',
      };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Login failed. Please try again.' };
    }
  };

  /**
   * Register a new user:
   * Validates unique email, saves credentials to database & starts browser session
   */
  const signup = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName.trim();
    const cleanPhone = phone?.trim() || '';

    try {
      if (!cleanName) {
        setIsLoading(false);
        return { success: false, message: 'Please enter your full name.' };
      }
      const emailCheck = validateEmail(cleanEmail);
      if (!emailCheck.isValid) {
        setIsLoading(false);
        return { success: false, message: emailCheck.message };
      }
      if (cleanPhone) {
        const phoneCheck = validatePhone(cleanPhone, true);
        if (!phoneCheck.isValid) {
          setIsLoading(false);
          return { success: false, message: phoneCheck.message };
        }
      }
      if (!password || password.length < 6) {
        setIsLoading(false);
        return { success: false, message: 'Password must be at least 6 characters long.' };
      }

      // 1. Sync latest users from cloud first
      await syncUsersFromCloud();

      // Check if email already registered in database
      const existing = findUserByEmail(cleanEmail);
      if (existing) {
        setIsLoading(false);
        return {
          success: false,
          message: 'An account with this email already exists. Please sign in instead.',
        };
      }

      // 2. Save new account to persistent user database
      const savedAccount = registerUserInDb({
        fullName: cleanName,
        email: cleanEmail,
        password: password.trim(),
        phone: cleanPhone,
        role: cleanEmail.includes('admin') ? 'admin' : 'customer',
      });

      // 3. Ensure pushed to Supabase Cloud
      await pushUserToCloud(savedAccount);

      // 4. Non-blocking attempt with Supabase Auth
      if (isSupabaseConfigured) {
        try {
          supabase.auth.signUp({
            email: cleanEmail,
            password: password.trim(),
            options: {
              data: { full_name: cleanName, phone: cleanPhone },
            },
          }).catch(() => {});
        } catch {}
      }

      // 5. Set active user session
      const profile: UserProfile = {
        id: savedAccount.id,
        email: savedAccount.email,
        fullName: savedAccount.fullName,
        phone: savedAccount.phone || '',
        role: savedAccount.role,
        createdAt: savedAccount.createdAt,
      };

      setUser(profile);
      setAddresses([]);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Registration failed. Please try again.' };
    }
  };

  /**
   * Log out active session from browser
   */
  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Supabase signOut error', e);
      }
    }
    setUser(null);
    setAddresses([]);
    localStorage.removeItem('kavis_user');
    localStorage.removeItem('kavis_addresses');
    localStorage.removeItem('kavis_delivery_location');
    localStorage.removeItem('kavis_delivery_loc_guest');
  };

  /**
   * Update profile details and optional new password
   */
  const updateProfile = (data: Partial<UserProfile> & { newPassword?: string }): { success: boolean; message?: string } => {
    if (!user) return { success: false, message: 'Not logged in.' };

    if (data.phone) {
      const phoneCheck = validatePhone(data.phone, true);
      if (!phoneCheck.isValid) {
        return { success: false, message: phoneCheck.message };
      }
    }

    const updatedUser: UserProfile = {
      ...user,
      fullName: data.fullName !== undefined ? data.fullName.trim() : user.fullName,
      phone: data.phone !== undefined ? sanitizePhoneInput(data.phone) : user.phone,
    };

    setUser(updatedUser);

    const dbUpdates: Partial<Omit<StoredUserAccount, 'id' | 'email'>> = {
      fullName: updatedUser.fullName,
      phone: updatedUser.phone,
    };

    if (data.newPassword && data.newPassword.length >= 6) {
      dbUpdates.password = data.newPassword;
    }

    updateUserInDb(user.email, dbUpdates);
    return { success: true, message: 'Profile updated successfully.' };
  };

  /**
   * Shipping address management (persisted per-user in database)
   */
  const addAddress = (newAddr: Omit<ShippingAddress, 'id'>) => {
    if (!user?.email) return;
    const id = `addr-${Date.now()}`;
    const isFirst = addresses.length === 0;
    const addrWithId: ShippingAddress = {
      ...newAddr,
      id,
      isDefault: Boolean(isFirst || newAddr.isDefault),
    };
    const updated = addrWithId.isDefault
      ? addresses.map((a) => ({ ...a, isDefault: false })).concat(addrWithId)
      : [...addresses, addrWithId];

    setAddresses(updated);
    updateUserInDb(user.email, { addresses: updated });
  };

  const removeAddress = (id: string) => {
    if (!user?.email) return;
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    updateUserInDb(user.email, { addresses: updated });
  };

  const setDefaultAddress = (id: string) => {
    if (!user?.email) return;
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    updateUserInDb(user.email, { addresses: updated });
  };

  /**
   * Quick admin login helper
   */
  const loginAsAdmin = () => {
    const adminAccount = findUserByEmail('admin@kavislifestyle.com');
    if (adminAccount) {
      const adminUser: UserProfile = {
        id: adminAccount.id,
        email: adminAccount.email,
        fullName: adminAccount.fullName,
        phone: adminAccount.phone || '',
        role: 'admin',
        createdAt: adminAccount.createdAt,
      };
      setUser(adminUser);
      setAddresses(adminAccount.addresses || []);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        addresses,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        setDefaultAddress,
        loginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
