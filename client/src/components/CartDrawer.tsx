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
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#F8F9FA] shadow-2xl z-50 flex flex-col justify-between border-l border-slate-200"
          >
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#114B5F]" />
                <h2 className="font-bold text-base text-slate-900">Your Shopping Cart</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-base text-slate-800">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1 mb-6">
                    Explore sarees, gourmet dry fruits, artisanal perfumes, and beauty essentials.
                  </p>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#114B5F] text-white text-xs font-semibold hover:bg-[#0D3B4C] transition shadow-xs"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-xl flex-shrink-0 bg-slate-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-500 p-0.5 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.selectedVariant && (
                          <span className="text-xs text-slate-500 font-medium block mt-0.5">
                            {item.selectedVariant.name}
                          </span>
                        )}
                        <span className="text-xs font-bold text-black">
                          {formatPrice(item.unitPrice)}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#E5DCD3] rounded-lg overflow-hidden bg-[#FAF6F2]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#E5DCD3] text-black transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#E5DCD3] text-black transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-black">
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
              <div className="p-4 bg-white border-t border-[#E5DCD3] space-y-3">
                {/* Price Breakdown */}
                <div className="space-y-1 text-xs text-[#5C554E] pt-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-black">
                      {shippingCharge === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(shippingCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-black pt-1.5 border-t border-[#E5DCD3]">
                    <span>Total Amount</span>
                    <span className="text-base text-black font-black">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      onCheckoutClick?.();
                    }}
                    className="w-full py-3 px-4 bg-black hover:bg-[#2A2A2A] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-98 transition"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      onViewCartClick?.();
                    }}
                    className="w-full py-1.5 text-xs font-semibold text-[#5C554E] hover:text-black text-center"
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
