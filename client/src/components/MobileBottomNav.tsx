import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, setIsCartDrawerOpen } = useCart();

  // Hide bottom navigation in admin dashboard
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const isHomeActive = location.pathname === '/';
  const isCategoriesActive = location.pathname === '/categories';
  const isAccountActive =
    location.pathname.startsWith('/account') ||
    location.pathname.startsWith('/auth') ||
    location.pathname === '/wishlist';
  const isCartActive = location.pathname === '/cart';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F4EDE0]/98 backdrop-blur-md border-t border-[#E5D8C5] stripe-cream shadow-[0_-4px_16px_rgba(20,33,61,0.08)] px-2 py-1.5 flex items-center justify-around select-none transition-all pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      aria-label="Mobile Navigation"
    >
      {/* 1. Home Tab */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
          isHomeActive ? 'text-[#FF6B5B]' : 'text-[#14213D]/70 hover:text-[#14213D]'
        }`}
      >
        <Home
          className={`w-5 h-5 transition-transform duration-200 ${
            isHomeActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
          }`}
        />
        <span
          className={`text-[10px] mt-0.5 tracking-tight transition-all ${
            isHomeActive ? 'font-black text-[#FF6B5B]' : 'font-semibold text-[#14213D]/70'
          }`}
        >
          Home
        </span>
      </Link>

      {/* 2. Categories Tab (Split Screen Explorer) */}
      <Link
        to="/categories"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
          isCategoriesActive ? 'text-[#FF6B5B]' : 'text-[#14213D]/70 hover:text-[#14213D]'
        }`}
      >
        <LayoutGrid
          className={`w-5 h-5 transition-transform duration-200 ${
            isCategoriesActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
          }`}
        />
        <span
          className={`text-[10px] mt-0.5 tracking-tight transition-all ${
            isCategoriesActive ? 'font-black text-[#FF6B5B]' : 'font-semibold text-[#14213D]/70'
          }`}
        >
          Categories
        </span>
      </Link>

      {/* 3. Account Tab */}
      <Link
        to="/account"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
          isAccountActive ? 'text-[#FF6B5B]' : 'text-[#14213D]/70 hover:text-[#14213D]'
        }`}
      >
        <User
          className={`w-5 h-5 transition-transform duration-200 ${
            isAccountActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
          }`}
        />
        <span
          className={`text-[10px] mt-0.5 tracking-tight transition-all ${
            isAccountActive ? 'font-black text-[#FF6B5B]' : 'font-semibold text-[#14213D]/70'
          }`}
        >
          Account
        </span>
      </Link>

      {/* 4. Cart Tab with Live Badge */}
      <button
        type="button"
        onClick={() => setIsCartDrawerOpen(true)}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
          isCartActive ? 'text-[#FF6B5B]' : 'text-[#14213D]/70 hover:text-[#14213D]'
        }`}
        aria-label="Open Cart"
      >
        <div className="relative">
          <ShoppingBag
            className={`w-5 h-5 transition-transform duration-200 ${
              isCartActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
            }`}
          />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#FF6B5B] text-white text-[9px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs animate-in zoom-in-75">
              {cartCount}
            </span>
          )}
        </div>
        <span
          className={`text-[10px] mt-0.5 tracking-tight transition-all ${
            isCartActive ? 'font-black text-[#FF6B5B]' : 'font-semibold text-[#14213D]/70'
          }`}
        >
          Cart
        </span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;

