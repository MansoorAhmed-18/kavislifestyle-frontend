import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, ProductVariant } from '../types';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string; // unique item id: `${productId}-${variantId || 'standard'}`
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  unitPrice: number;
  totalPrice: number;
}

export interface AppliedCoupon {
  code: string;
  discountPercentage?: number;
  flatDiscount?: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  total: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userKey = user?.email ? user.email.toLowerCase().trim() : 'guest';
  const getCartKey = (k: string) => `kavis_cart_${k}`;
  const getCouponKey = (k: string) => `kavis_coupon_${k}`;

  const loadCart = (key: string): CartItem[] => {
    try {
      const saved = localStorage.getItem(getCartKey(key));
      if (saved) return JSON.parse(saved);

      // One-time migration for active test user
      if (key === 'simplysarath01@gmail.com') {
        const legacy = localStorage.getItem('kavis_cart_items_v3');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          localStorage.setItem(getCartKey(key), legacy);
          localStorage.removeItem('kavis_cart_items_v3');
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  };

  const loadCoupon = (key: string): AppliedCoupon | null => {
    try {
      const saved = localStorage.getItem(getCouponKey(key));
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  };

  const [cart, setCart] = useState<CartItem[]>(() => loadCart(userKey));
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => loadCoupon(userKey));
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const currentUserKeyRef = useRef(userKey);

  // When user logs in, logs out, or switches accounts: switch to their cart & coupon
  useEffect(() => {
    currentUserKeyRef.current = userKey;
    setCart(loadCart(userKey));
    setAppliedCoupon(loadCoupon(userKey));
  }, [userKey]);

  const saveCart = (items: CartItem[], key: string) => {
    try {
      localStorage.setItem(getCartKey(key), JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  };

  const saveCoupon = (coupon: AppliedCoupon | null, key: string) => {
    try {
      if (coupon) {
        localStorage.setItem(getCouponKey(key), JSON.stringify(coupon));
      } else {
        localStorage.removeItem(getCouponKey(key));
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  };

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const unitPrice = product.discountPrice ?? product.price;
    const variantId = variant?.id || 'standard';
    const cartItemId = `${product.id}-${variantId}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      let updated: CartItem[];

      if (existingIndex > -1) {
        updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: unitPrice * newQty
        };
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          quantity,
          selectedVariant: variant,
          unitPrice,
          totalPrice: unitPrice * quantity
        };
        updated = [...prev, newItem];
      }

      saveCart(updated, currentUserKeyRef.current);
      return updated;
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== cartItemId);
      saveCart(updated, currentUserKeyRef.current);
      return updated;
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) => {
      const updated = prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          };
        }
        return item;
      });
      saveCart(updated, currentUserKeyRef.current);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    saveCart([], currentUserKeyRef.current);
    saveCoupon(null, currentUserKeyRef.current);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();

    if (normalized === 'KAVI10') {
      const coupon: AppliedCoupon = { code: 'KAVI10', discountPercentage: 10 };
      setAppliedCoupon(coupon);
      saveCoupon(coupon, currentUserKeyRef.current);
      return { success: true, message: 'Coupon KAVI10 applied! 10% discount added.' };
    }

    if (normalized === 'FESTIVE500') {
      if (subtotal < 2999) {
        return {
          success: false,
          message: 'FESTIVE500 requires a minimum order of ₹2,999.'
        };
      }
      const coupon: AppliedCoupon = { code: 'FESTIVE500', flatDiscount: 500 };
      setAppliedCoupon(coupon);
      saveCoupon(coupon, currentUserKeyRef.current);
      return { success: true, message: 'Coupon FESTIVE500 applied! ₹500 discount added.' };
    }

    if (normalized === 'WELCOME5') {
      const coupon: AppliedCoupon = { code: 'WELCOME5', discountPercentage: 5 };
      setAppliedCoupon(coupon);
      saveCoupon(coupon, currentUserKeyRef.current);
      return { success: true, message: 'Coupon WELCOME5 applied! 5% discount added.' };
    }

    return {
      success: false,
      message: 'Invalid promo code. Try KAVI10, FESTIVE500 or WELCOME5.'
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    saveCoupon(null, currentUserKeyRef.current);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercentage) {
      discount = Math.round((subtotal * appliedCoupon.discountPercentage) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discount = Math.min(appliedCoupon.flatDiscount, subtotal);
    }
  }

  // Free shipping on ₹999+ or if cart is empty
  const shippingCharge = cart.length === 0 || subtotal >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shippingCharge);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        shippingCharge,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
