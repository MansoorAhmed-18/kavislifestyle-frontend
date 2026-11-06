import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

interface CartDrawerProps {
  onCheckoutClick?: () => void;
  onViewCartClick?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckoutClick, onViewCartClick }) => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingCharge,
    total,
  } = useCart();

  const { formatPrice } = useCurrency();

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#F4EDE0] stripe-cream shadow-2xl z-50 flex flex-col justify-between border-l border-[#E5D8C5]"
          >
            {/* Header: 45% Navy #14213D + Stripes */}
            <div className="p-4 bg-[#14213D] stripe-navy text-[#F4EDE0] border-b border-[#1D2D50] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF6B5B]" />
                <h2 className="font-bold text-base text-[#F4EDE0]">Your Shopping Cart</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FF6B5B] text-white shadow-xs">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#F4EDE0]/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#E5D8C5] flex items-center justify-center mb-4 text-[#14213D]/40">
                    <ShoppingBag className="w-8 h-8 text-[#FF6B5B]" />
                  </div>
                  <h3 className="font-bold text-base text-[#14213D]">Your cart is empty</h3>
                  <p className="text-xs text-[#14213D]/70 max-w-xs mt-1 mb-6">
                    Explore sarees, gourmet dry fruits, artisanal perfumes, and beauty essentials.
                  </p>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#FF6B5B] hover:bg-[#E85545] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3.5 bg-[#FAF6EE] stripe-card rounded-2xl border border-[#E5D8C5] shadow-xs"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-xl flex-shrink-0 bg-neutral-100 border border-[#E5D8C5]"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#14213D] line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#14213D]/40 hover:text-[#FF6B5B] p-0.5 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.selectedVariant && (
                          <span className="text-xs text-[#14213D]/70 font-medium block mt-0.5">
                            {item.selectedVariant.name}
                          </span>
                        )}
                        <span className="text-xs font-black text-[#14213D]">
                          {formatPrice(item.unitPrice)}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#E5D8C5] rounded-lg overflow-hidden bg-[#F4EDE0]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#E5D8C5] text-[#14213D] transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#14213D]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#E5D8C5] text-[#14213D] transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-black text-[#14213D]">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Summary and Actions */}
            {cart.length > 0 && (
              <div className="p-4 bg-[#FAF6EE] border-t border-[#E5D8C5] space-y-3">
                {/* Price Breakdown */}
                <div className="space-y-1 text-xs text-[#14213D]/80 pt-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#14213D]">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-[#14213D]">
                      {shippingCharge === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(shippingCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#14213D] pt-1.5 border-t border-[#E5D8C5]">
                    <span>Total Amount</span>
                    <span className="text-base text-[#14213D] font-black">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA (10% Coral Hero Button) */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      onCheckoutClick?.();
                    }}
                    className="w-full py-3 px-4 bg-[#FF6B5B] hover:bg-[#E85545] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-98 transition cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      onViewCartClick?.();
                    }}
                    className="w-full py-1.5 text-xs font-semibold text-[#14213D]/70 hover:text-[#14213D] text-center cursor-pointer"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
