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
import { DeliveryLocationBar } from './DeliveryLocationModal';

// Vector Icon Components matching Flipkart aesthetic with warm brand accents
const HighlightText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <span>{text}</span>;
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return <span>{text}</span>;

  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        const isMatch = tokens.some((t) => t.toLowerCase() === part.toLowerCase());
        return isMatch ? (
          <mark
            key={i}
            className="bg-[#FEEAE5] text-[#E44A2D] font-extrabold px-0.5 rounded-xs not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
};

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

  // Refs for click outside handling across desktop, mobile and overlay
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const overlaySearchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
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
      setTimeout(() => overlaySearchInputRef.current?.focus(), 80);
    }
  }, [isSearchOverlayOpen]);

  // Synchronous Instant Predictive Search Matching (0ms lag, prefix and token matching)
  const instantProductMatches = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);

    const scored = products
      .map((product) => {
        const name = product.name.toLowerCase();
        const cat = product.category.toLowerCase();
        const sub = (product.subcategory || '').toLowerCase();
        const brand = (product.brand || '').toLowerCase();
        const desc = (product.shortDescription || product.description || '').toLowerCase();
        const attrs = Object.values(product.attributes || {}).join(' ').toLowerCase();
        const sku = (product.sku || '').toLowerCase();
        const searchBlob = `${name} ${cat} ${sub} ${brand} ${desc} ${attrs} ${sku}`;

        // Every token must match somewhere in searchBlob
        const matchesAllTokens = tokens.every((token) => searchBlob.includes(token));
        if (!matchesAllTokens) return null;

        // Relevance Scoring
        let score = 0;
        if (name.startsWith(q)) score += 1000;
        else if (name.includes(q)) score += 600;

        // Token bonuses for word boundary matching
        for (const token of tokens) {
          if (name.split(/\s+/).some((w) => w.startsWith(token))) score += 200;
          if (sub.split(/\s+/).some((w) => w.startsWith(token))) score += 120;
          if (cat.split(/\s+/).some((w) => w.startsWith(token))) score += 90;
          if (brand.split(/\s+/).some((w) => w.startsWith(token))) score += 80;
          if (attrs.includes(token)) score += 60;
        }

        if (product.isBestSeller) score += 35;
        if (product.isFeatured) score += 25;

        return { product, score };
      })
      .filter((item): item is { product: Product; score: number } => item !== null)
      .sort((a, b) => b.score - a.score);

    return scored.map((s) => s.product);
  }, [searchQuery, products]);

  // Matching Categories / Departments for search query
  const instantCategoryMatches = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    const matches: { id: string; title: string; deptId: string; count: number }[] = [];

    for (const dept of DEPARTMENTS) {
      if (
        dept.title.toLowerCase().includes(q) ||
        dept.id.toLowerCase().includes(q) ||
        dept.featuredCategorySlugs.some((c) => c.toLowerCase().includes(q)) ||
        dept.subtitle.toLowerCase().includes(q)
      ) {
        const count = products.filter((p) => p.departmentId === dept.id).length;
        matches.push({
          id: dept.id,
          title: dept.title,
          deptId: dept.id,
          count,
        });
      }
    }

    const categories = Array.from(new Set(products.map((p) => p.category)));
    for (const cat of categories) {
      if (cat.toLowerCase().includes(q) && !matches.some((m) => m.title === cat)) {
        const count = products.filter((p) => p.category === cat).length;
        const deptId = products.find((p) => p.category === cat)?.departmentId || 'womens-fashion';
        matches.push({
          id: `cat-${cat}`,
          title: cat,
          deptId,
          count,
        });
      }
    }

    return matches.slice(0, 3);
  }, [searchQuery, products]);

  // Close menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setIsAccountMenuOpen(false);
      }
      const inDesktop = desktopSearchContainerRef.current?.contains(target);
      const inMobile = mobileSearchContainerRef.current?.contains(target);
      if (!inDesktop && !inMobile) {
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

  // Unified Predictive Search Dropdown for Desktop and Mobile
  const renderSearchDropdown = (isMobile: boolean) => {
    if (!isSearchFocused) return null;

    return (
      <div
        className={`absolute top-full left-0 right-0 mt-1.5 sm:mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5DCD3] z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 flex flex-col ${
          isMobile ? 'max-h-[70vh]' : 'max-h-[480px]'
        }`}
      >
        {/* 1. When no query is typed: Popular searches & Department shortcuts */}
        {!searchQuery.trim() && (
          <div className="p-3.5 sm:p-4 bg-[#FAF6F2]/80 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#786F66] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E44A2D]" />
                <span>Trending Searches</span>
              </span>
              <span className="text-[10px] text-[#786F66]">Tap to search</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {[
                { label: 'Cotton Saree', price: '₹825' },
                { label: 'Semi Silk Saree', price: '₹599' },
                { label: 'Silk Cotton', price: '₹1,240' },
                { label: 'Kanchi Silk', price: '₹1,575' },
                { label: 'Chettinad Saree', price: '₹1,200' },
                { label: 'California Almonds', price: '₹449' },
                { label: 'Royal Oud Attar', price: '₹799' },
                { label: 'Kumkumadi Serum', price: '₹899' },
              ].map((kw) => (
                <button
                  key={kw.label}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchQuery(kw.label);
                    saveSearchQuery(kw.label, user?.email);
                    navigate(`/shop?search=${encodeURIComponent(kw.label)}`);
                    setIsSearchFocused(false);
                  }}
                  className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-[#E44A2D] hover:text-white transition border border-[#E5DCD3] shadow-2xs flex items-center gap-1 group active:scale-95 cursor-pointer"
                >
                  <span>{kw.label}</span>
                  <span className="text-[10px] text-[#786F66] group-hover:text-white/90 font-normal">
                    {kw.price}
                  </span>
                </button>
              ))}
            </div>

            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#786F66] block mb-2">
              Explore Collections
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORY_NAV_ITEMS.filter((item) => item.deptId).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    setIsSearchFocused(false);
                  }}
                  className="p-2 bg-white rounded-xl border border-[#E5DCD3] hover:border-[#E44A2D] hover:bg-[#FEEAE5]/30 transition text-left flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF6F2] group-hover:bg-white flex items-center justify-center shrink-0">
                    {item.renderIcon(false)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-black truncate group-hover:text-[#E44A2D]">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[#786F66] truncate">{item.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. When query is typed: Instant Predictive Results */}
        {searchQuery.trim() && (
          <div className="overflow-y-auto divide-y divide-[#E5DCD3]/60 flex-1">
            {/* Header pill */}
            <div className="px-3.5 py-2 bg-[#FAF6F2] text-[11px] font-bold text-[#786F66] flex items-center justify-between sticky top-0 z-10 border-b border-[#E5DCD3]/60">
              <span className="flex items-center gap-1.5">
                <span>Recognized Matches</span>
                <span className="bg-[#E44A2D] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {instantProductMatches.length}
                </span>
              </span>
              <span className="text-[10px] text-[#786F66] font-normal hidden sm:inline">
                Instant predictive search
              </span>
            </div>

            {/* Category match suggestions if any */}
            {instantCategoryMatches.length > 0 && (
              <div className="p-2.5 bg-amber-50/70 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mr-1">
                  Departments:
                </span>
                {instantCategoryMatches.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsSearchFocused(false);
                      saveSearchQuery(cat.title, user?.email);
                      navigate(`/shop?dept=${cat.deptId}`);
                    }}
                    className="text-xs font-bold px-2.5 py-1 bg-white hover:bg-[#E44A2D] hover:text-white rounded-lg border border-amber-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Tag className="w-3 h-3 text-[#E44A2D]" />
                    <span>{cat.title}</span>
                    <span className="text-[10px] opacity-75 font-normal">({cat.count})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Product Items */}
            {instantProductMatches.length > 0 ? (
              <>
                {instantProductMatches.slice(0, 8).map((item) => {
                  const effectivePrice = item.discountPrice ?? item.price;
                  const hasDiscount = item.discountPrice && item.discountPrice < item.price;

                  return (
                    <div
                      key={item.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setIsSearchFocused(false);
                        saveSearchQuery(item.name, user?.email);
                        navigate(`/product/${item.slug || item.id}`);
                      }}
                      className="p-2.5 sm:p-3 flex items-center gap-3 hover:bg-[#FAF6F2] cursor-pointer transition group"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 bg-neutral-100 border border-[#E5DCD3] group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-black truncate group-hover:text-[#E44A2D] transition-colors">
                          <HighlightText text={item.name} query={searchQuery} />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#5C554E] flex-wrap">
                          <span className="bg-[#FAF6F2] border border-[#E5DCD3] px-1.5 py-0.2 rounded text-[10px] font-semibold text-[#786F66]">
                            {item.subcategory || item.category}
                          </span>
                          <span className="font-extrabold text-black">
                            {formatPrice(effectivePrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] text-[#786F66] line-through">
                              {formatPrice(item.price)}
                            </span>
                          )}
                          {item.discountPercentage && (
                            <span className="text-[10px] font-bold text-emerald-600">
                              {item.discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#786F66] group-hover:text-[#E44A2D] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  );
                })}

                <div className="p-2.5 bg-[#FAF6F2] text-center border-t border-[#E5DCD3] sticky bottom-0">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsSearchFocused(false);
                      saveSearchQuery(searchQuery, user?.email);
                      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                    }}
                    className="text-xs font-bold text-[#E44A2D] hover:underline flex items-center justify-center gap-1.5 w-full cursor-pointer"
                  >
                    <span>View all {instantProductMatches.length} results for "{searchQuery}" in catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <p className="text-xs text-[#786F66]">
                  No products found matching "<strong className="text-black">{searchQuery}</strong>".
                </p>
                <p className="text-[11px] text-[#786F66] mt-1">
                  Try searching for <span className="font-bold text-black">Cotton Saree</span>, <span className="font-bold text-black">Kanchi Silk</span>, <span className="font-bold text-black">Almonds</span>, or <span className="font-bold text-black">Attar</span>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
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
        {/* ROW 1: LOGO + SEARCH (DESKTOP) + PROFILE & CART           */}
        {/* ========================================================= */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[56px] sm:h-[68px] md:h-[74px] gap-2 sm:gap-4">
            
            {/* Left: Mobile Hamburger Toggle */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 -ml-1 rounded-xl text-neutral-800 hover:bg-[#FAF6F2] transition active:scale-95"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Left: Brand Logo */}
            <Link to="/" className="flex items-center group shrink-0">
              <BrandLogo variant="full" theme="dark" size="sm" />
            </Link>

            {/* Center: Prominent Search Bar (Desktop >= 768px) */}
            <div
              ref={desktopSearchContainerRef}
              className="hidden md:block relative flex-1 max-w-xl lg:max-w-2xl mx-2 lg:mx-6"
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-[#786F66]">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#E44A2D]" />
                  </div>
                  <input
                    ref={desktopSearchInputRef}
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
                        className="p-1 rounded-full text-[#786F66] hover:text-black hover:bg-neutral-100 transition cursor-pointer"
                        aria-label="Clear Search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-2.5 sm:px-3.5 py-1.5 bg-[#E44A2D] hover:bg-[#cc3d22] text-white rounded-lg text-xs font-bold transition shadow-2xs flex items-center gap-1 cursor-pointer"
                      aria-label="Submit Search"
                    >
                      <span className="hidden sm:inline">Search</span>
                      <Search className="w-3.5 h-3.5 sm:hidden" />
                    </button>
                  </div>
                </div>

                {/* Instant Predictive Live Dropdown Suggestions */}
                {renderSearchDropdown(false)}
              </form>
            </div>

            {/* Right: Wishlist + Profile & Cart Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 shrink-0">
              
              {/* Quick Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative p-1.5 sm:p-2 text-neutral-800 hover:text-black hover:bg-[#FAF6F2] rounded-xl transition"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 text-neutral-800" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E44A2D] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

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

          {/* ========================================================= */}
          {/* ROW 2: FULL-WIDTH SEARCH BAR (MOBILE EXCLUSIVE < 768px)  */}
          {/* ========================================================= */}
          <div className="md:hidden pb-2.5 pt-0.5" ref={mobileSearchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center">
                <div className="absolute left-3 pointer-events-none text-[#786F66]">
                  <Search className="w-4 h-4 text-[#E44A2D]" />
                </div>
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search Sarees, Dry Fruits, Perfumes..."
                  className="w-full pl-9 pr-20 py-2 bg-[#FAF6F2] hover:bg-white focus:bg-white text-xs font-medium text-black placeholder:text-[#8C827A] rounded-xl border border-[#D8CFC5] focus:border-[#E44A2D] focus:ring-2 focus:ring-[#E44A2D]/20 outline-none transition-all shadow-2xs"
                />
                <div className="absolute right-1 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full text-[#786F66] hover:text-black hover:bg-neutral-100 transition cursor-pointer"
                      aria-label="Clear Search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-[#E44A2D] hover:bg-[#cc3d22] text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
                    aria-label="Submit Search"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Instant Predictive Live Dropdown Suggestions (Mobile) */}
              {renderSearchDropdown(true)}
            </form>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 2.5: DELIVERY LOCATION BAR (MATCHING USER SCREENSHOT) */}
        {/* ========================================================= */}
        <div className="bg-[#FAF6F2] border-t border-[#E5DCD3] px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <DeliveryLocationBar />
            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-[#5C554E]">
              <Link to="/store-locator" className="hover:text-black hover:underline flex items-center gap-1">
                <span>Flagship Store (T. Nagar, Chennai)</span>
              </Link>
              <span className="text-[#D8CFC5]">•</span>
              <Link to="/support" className="hover:text-black hover:underline flex items-center gap-1">
                <span>Customer Support & FAQs</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LINE 3: CATEGORY ROW MATCHING MINIMALIST 2ND SCREENSHOT   */}
        {/* ========================================================= */}
        <div className="bg-white border-t border-[#E5DCD3]/80 pt-1.5 pb-2 sm:pt-2.5 sm:pb-3 px-2 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-3 sm:gap-8 md:gap-14 min-w-max sm:min-w-0 px-2 sm:px-0">
            {CATEGORY_NAV_ITEMS.map((item) => {
              const active = isCategoryActive(item);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="group flex flex-col items-center justify-center py-1 px-2 sm:px-3 rounded-xl transition-all relative shrink-0"
                >
                  {/* Line-Art Icon Container in Squircle (Active: Soft Red Tint) */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl p-1 mb-1 transition-all duration-200 relative flex items-center justify-center ${
                      active
                        ? 'bg-[#FEEAE5] text-[#E44A2D] shadow-xs'
                        : 'bg-transparent text-neutral-800 hover:bg-[#FAF6F2] hover:text-[#E44A2D]'
                    }`}
                  >
                    {item.renderIcon(active)}
                  </div>

                  {/* Category Title Label */}
                  <span
                    className={`text-[10px] sm:text-xs tracking-tight whitespace-nowrap transition-colors ${
                      active
                        ? 'font-black text-[#E44A2D]'
                        : 'font-bold text-neutral-700 group-hover:text-black'
                    }`}
                  >
                    {item.title}
                  </span>

                  {/* Solid Underline Bar Indicator directly underneath the active category */}
                  {active && (
                    <span className="absolute -bottom-1 sm:-bottom-2 left-1.5 right-1.5 h-[3px] sm:h-[3.5px] bg-[#E44A2D] rounded-full shadow-2xs" />
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
                ref={overlaySearchInputRef}
                type="text"
                placeholder="Search Sarees, Almonds, Attar, Kumkumadi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm sm:text-base font-medium outline-none bg-transparent text-black placeholder:text-[#9E9285]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-[#786F66] hover:text-black px-2 py-1 rounded-md cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsSearchOverlayOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF6F2] text-neutral-600 hover:text-black transition cursor-pointer"
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
                  {[
                    { label: 'Cotton Saree', price: '₹825' },
                    { label: 'Semi Silk Saree', price: '₹599' },
                    { label: 'Kanchi Silk', price: '₹1,575' },
                    { label: 'Silk Cotton', price: '₹1,240' },
                    { label: 'California Almonds', price: '₹449' },
                    { label: 'Rose Attar', price: '₹649' },
                    { label: 'Kumkumadi Serum', price: '₹899' },
                  ].map((kw) => (
                    <button
                      key={kw.label}
                      onClick={() => {
                        setSearchQuery(kw.label);
                        saveSearchQuery(kw.label, user?.email);
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-[#E44A2D] hover:text-white transition border border-[#E5DCD3] shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{kw.label}</span>
                      <span className="text-[10px] opacity-75 font-normal">{kw.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Predictive Search Results */}
            {searchQuery.trim() && (
              <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#E5DCD3]/60">
                {instantProductMatches.length > 0 ? (
                  <>
                    <div className="p-3 bg-[#FAF6F2] text-xs font-bold text-black flex items-center justify-between sticky top-0 z-10 border-b border-[#E5DCD3]/60">
                      <span>Instant Matches ({instantProductMatches.length})</span>
                      <span className="text-[11px] text-[#786F66] font-normal">Press Enter or tap to view</span>
                    </div>
                    {instantProductMatches.slice(0, 10).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setIsSearchOverlayOpen(false);
                          saveSearchQuery(item.name, user?.email);
                          navigate(`/product/${item.slug || item.id}`);
                        }}
                        className="p-3.5 flex items-center gap-3.5 hover:bg-[#FAF6F2] cursor-pointer transition group"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-12 h-14 rounded-xl object-cover shrink-0 bg-slate-100 border border-[#E5DCD3] group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-black truncate group-hover:text-[#E44A2D] transition-colors">
                            <HighlightText text={item.name} query={searchQuery} />
                          </div>
                          <div className="text-[11px] text-[#5C554E] mt-0.5 flex items-center gap-2">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span className="font-extrabold text-black">{formatPrice(item.discountPrice ?? item.price)}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#786F66] group-hover:text-[#E44A2D] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                    <div className="p-3 bg-[#FAF6F2] text-center border-t border-[#E5DCD3]">
                      <Link
                        to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setIsSearchOverlayOpen(false);
                          saveSearchQuery(searchQuery, user?.email);
                        }}
                        className="text-xs font-bold text-[#E44A2D] hover:underline"
                      >
                        View all {instantProductMatches.length} results in Catalog →
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
                to="/store-locator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-1.5 font-semibold text-neutral-800"
              >
                <span>Store Locator & About Us</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Chennai Store
                </span>
              </Link>
              <Link
                to="/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-1.5 font-semibold text-neutral-800"
              >
                <span>Customer Support & FAQ</span>
                <span className="text-[10px] text-neutral-500 font-bold">24/7</span>
              </Link>
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
