import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  ExternalLink,
  ArrowRight,
  Star,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useOrder, useOrders } from '../context/OrderContext';
import {
  saveSearchQuery,
  getSearchHistory,
  getPersonalizedProducts,
  getPersonalizationSummary,
} from '../utils/personalization';
import { DEPARTMENTS, DepartmentInfo } from '../data/departments';
import { Product } from '../types';
import { BrandLogo } from './BrandLogo';

// Line-art Vector Icon Components matching Flipkart aesthetic with warm brand accents
const NavBagIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 11C7 9.89543 7.89543 9 9 9H23C24.1046 9 25 9.89543 25 11V25C25 26.6569 23.6569 28 22 28H10C8.34315 28 7 26.6569 7 25V11Z" />
    <path d="M12 9V7C12 4.79086 13.7909 3 16 3C18.2091 3 20 4.79086 20 7V9" />
    <path
      d="M11 15C11 17.7614 13.2386 20 16 20C18.7614 20 21 17.7614 21 15"
      fill={active ? '#E44A2D' : '#F59E0B'}
      fillOpacity={active ? '0.3' : '0.85'}
      stroke={active ? '#E44A2D' : '#D97706'}
      strokeWidth="1.5"
    />
  </svg>
);

const NavTshirtIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 5L6 9L9 12L10 11V26C10 26.5523 10.4477 27 11 27H21C21.5523 27 22 26.5523 22 26V11L23 12L26 9L22 5C20.5 6.2 18.5 7 16 7C13.5 7 11.5 6.2 10 5Z" />
    <path
      d="M10 23H22V26C22 26.5523 21.5523 27 21 27H11C10.4477 27 10 26.5523 10 26V23Z"
      fill={active ? '#E44A2D' : '#F59E0B'}
      fillOpacity={active ? '0.35' : '0.9'}
      stroke={active ? '#E44A2D' : '#D97706'}
      strokeWidth="1.4"
    />
  </svg>
);

const NavBeautyIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="11" y="16" width="10" height="12" rx="2" />
    <rect x="12.5" y="12" width="7" height="4" />
    <path
      d="M13 12L13 7.5L19 4V12H13Z"
      fill={active ? '#E44A2D' : '#F59E0B'}
      fillOpacity={active ? '0.35' : '0.9'}
      stroke={active ? '#E44A2D' : '#D97706'}
      strokeWidth="1.5"
    />
    <line x1="11" y1="20" x2="21" y2="20" strokeWidth="1.5" />
  </svg>
);

const NavPerfumeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="8" y="12" width="16" height="15" rx="3.5" />
    <rect x="13" y="8" width="6" height="4" rx="1" />
    <path d="M14 8V5C14 4.44772 14.4477 4 15 4H17C17.5523 4 18 4.44772 18 5V8" />
    <path
      d="M11 17C11 15.8954 11.8954 15 13 15H19C20.1046 15 21 15.8954 21 17V22C21 23.1046 20.1046 24 19 24H13C11.8954 24 11 23.1046 11 22V17Z"
      fill={active ? '#E44A2D' : '#F59E0B'}
      fillOpacity={active ? '0.3' : '0.85'}
      stroke={active ? '#E44A2D' : '#D97706'}
      strokeWidth="1.4"
    />
  </svg>
);

const NavDryFruitsIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 4C10 9 6 15 7 21C8 26 12 28 16 28C20 28 24 26 25 21C26 15 22 9 16 4Z" />
    <path
      d="M16 9C13 13 10 17 11 21C11.8 24.5 14 25.5 16 25.5C18 25.5 20.2 24.5 21 21C22 17 19 13 16 9Z"
      fill={active ? '#E44A2D' : '#F59E0B'}
      fillOpacity={active ? '0.3' : '0.85'}
      stroke={active ? '#E44A2D' : '#D97706'}
      strokeWidth="1.4"
    />
  </svg>
);

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { formatPrice } = useCurrency();
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const { getUserOrders, orders } = useOrder();

  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedDept, setMobileExpandedDept] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // Refs for click outside handling
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
    setIsSearchOverlayOpen(false);
    setIsSearchFocused(false);
  }, [location.pathname, location.search]);

  // Focus input when search overlay opens
  useEffect(() => {
    if (isSearchOverlayOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [isSearchOverlayOpen]);

  // Live Instant Search Filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const q = searchQuery.toLowerCase().trim();
      const matched = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
        )
        .slice(0, 6);
      setSearchResults(matched);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  // Close menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOverlayOpen(false);
        setIsSearchFocused(false);
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Helper to get exactly 4 featured products for a department (used in mobile navigation)
  const getDepartment4Products = (deptId: string): Product[] => {
    const deptProducts = products.filter((p) => p.departmentId === deptId);
    const sorted = [...deptProducts].sort((a, b) => {
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
    return sorted.slice(0, 4);
  };

  // Category navigation row items matching the minimalist line-art icon design
  const CATEGORY_NAV_ITEMS = [
    {
      id: 'for-you',
      deptId: null,
      title: 'For You',
      subtitle: 'Personalized For You',
      path: '/shop?forYou=true',
      renderIcon: (active: boolean) => <NavBagIcon active={active} />,
    },
    {
      id: 'womens-fashion',
      deptId: 'womens-fashion',
      title: 'Fashion',
      subtitle: "Women's Fashion",
      path: '/shop?dept=womens-fashion',
      renderIcon: (active: boolean) => <NavTshirtIcon active={active} />,
    },
    {
      id: 'cosmetics-beauty',
      deptId: 'cosmetics-beauty',
      title: 'Beauty',
      subtitle: 'Cosmetics & Skincare',
      path: '/shop?dept=cosmetics-beauty',
      renderIcon: (active: boolean) => <NavBeautyIcon active={active} />,
    },
    {
      id: 'perfumes-fragrances',
      deptId: 'perfumes-fragrances',
      title: 'Perfumes',
      subtitle: 'Fragrances & Attars',
      path: '/shop?dept=perfumes-fragrances',
      renderIcon: (active: boolean) => <NavPerfumeIcon active={active} />,
    },
    {
      id: 'dry-fruits-nuts',
      deptId: 'dry-fruits-nuts',
      title: 'Dry Fruits & Nuts',
      subtitle: 'Gourmet Nuts & Dates',
      path: '/shop?dept=dry-fruits-nuts',
      renderIcon: (active: boolean) => <NavDryFruitsIcon active={active} />,
    },
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      saveSearchQuery(searchQuery.trim(), user?.email);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    } else {
      navigate('/shop');
    }
  };

  const isCategoryActive = (item: typeof CATEGORY_NAV_ITEMS[0]) => {
    if (item.deptId) {
      return location.pathname === '/shop' && location.search.includes(`dept=${item.deptId}`);
    }
    return (
      location.search.includes('forYou=true') ||
      (location.pathname === '/' && !location.search.includes('dept=')) ||
      (location.pathname === '/shop' && !location.search.includes('dept='))
    );
  };

  return (
    <>
      {/* Calm & Simple Unified Navigation Header */}
      <header
        ref={navContainerRef}
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5DCD3] transition-all shadow-xs"
      >
        {/* ========================================================= */}
        {/* LINE 1: LOGO + WIDE PROMINENT SEARCH + PROFILE & CART     */}
        {/* ========================================================= */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] sm:h-[74px] gap-2 sm:gap-4">
            
            {/* Left: Mobile Hamburger Toggle */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 -ml-1 rounded-xl text-neutral-800 hover:bg-[#FAF6F2] transition"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Left: Brand Logo */}
            <Link to="/" className="flex items-center group shrink-0">
              <BrandLogo variant="full" theme="dark" size="sm" />
            </Link>

            {/* Center: Prominent Search Bar (Flipkart style) */}
            <form
              onSubmit={handleSearchSubmit}
              ref={searchContainerRef}
              className="relative flex-1 max-w-xl lg:max-w-2xl mx-1 sm:mx-4"
            >
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-[#786F66]">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#E44A2D]" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for Products, Sarees, Dry Fruits, Perfumes and More..."
                  className="w-full pl-9 sm:pl-11 pr-20 sm:pr-24 py-2 sm:py-2.5 bg-[#FAF6F2] hover:bg-white focus:bg-white text-xs sm:text-sm font-medium text-black placeholder:text-[#8C827A] rounded-xl border border-[#D8CFC5] focus:border-[#E44A2D] focus:ring-2 focus:ring-[#E44A2D]/20 outline-none transition-all shadow-2xs"
                />
                <div className="absolute right-1.5 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full text-[#786F66] hover:text-black hover:bg-neutral-100 transition"
                      aria-label="Clear Search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-2.5 sm:px-3.5 py-1.5 bg-[#E44A2D] hover:bg-[#cc3d22] text-white rounded-lg text-xs font-bold transition shadow-2xs flex items-center gap-1"
                    aria-label="Submit Search"
                  >
                    <span className="hidden sm:inline">Search</span>
                    <Search className="w-3.5 h-3.5 sm:hidden" />
                  </button>
                </div>
              </div>

              {/* Instant Live Dropdown Suggestions */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5DCD3] z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2">
                  {/* When no query is typed: Popular Tags */}
                  {!searchQuery.trim() && (
                    <div className="p-4 bg-[#FAF6F2]/70">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#786F66] block mb-2">
                        Popular Searches
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Pure Silk Sarees', 'California Almonds', 'Rose Attar', 'Kumkumadi Oil', 'Chanderi Cotton', 'W180 Cashews'].map((kw) => (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => {
                              setSearchQuery(kw);
                              saveSearchQuery(kw, user?.email);
                              navigate(`/shop?search=${encodeURIComponent(kw)}`);
                              setIsSearchFocused(false);
                            }}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-[#E44A2D] hover:text-white transition border border-[#E5DCD3] shadow-2xs"
                          >
                            {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* When query is typed: Matching Products */}
                  {searchQuery.trim() && (
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E5DCD3]/60">
                      {searchResults.length > 0 ? (
                        <>
                          <div className="px-4 py-2 bg-[#FAF6F2] text-[11px] font-bold text-[#786F66] flex items-center justify-between">
                            <span>Matching Products ({searchResults.length})</span>
                            <span className="text-[10px] text-[#786F66] font-normal">Press Enter to see all</span>
                          </div>
                          {searchResults.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setIsSearchFocused(false);
                                saveSearchQuery(item.name, user?.email);
                                navigate(`/product/${item.slug || item.id}`);
                              }}
                              className="p-3 flex items-center gap-3 hover:bg-[#FAF6F2] cursor-pointer transition"
                            >
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 bg-neutral-100 border border-[#E5DCD3]"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-black truncate">
                                  {item.name}
                                </div>
                                <div className="text-[11px] text-[#5C554E] mt-0.5">
                                  {item.category} • <span className="font-bold text-black">{formatPrice(item.discountPrice ?? item.price)}</span>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-[#786F66]" />
                            </div>
                          ))}
                          <div className="p-2.5 bg-[#FAF6F2] text-center border-t border-[#E5DCD3]">
                            <button
                              type="button"
                              onClick={() => {
                                setIsSearchFocused(false);
                                saveSearchQuery(searchQuery, user?.email);
                                navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                              }}
                              className="text-xs font-bold text-[#E44A2D] hover:underline"
                            >
                              View all results for "{searchQuery}" in catalog →
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-6 text-center text-xs text-[#786F66]">
                          No products found matching "<strong className="text-black">{searchQuery}</strong>". Press Enter to browse all.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Right: Profile & Cart Action Buttons */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              
              {/* User Account Popover */}
              <div ref={accountRef} className="relative">
                {user ? (
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-neutral-800 hover:bg-[#FAF6F2] rounded-xl border border-[#E5DCD3] hover:border-[#E44A2D] transition"
                    aria-label="Account Menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#E44A2D] text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-bold text-black hidden sm:inline max-w-[90px] truncate">
                      {user.fullName ? user.fullName.split(' ')[0] : 'Account'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#786F66]" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-black hover:bg-[#FAF6F2] rounded-xl border border-[#E5DCD3] hover:border-[#E44A2D] shadow-2xs transition"
                    aria-label="Login Menu"
                  >
                    <User className="w-4 h-4 text-[#E44A2D]" />
                    <span>Login</span>
                    <ChevronDown className="w-3 h-3 text-[#786F66]" />
                  </button>
                )}

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E5DCD3] py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                    {user ? (
                      <>
                        <div className="px-4 py-2.5 border-b border-[#E5DCD3]/60 bg-[#FAF6F2]">
                          <span className="text-[10px] uppercase font-bold text-[#786F66] block tracking-wider">
                            Signed in as
                          </span>
                          <span className="text-xs font-bold text-black truncate block mt-0.5">
                            {user.fullName || user.email}
                          </span>
                        </div>

                        <Link
                          to="/account"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-[#FAF6F2] transition"
                        >
                          My Account & Profile
                        </Link>

                        <Link
                          to="/account?tab=orders"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-[#FAF6F2] transition"
                        >
                          Orders & Live Tracking
                        </Link>

                        <Link
                          to="/account?tab=notifications"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-[#FAF6F2] transition"
                        >
                          <span>Notifications</span>
                          <span className="text-[10px] text-[#786F66]">Order updates</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-[#FAF6F2] transition"
                        >
                          <span>My Wishlist</span>
                          <span className="bg-[#FAF6F2] border border-[#E5DCD3] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {wishlistCount}
                          </span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            setIsCartDrawerOpen(true);
                          }}
                          className="w-full text-left flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-[#FAF6F2] transition"
                        >
                          <span>Cart</span>
                          <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {cartCount}
                          </span>
                        </button>

                        <div className="border-t border-[#E5DCD3]/60 my-1 pt-1">
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-2 text-xs font-bold text-black hover:bg-[#FAF6F2] transition"
                            >
                              <span>Admin Portal</span>
                              <ExternalLink className="w-3 h-3 text-black" />
                            </Link>
                          )}
                          <button
                            onClick={async () => {
                              setIsAccountMenuOpen(false);
                              await logout();
                              navigate('/auth/login');
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-xs text-[#786F66]">
                          Welcome to Kavi's Lifestyle
                        </div>
                        <Link
                          to="/auth/login"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2.5 text-xs font-bold text-black hover:bg-[#FAF6F2] transition"
                        >
                          Customer Sign In
                        </Link>
                        <Link
                          to="/auth/register"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2.5 text-xs font-semibold text-[#5C554E] hover:bg-[#FAF6F2] transition"
                        >
                          Create New Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/*   Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 text-neutral-800 hover:text-black hover:bg-[#FAF6F2] rounded-xl border border-transparent hover:border-[#E5DCD3] transition"
                aria-label="Open Cart"
                title="Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-neutral-800" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#E44A2D] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-xs font-bold text-neutral-800">
                  Cart
                </span>
              </button>

            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LINE 2: CATEGORY ROW MATCHING MINIMALIST 2ND SCREENSHOT   */}
        {/* ========================================================= */}
        <div className="bg-white border-t border-[#E5DCD3]/80 pt-2 pb-2.5 sm:pt-2.5 sm:pb-3 px-3 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-6 sm:gap-10 md:gap-16 min-w-max sm:min-w-0">
            {CATEGORY_NAV_ITEMS.map((item) => {
              const active = isCategoryActive(item);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="group flex flex-col items-center justify-center py-1 px-2.5 sm:px-3 rounded-xl transition-all relative shrink-0"
                >
                  {/* Line-Art Icon Container in Squircle (Active: Soft Red Tint) */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-1 mb-1 transition-all duration-200 relative flex items-center justify-center ${
                      active
                        ? 'bg-[#FEEAE5] text-[#E44A2D] shadow-xs'
                        : 'bg-transparent text-neutral-800 hover:bg-[#FAF6F2] hover:text-[#E44A2D]'
                    }`}
                  >
                    {item.renderIcon(active)}
                  </div>

                  {/* Category Title Label */}
                  <span
                    className={`text-[11px] sm:text-xs tracking-tight whitespace-nowrap transition-colors ${
                      active
                        ? 'font-black text-[#E44A2D]'
                        : 'font-bold text-neutral-700 group-hover:text-black'
                    }`}
                  >
                    {item.title}
                  </span>

                  {/* Solid Underline Bar Indicator directly underneath the active category */}
                  {active && (
                    <span className="absolute -bottom-1.5 sm:-bottom-2 left-1.5 right-1.5 h-[3.5px] bg-[#E44A2D] rounded-full shadow-2xs" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* CALM FULL-SCREEN / EXPANDABLE SEARCH OVERLAY              */}
      {/* ========================================================= */}
      {isSearchOverlayOpen && (
        <div
          ref={searchOverlayRef}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4 transition-opacity animate-in fade-in"
          onClick={(e) => {
            if (e.target === searchOverlayRef.current) {
              setIsSearchOverlayOpen(false);
            }
          }}
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E5DCD3] overflow-hidden text-left animate-in slide-in-from-top-4 duration-200">
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-[#E5DCD3]">
              <Search className="w-5 h-5 text-[#786F66] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Silk Sarees, Almonds, Attar, Kumkumadi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm sm:text-base font-medium outline-none bg-transparent text-black placeholder:text-[#9E9285]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-[#786F66] hover:text-black px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsSearchOverlayOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF6F2] text-neutral-600 hover:text-black transition"
                aria-label="Close Search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Keyword Suggestions if no search query */}
            {!searchQuery.trim() && (
              <div className="p-5 bg-[#FAF6F2]/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#786F66] block mb-2.5">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Kanchipuram Silk', 'California Almonds', 'Rose Attar', 'Kumkumadi Oil', 'Chanderi Cotton', 'Bridal Sarees'].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => setSearchQuery(kw)}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-white hover:bg-black hover:text-white transition border border-[#E5DCD3]"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Search Results */}
            {searchQuery.trim() && (
              <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#E5DCD3]/60">
                {searchResults.length > 0 ? (
                  <>
                    <div className="p-3 bg-[#FAF6F2] text-xs font-bold text-black flex items-center justify-between">
                      <span>Matching Products ({searchResults.length})</span>
                      <span className="text-[11px] text-[#786F66] font-normal">Press Enter or click to view</span>
                    </div>
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setIsSearchOverlayOpen(false);
                          navigate(`/product/${item.slug || item.id}`);
                        }}
                        className="p-3.5 flex items-center gap-3.5 hover:bg-[#FAF6F2] cursor-pointer transition"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-12 h-14 rounded-lg object-cover shrink-0 bg-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-black truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-[#5C554E] mt-0.5">
                            {item.category} • {formatPrice(item.discountPrice ?? item.price)}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#786F66]" />
                      </div>
                    ))}
                    <div className="p-3 bg-[#FAF6F2] text-center border-t border-[#E5DCD3]">
                      <Link
                        to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setIsSearchOverlayOpen(false)}
                        className="text-xs font-bold text-black hover:underline"
                      >
                        View all results in Catalog →
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-xs text-[#786F66]">
                    No products found matching "<strong className="text-black">{searchQuery}</strong>". Try another keyword.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CALM MOBILE NAVIGATION DRAWER                             */}
      {/* ========================================================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-start">
          <div className="w-[85%] max-w-sm h-full bg-[#FAF6F2] text-black shadow-2xl flex flex-col overflow-y-auto text-left animate-in slide-in-from-left duration-200">
            {/* Mobile Header */}
            <div className="p-4 flex items-center justify-between border-b border-[#E5DCD3] bg-white">
              <BrandLogo variant="full" theme="dark" size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-neutral-800 hover:bg-[#FAF6F2]"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search Pill */}
            <div className="p-4 border-b border-[#E5DCD3]/60 bg-white">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOverlayOpen(true);
                }}
                className="w-full py-2.5 px-3.5 bg-[#FAF6F2] rounded-full border border-[#E5DCD3] flex items-center gap-2.5 text-xs text-[#786F66]"
              >
                <Search className="w-4 h-4 text-[#786F66]" />
                <span>Search Sarees, Almonds, Perfumes...</span>
              </button>
            </div>

            {/* Accordion List with 4 Products per Department */}
            <div className="flex-1 py-3 px-3 space-y-1">
              <span className="text-[10px] font-bold text-[#786F66] uppercase tracking-wider px-3 block mb-1">
                Shop By Department
              </span>

              {DEPARTMENTS.map((dept) => {
                const isExpanded = mobileExpandedDept === dept.id;
                const fourProducts = getDepartment4Products(dept.id);

                return (
                  <div key={dept.id} className="rounded-xl overflow-hidden bg-white border border-[#E5DCD3]/70">
                    <button
                      onClick={() => setMobileExpandedDept(isExpanded ? null : dept.id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-black"
                    >
                      <span>{dept.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-black' : 'text-[#786F66]'
                        }`}
                      />
                    </button>

                    {/* Expandable 4-Products Horizontal Track on Mobile */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-[#E5DCD3]/50 bg-[#FAF6F2]">
                        <p className="text-[11px] text-[#5C554E] mb-2.5">
                          {dept.tagline}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {fourProducts.map((p) => (
                            <Link
                              key={p.id}
                              to={`/product/${p.slug || p.id}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="bg-white p-2 rounded-xl border border-[#E5DCD3] flex flex-col"
                            >
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="aspect-square w-full rounded-lg object-cover mb-1.5"
                              />
                              <span className="text-[10px] font-bold text-black line-clamp-1">
                                {p.name}
                              </span>
                              <span className="text-[10px] font-extrabold text-neutral-800 mt-auto">
                                {formatPrice(p.discountPrice ?? p.price)}
                              </span>
                            </Link>
                          ))}
                        </div>

                        <Link
                          to={`/shop?dept=${dept.id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-center py-2 bg-black text-white rounded-xl text-[11px] font-bold"
                        >
                          View All in {dept.title} →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* All Collections Link */}
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl bg-white border border-[#E5DCD3]/70 text-xs font-bold text-black"
              >
                All Collections Catalog →
              </Link>
            </div>

            {/* Mobile Footer Links */}
            <div className="p-4 border-t border-[#E5DCD3] bg-white space-y-2 text-xs">
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-1.5 font-semibold text-neutral-800"
              >
                <span>Wishlist</span>
                <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              </Link>
              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 font-semibold text-neutral-800"
                  >
                    My Account & Orders ({user.fullName ? user.fullName.split(' ')[0] : 'Profile'})
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1.5 font-black text-black"
                    >
                      Admin Portal
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await logout();
                      navigate('/auth/login');
                    }}
                    className="w-full text-left py-1.5 font-semibold text-red-600 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="pt-1 flex items-center gap-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 bg-black text-white rounded-xl font-bold text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 bg-[#FAF6F2] hover:bg-white border border-[#E5DCD3] text-black rounded-xl font-bold text-xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
