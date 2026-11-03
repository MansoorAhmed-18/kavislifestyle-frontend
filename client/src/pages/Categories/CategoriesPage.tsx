import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { DEPARTMENTS, CATEGORIES } from '../../data/departments';
import { BrandLogo } from '../../components/BrandLogo';

// Line-Art category navigation icons matching brand aesthetic
const CatBagIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-6 h-6 sm:w-7 sm:h-7"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 11C7 9.89543 7.89543 9 9 9H23C24.1046 9 25 9.89543 25 11V25C25 26.6569 23.6569 28 22 28H10C8.34315 28 7 26.6569 7 25V11Z" />
    <path d="M12 9V7C12 4.79086 13.7909 3 16 3C18.2091 3 20 4.79086 20 7V9" />
    <path
      d="M11 15C11 17.7614 13.2386 20 16 20C18.7614 20 21 17.7614 21 15"
      fill={active ? '#E44A2D' : '#F59E0B'}
      fillOpacity={active ? '0.35' : '0.85'}
      stroke={active ? '#E44A2D' : '#D97706'}
      strokeWidth="1.5"
    />
  </svg>
);

const CatTshirtIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-6 h-6 sm:w-7 sm:h-7"
    stroke="currentColor"
    strokeWidth="1.9"
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

const CatBeautyIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-6 h-6 sm:w-7 sm:h-7"
    stroke="currentColor"
    strokeWidth="1.9"
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

const CatPerfumeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-6 h-6 sm:w-7 sm:h-7"
    stroke="currentColor"
    strokeWidth="1.9"
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

const CatDryFruitsIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-6 h-6 sm:w-7 sm:h-7"
    stroke="currentColor"
    strokeWidth="1.9"
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

interface SidebarCategory {
  id: string;
  deptId: string | null;
  label: string;
  renderIcon: (active: boolean) => React.ReactNode;
}

const SIDEBAR_CATEGORIES: SidebarCategory[] = [
  {
    id: 'for-you',
    deptId: null,
    label: 'For You',
    renderIcon: (active) => <CatBagIcon active={active} />,
  },
  {
    id: 'womens-fashion',
    deptId: 'womens-fashion',
    label: 'Fashion',
    renderIcon: (active) => <CatTshirtIcon active={active} />,
  },
  {
    id: 'cosmetics-beauty',
    deptId: 'cosmetics-beauty',
    label: 'Beauty',
    renderIcon: (active) => <CatBeautyIcon active={active} />,
  },
  {
    id: 'perfumes-fragrances',
    deptId: 'perfumes-fragrances',
    label: 'Perfumes',
    renderIcon: (active) => <CatPerfumeIcon active={active} />,
  },
  {
    id: 'dry-fruits-nuts',
    deptId: 'dry-fruits-nuts',
    label: 'Dry Fruits',
    renderIcon: (active) => <CatDryFruitsIcon active={active} />,
  },
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { formatPrice } = useCurrency();

  const [selectedCatId, setSelectedCatId] = useState<string>('for-you');

  // Currently active sidebar department
  const activeSidebar = useMemo(
    () => SIDEBAR_CATEGORIES.find((c) => c.id === selectedCatId) || SIDEBAR_CATEGORIES[0],
    [selectedCatId]
  );

  const activeDepartment = useMemo(
    () => DEPARTMENTS.find((d) => d.id === activeSidebar.deptId),
    [activeSidebar.deptId]
  );

  // Popular collections tiles for the active category
  const popularTiles = useMemo(() => {
    if (selectedCatId === 'for-you') {
      return [
        {
          title: 'Big Bang Deals',
          subtitle: 'Live Now',
          badge: 'SALE 60-90%',
          image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80',
          link: '/shop?forYou=true',
        },
        {
          title: 'Pure Silks',
          subtitle: 'Heritage Weaves',
          badge: 'Min. 40% Off',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=womens-fashion',
        },
        {
          title: 'Jumbo Nuts',
          subtitle: 'Gourmet Pack',
          badge: 'Under ₹599',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=dry-fruits-nuts',
        },
        {
          title: 'Luxury Attars',
          subtitle: 'Artisanal Scents',
          badge: 'Under ₹799',
          image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=perfumes-fragrances',
        },
        {
          title: 'Ayurvedic Glow',
          subtitle: 'Pure Elixirs',
          badge: 'Min. 30% Off',
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=cosmetics-beauty',
        },
        {
          title: 'Gift Hampers',
          subtitle: 'Festive Bundles',
          badge: 'Under ₹1,499',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80',
          link: '/shop',
        },
      ];
    }

    if (selectedCatId === 'womens-fashion') {
      return [
        {
          title: 'Pure Silk Sarees',
          subtitle: 'Kanchipuram & Mysore',
          badge: 'Under ₹2,999',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=womens-fashion&search=silk',
        },
        {
          title: 'Artisanal Cottons',
          subtitle: 'Chanderi & Daily Wear',
          badge: 'Under ₹799',
          image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=womens-fashion&search=cotton',
        },
        {
          title: 'Bridal Lehengas',
          subtitle: 'Heavy Zari Embroidery',
          badge: 'Min. 50% Off',
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=womens-fashion&search=lehenga',
        },
        {
          title: 'Salwar Sets',
          subtitle: 'Unstitched & Ready Sets',
          badge: 'Under ₹999',
          link: '/shop?dept=womens-fashion&search=salwar',
          image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80',
        },
        {
          title: 'Brocade Silks',
          subtitle: 'Royal Festive Wear',
          badge: 'Min. 40% Off',
          link: '/shop?dept=womens-fashion&search=brocade',
          image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80',
        },
        {
          title: 'Party Kurtis',
          subtitle: 'Anarkali & Straight Cut',
          badge: 'Under ₹599',
          link: '/shop?dept=womens-fashion&search=kurti',
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80',
        },
      ];
    }

    if (selectedCatId === 'dry-fruits-nuts') {
      return [
        {
          title: 'Jumbo Almonds',
          subtitle: 'California Sanora Badam',
          badge: 'Under ₹499',
          image: 'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=dry-fruits-nuts&search=almond',
        },
        {
          title: 'W180 King Cashews',
          subtitle: 'Mangalore Whole Kaju',
          badge: 'Under ₹699',
          image: 'https://images.unsplash.com/photo-1536591375315-05574577884e?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=dry-fruits-nuts&search=cashew',
        },
        {
          title: 'Afghan Walnuts',
          subtitle: 'Snow White Akhrot',
          badge: 'Fresh Harvest',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=dry-fruits-nuts&search=walnut',
        },
        {
          title: 'Medjool Dates',
          subtitle: 'Royal Arabian Khajoor',
          badge: 'Under ₹549',
          image: 'https://images.unsplash.com/photo-1596040033282-35f99fa6df60?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=dry-fruits-nuts&search=dates',
        },
        {
          title: 'Roasted Pistachios',
          subtitle: 'Lightly Salted Pista',
          badge: 'Min. 30% Off',
          image: 'https://images.unsplash.com/photo-1543208543-6052014786af?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=dry-fruits-nuts&search=pista',
        },
        {
          title: 'Festive Hampers',
          subtitle: 'Assorted Gourmet Dry Fruit',
          badge: 'Under ₹1,199',
          image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=dry-fruits-nuts',
        },
      ];
    }

    if (selectedCatId === 'perfumes-fragrances') {
      return [
        {
          title: 'Artisanal Rose Attar',
          subtitle: 'Kannauj Deg-Bhapka',
          badge: 'Under ₹499',
          image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=perfumes-fragrances&search=attar',
        },
        {
          title: 'Royal Oud EDP',
          subtitle: 'Smoked Amber & Musk',
          badge: 'Min. 40% Off',
          image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=perfumes-fragrances&search=oud',
        },
        {
          title: 'Mysore Sandalwood',
          subtitle: 'Pure Santal Fragrance',
          badge: 'Under ₹799',
          image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=perfumes-fragrances&search=sandalwood',
        },
        {
          title: 'Jasmine Mist',
          subtitle: 'Mogra & White Florals',
          badge: 'Under ₹399',
          image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=perfumes-fragrances&search=jasmine',
        },
        {
          title: 'Fragrance Discovery Box',
          subtitle: '5 Signature Minis',
          badge: 'Under ₹899',
          image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=perfumes-fragrances',
        },
        {
          title: 'Luxury Perfume Oils',
          subtitle: 'Alcohol-Free Attars',
          badge: 'Under ₹349',
          image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=300&q=80',
          link: '/shop?dept=perfumes-fragrances',
        },
      ];
    }

    // Default: cosmetics-beauty
    return [
      {
        title: 'Kumkumadi Miracle Oil',
        subtitle: 'Kashmiri Saffron Glow',
        badge: 'Under ₹699',
        image: 'https://images.unsplash.com/photo-1608248597359-3a334d5885f8?auto=format&fit=crop&w=300&q=80',
        link: '/shop?dept=cosmetics-beauty&search=kumkumadi',
      },
      {
        title: 'Saffron Ubtan',
        subtitle: 'Haldi & Chandan Mask',
        badge: 'Under ₹399',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80',
        link: '/shop?dept=cosmetics-beauty&search=ubtan',
      },
      {
        title: 'Pure Rose Water',
        subtitle: 'Steam-Distilled Toner',
        badge: 'Under ₹299',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
        link: '/shop?dept=cosmetics-beauty&search=rose',
      },
      {
        title: 'Ayurvedic Lip Care',
        subtitle: 'Beetroot & Ghee Tint',
        badge: 'Under ₹199',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=300&q=80',
        link: '/shop?dept=cosmetics-beauty&search=lip',
      },
      {
        title: 'Radiance Face Creams',
        subtitle: 'Day & Night Repair',
        badge: 'Min. 30% Off',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
        link: '/shop?dept=cosmetics-beauty&search=cream',
      },
      {
        title: 'Herbal Hair Rituals',
        subtitle: 'Bhringraj & Amla Oil',
        badge: 'Under ₹449',
        image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=300&q=80',
        link: '/shop?dept=cosmetics-beauty&search=hair',
      },
    ];
  }, [selectedCatId]);

  // Catalog products for "New & Upcoming Launches" section
  const launchProducts = useMemo(() => {
    let list = products;
    if (activeSidebar.deptId) {
      list = products.filter((p) => p.departmentId === activeSidebar.deptId);
    }
    return list.slice(0, 6);
  }, [products, activeSidebar.deptId]);

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex flex-col font-sans select-none">
      {/* ========================================================= */}
      {/* TOP HEADER: ALL CATEGORIES + SEARCH + CART                */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5DCD3] px-3 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1 rounded-xl text-neutral-800 hover:bg-[#FAF6F2] transition"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <h1 className="font-black text-base sm:text-lg text-black tracking-tight">
            All Categories
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/shop"
            className="p-2 rounded-xl text-neutral-800 hover:bg-[#FAF6F2] transition"
            aria-label="Search Catalog"
          >
            <Search className="w-5 h-5 text-[#786F66] hover:text-[#E44A2D]" />
          </Link>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2 rounded-xl text-neutral-800 hover:bg-[#FAF6F2] transition"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            {cartCount > 0 && (
              <span className="absolute 1 top-1 right-1 bg-[#E44A2D] text-white text-[9px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* TWO-PANE SPLIT VIEW (Matching 2nd Screenshot)             */}
      {/* ========================================================= */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-stretch pb-20 md:pb-8">
        
        {/* LEFT PANE: Vertical Categories Sidebar */}
        <aside className="w-[84px] sm:w-[98px] shrink-0 bg-[#FAF6F2] border-r border-[#E5DCD3] overflow-y-auto scrollbar-none py-2 space-y-1">
          {SIDEBAR_CATEGORIES.map((cat) => {
            const isActive = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCatId(cat.id)}
                className={`w-full relative flex flex-col items-center justify-center py-3 px-1 transition-all ${
                  isActive
                    ? 'bg-white shadow-2xs text-[#E44A2D]'
                    : 'hover:bg-[#FAF6F2]/80 text-[#5C554E]'
                }`}
              >
                {/* Active Indicator Bar on Left Edge */}
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-1.5 bg-[#E44A2D] rounded-r-md" />
                )}

                {/* Squircle Icon Container */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 transition-all ${
                    isActive
                      ? 'bg-[#FEEAE5] text-[#E44A2D] shadow-xs scale-105'
                      : 'bg-white text-neutral-800 border border-[#E5DCD3]/70'
                  }`}
                >
                  {cat.renderIcon(isActive)}
                </div>

                {/* Category Label */}
                <span
                  className={`text-[10.5px] sm:text-xs leading-tight tracking-tight text-center ${
                    isActive ? 'font-black text-[#E44A2D]' : 'font-semibold text-neutral-700'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </aside>

        {/* RIGHT PANE: Curated Content Grid for Active Category */}
        <main className="flex-1 bg-white p-3.5 sm:p-6 overflow-y-auto scrollbar-none text-left space-y-6">
          
          {/* Active Category Header Banner */}
          <div className="bg-[#FAF6F2] rounded-2xl p-3 sm:p-4 border border-[#E5DCD3] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#786F66] tracking-wider block">
                {activeSidebar.id === 'for-you' ? 'Curated For You' : 'Store Department'}
              </span>
              <h2 className="text-base sm:text-lg font-black text-black">
                {activeDepartment ? activeDepartment.title : 'Personalized Recommendations'}
              </h2>
            </div>
            <Link
              to={activeSidebar.deptId ? `/shop?dept=${activeSidebar.deptId}` : '/shop?forYou=true'}
              className="px-3 py-1.5 bg-[#E44A2D] hover:bg-[#cc3d22] text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1 shrink-0"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 1. POPULAR COLLECTIONS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-xs sm:text-sm text-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E44A2D]" />
                <span>Popular Collections</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
              {popularTiles.map((tile, idx) => (
                <Link
                  key={`${tile.title}-${idx}`}
                  to={tile.link}
                  className="group bg-[#FAF6F2] hover:bg-white rounded-2xl p-2.5 sm:p-3 border border-[#E5DCD3] hover:border-[#E44A2D] transition-all flex flex-col items-center text-center shadow-2xs hover:shadow-sm"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-2 bg-white border border-[#E5DCD3]/60 relative shrink-0">
                    <img
                      src={tile.image}
                      alt={tile.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-black text-black group-hover:text-[#E44A2D] line-clamp-1 transition-colors">
                    {tile.title}
                  </span>
                  <span className="text-[10px] text-[#5C554E] line-clamp-1 mt-0.5">
                    {tile.subtitle}
                  </span>
                  <span className="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#FEEAE5] text-[#E44A2D] border border-[#E44A2D]/20">
                    {tile.badge}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 2. NEW & UPCOMING LAUNCHES SECTION */}
          <div>
            <div className="flex items-center justify-between mb-3 pt-2 border-t border-[#E5DCD3]/60">
              <h3 className="font-black text-xs sm:text-sm text-black uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#E44A2D]" />
                <span>New & Upcoming Launches</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
              {launchProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug || p.id}`}
                  className="group bg-white rounded-2xl border border-[#E5DCD3] hover:border-[#E44A2D] p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF6F2] mb-2">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-[#059669] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                      BUY NOW
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-black line-clamp-1 group-hover:text-[#E44A2D] transition-colors">
                      {p.name}
                    </span>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#E5DCD3]/50">
                      <span className="text-xs font-black text-black">
                        {formatPrice(p.discountPrice || p.price)}
                      </span>
                      {p.discountPrice && (
                        <span className="text-[10px] line-through text-[#786F66]">
                          {formatPrice(p.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

