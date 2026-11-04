import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { AnnouncementBar } from '../../components/AnnouncementBar';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingCharge,
    total,
  } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFEB] text-black pb-16 md:pb-0">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between text-left">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-[#5C554E] mt-1 font-medium">
              Review your items before proceeding to checkout.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-black hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5DCD3] shadow-xs max-w-xl mx-auto my-12 space-y-4">
            <div className="w-20 h-20 bg-[#FAF6F2] text-black rounded-full flex items-center justify-center mx-auto border border-[#E5DCD3]">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-black text-black">Your Shopping Cart is Empty</h2>
            <p className="text-xs text-[#5C554E] max-w-md mx-auto">
              Discover authentic handloom sarees, premium Californian dry fruits, royal attars, and clean beauty.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-[#2A2A2A] transition"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Left Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5DCD3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C554E]">
                        {item.product.category}
                      </span>
                      <h3
                        onClick={() => navigate(`/product/${item.product.slug || item.product.id}`)}
                        className="text-sm font-bold text-black hover:underline cursor-pointer leading-snug line-clamp-1 mt-0.5"
                      >
                        {item.product.name}
                      </h3>
                      {item.selectedVariant && (
                        <span className="text-xs text-[#5C554E] font-medium block mt-0.5">
                          Variant: <strong className="text-black">{item.selectedVariant.name}</strong>
                        </span>
                      )}
                      <div className="text-xs font-black text-black mt-1">
                        {formatPrice(item.unitPrice)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-[#E5DCD3]">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E5DCD3] rounded-lg overflow-hidden bg-[#FAF6F2]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-[#E5DCD3] text-black transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-[#E5DCD3] text-black transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-black block">
                        {formatPrice(item.totalPrice)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-[#5C554E] hover:text-red-600 transition flex items-center gap-1 mt-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Column (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#E5DCD3] shadow-xs space-y-6">
              <h2 className="text-base font-black text-black pb-3 border-b border-[#E5DCD3]">
                Order Summary
              </h2>

              {/* Price Details */}
              <div className="space-y-2 text-xs text-[#5C554E] pt-2 border-t border-[#E5DCD3]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-black">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-black">
                    {shippingCharge === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(shippingCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-black pt-3 border-t border-[#E5DCD3]">
                  <span>Total Payable</span>
                  <span className="text-xl font-black text-black">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 bg-black hover:bg-[#2A2A2A] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#5C554E]">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>256-Bit SSL Encrypted Razorpay Checkout</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
