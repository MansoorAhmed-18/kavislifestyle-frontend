import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userKey = user?.email ? user.email.toLowerCase().trim() : 'guest';
  const getStorageKey = (k: string) => `kavis_wishlist_${k}`;

  const loadWishlist = (key: string): Product[] => {
    try {
      const saved = localStorage.getItem(getStorageKey(key));
      if (saved) return JSON.parse(saved);

      // One-time migration for active test user
      if (key === 'simplysarath01@gmail.com') {
        const legacy = localStorage.getItem('kavis_wishlist_items_v2');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          localStorage.setItem(getStorageKey(key), legacy);
          localStorage.removeItem('kavis_wishlist_items_v2');
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  };

  const [wishlist, setWishlist] = useState<Product[]>(() => loadWishlist(userKey));
  const currentUserKeyRef = useRef(userKey);

  // Sync wishlist whenever user changes (login, logout, switch account)
  useEffect(() => {
    currentUserKeyRef.current = userKey;
    setWishlist(loadWishlist(userKey));
  }, [userKey]);

  const saveWishlist = (items: Product[], key: string) => {
    try {
      localStorage.setItem(getStorageKey(key), JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      const updated = exists ? prev.filter((item) => item.id !== product.id) : [...prev, product];
      saveWishlist(updated, currentUserKeyRef.current);
      return updated;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      saveWishlist(updated, currentUserKeyRef.current);
      return updated;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    saveWishlist([], currentUserKeyRef.current);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
