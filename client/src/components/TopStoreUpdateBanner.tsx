import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Gift,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';

interface StoreUpdateItem {
  id: string;
  name: string;
  category: string;
  departmentId?: string;
  image: string;
  price: number;
  originalPrice?: number;
  timestamp: number;
  shortDescription?: string;
  slug?: string;
}

interface BannerCard {
  id: string;
  isStoreUpdate: boolean;
  badge: string;
  partnerText: string;
  title: string;
  subtitle: string;
  priceTag: string;
  image: string;
  link: string;
  bgGradient: string;
  hoursLeft?: number;
}

export const TopStoreUpdateBanner: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  const [touchDelta, setTouchDelta] = useState(0);
  const touchDeltaRef = useRef(0);
  touchDeltaRef.current = touchDelta;

  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read admin updates from localStorage and filter strictly for valid, active products within 24 hours
  const activeAdminUpdates: StoreUpdateItem[] = useMemo(() => {
    const oneDayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();

    try {
      const stored = localStorage.getItem('kavis_admin_store_updates');
      let parsed: StoreUpdateItem[] = stored ? JSON.parse(stored) : [];

      // Valid set of current products in catalog to guarantee deleted products never show
      const liveProductMap = new Map<string, typeof products[0]>();
      const liveProductNames = new Set<string>();
      products.forEach((p) => {
        liveProductMap.set(p.id, p);
        if (p.name) liveProductNames.add(p.name.trim().toLowerCase());
      });

      // Also include any catalog products created within the last 24 hours
      products.forEach((p) => {
        if (p.createdAt) {
          const createdTime = new Date(p.createdAt).getTime();
          if (now - createdTime <= oneDayMs) {
            const alreadyInList = parsed.some((item) => item.id === p.id);
            if (!alreadyInList) {
              parsed.push({
                id: p.id,
                name: p.name,
                category: p.category,
                departmentId: p.departmentId,
                image: p.images && p.images[0] ? p.images[0] : '',
                price: p.discountPrice || p.price,
                originalPrice: p.price,
                timestamp: createdTime,
                shortDescription: p.shortDescription || p.name,
                slug: p.slug || p.id,
              });
            }
          }
        }
      });

      // Filter only updates that:
      // 1. Still genuinely exist in the catalog (NOT deleted)
      // 2. Were created within the last 24 hours (1 day)
      const validUpdates = parsed.filter((item) => {
        const isStillInCatalog =
          liveProductMap.has(item.id) ||
          liveProductNames.has(item.name.trim().toLowerCase());
        const isWithin24Hours = now - item.timestamp <= oneDayMs;
        return isStillInCatalog && isWithin24Hours;
      });

      // Purge any deleted items from localStorage immediately
      if (validUpdates.length !== parsed.length) {
        localStorage.setItem('kavis_admin_store_updates', JSON.stringify(validUpdates));
      }

      return validUpdates;
    } catch (e) {
      console.error('Failed to parse admin store updates', e);
      return [];
    }
  }, [products]);

  // Construct individual banner cards
  const cards: BannerCard[] = useMemo(() => {
    const list: BannerCard[] = [];

    // 1. Admin Store Updates (Individual cards for products added within 24h / 1 day)
    activeAdminUpdates.forEach((update, idx) => {
      const elapsedMs = Date.now() - update.timestamp;
      const hoursRemaining = Math.max(1, Math.round((24 * 60 * 60 * 1000 - elapsedMs) / (60 * 60 * 1000)));

      list.push({
        id: `admin-update-${update.id}-${idx}`,
        isStoreUpdate: true,
        badge: 'STORE UPDATE',
        partnerText: 'STORE UPDATE • JUST ADDED TODAY',
        title: `${update.name.slice(0, 22)}... Min. 40% Off`,
        subtitle: `${update.category} • Fresh Launch by Admin`,
        priceTag: `₹${Math.round(update.price).toLocaleString('en-IN')}`,
        image: update.image,
        link: update.slug ? `/product/${update.slug}` : `/shop`,
        bgGradient: 'from-[#C1121F] via-[#D90429] to-[#F77F00]',
        hoursLeft: hoursRemaining,
      });
    });

    // 2. Featured Store Collection Cards
    list.push({
      id: 'store-sarees',
      isStoreUpdate: false,
      badge: 'STORE UPDATE',
      partnerText: "Kavi's Boutique • Fashion Partner",
      title: 'Heritage Mysore & Silks Min. 70% Off',
      subtitle: 'Pure zari sarees, bridal silks & more',
      priceTag: 'Under ₹1,999',
      image: '/images/products/sarees/saree-6.jpg',
      link: '/shop?dept=womens-fashion',
      bgGradient: 'from-[#D71921] via-[#E85D04] to-[#F48C06]',
    });

    list.push({
      id: 'store-dryfruits',
      isStoreUpdate: false,
      badge: 'STORE UPDATE',
      partnerText: "Nature's Harvest • Gourmet Packs",
      title: 'California Jumbo Almonds Min. 60% Off',
      subtitle: 'Jumbo cashews, walnuts & gift packs',
      priceTag: 'Under ₹599',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80',
      link: '/shop?dept=dry-fruits-nuts',
      bgGradient: 'from-[#9B2226] via-[#BA181B] to-[#E85D04]',
    });

    list.push({
      id: 'store-perfumes',
      isStoreUpdate: false,
      badge: 'STORE UPDATE',
      partnerText: 'Luxury Fragrance • Artisanal Attars',
      title: 'Kannauj Rose & Sandalwood Min. 65% Off',
      subtitle: 'Pure attars, luxury EDPs & gift sets',
      priceTag: 'Under ₹799',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
      link: '/shop?dept=perfumes-fragrances',
      bgGradient: 'from-[#6B0F1A] via-[#941B0C] to-[#BC3908]',
    });

    list.push({
      id: 'store-beauty',
      isStoreUpdate: false,
      badge: 'STORE UPDATE',
      partnerText: 'Clean Skincare • Ayurvedic Elixirs',
      title: 'Kumkumadi Radiance Oil Min. 50% Off',
      subtitle: 'Saffron face glow, ubtans & rituals',
      priceTag: 'Under ₹499',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
      link: '/shop?dept=cosmetics-beauty',
      bgGradient: 'from-[#540B0E] via-[#9E2A2B] to-[#E09F3E]',
    });

    list.push({
      id: 'store-collection',
      isStoreUpdate: false,
      badge: 'STORE UPDATE',
      partnerText: 'STORE COLLECTION • UP TO 70% OFF',
      title: 'Grand Store Collection Min. 70% Off',
      subtitle: 'Sarees, dry fruits, perfumes & beauty',
      priceTag: 'Featured Deals',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=700&q=80',
      link: '/shop',
      bgGradient: 'from-[#B7094C] via-[#C72C41] to-[#EE9B00]',
    });

    return list;
  }, [activeAdminUpdates]);

  const totalCards = cards.length;

  const nextSlide = () => {
    if (totalCards <= 1) return;
    setActiveIndex((prev) => (prev + 1) % totalCards);
  };

  const prevSlide = () => {
    if (totalCards <= 1) return;
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const goToSlide = (idx: number) => {
    if (idx >= 0 && idx < totalCards) {
      setActiveIndex(idx);
    }
  };

  // Auto-rotate every 5 seconds (5000ms) smoothly
  useEffect(() => {
    if (totalCards <= 1) return;

    const timer = setInterval(() => {
      if (!isInteractingRef.current) {
        setActiveIndex((prev) => (prev + 1) % totalCards);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [totalCards]);

  // Touch handlers with directional lock for mobile thumb swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsSwiping(true);
    isInteractingRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalSwipe.current) {
      setTouchDelta(deltaX);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    const delta = touchDeltaRef.current;

    if (isHorizontalSwipe.current && Math.abs(delta) > 35) {
      if (delta < -35) {
        nextSlide();
      } else if (delta > 35) {
        prevSlide();
      }
    }

    setTouchDelta(0);
    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalSwipe.current = null;

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 4000);
  };

  if (totalCards === 0) return null;

  // Reusable card renderer matching Tidewell luxury architectural 45-45-10 aesthetic
  const renderCardBody = (card: BannerCard, isDesktop: boolean) => (
    <>
      {/* Signature Architectural Top Accent Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 z-20 pointer-events-none bg-gradient-to-r from-[#FF6B5B] via-[#F4EDE0] to-[#FF6B5B]/40" />

      {/* Card Canvas: 45% Deep Navy #14213D with Tidewell Radial Coral Glow & Vertical Stripes */}
      <div
        className={`relative bg-[#14213D] stripe-hero-glow text-white ${
          isDesktop ? 'min-h-[195px] lg:min-h-[210px] p-5 lg:p-6' : 'min-h-[175px] sm:min-h-[195px] p-3.5 sm:p-4.5'
        } flex items-center justify-between overflow-hidden border border-white/10`}
      >
        {/* Left Side: Coral Badge, Headline, Subtitle, CTA Button */}
        <div className="relative z-10 flex-1 max-w-[62%] text-left space-y-1.5 sm:space-y-2">
          {/* Top Badge Row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* 10% Coral Highlight Badge */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF6B5B] text-white font-black text-[9.5px] sm:text-[10px] uppercase tracking-wider shadow-sm">
              <Sparkles className="w-2.5 h-2.5 fill-white text-white" />
              <span>{card.badge}</span>
            </div>

            {/* 24-Hour Tag for Admin Store Updates */}
            {card.isStoreUpdate && card.hoursLeft !== undefined && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[#F4EDE0] text-[8.5px] sm:text-[9px] font-bold border border-white/20">
                <Clock className="w-2.5 h-2.5 text-[#FF6B5B]" />
                <span>Live for {card.hoursLeft}h</span>
              </div>
            )}
          </div>

          {/* Main Headline (45% Cream #F4EDE0) */}
          <h3
            className={`${
              isDesktop ? 'text-base lg:text-lg' : 'text-xs sm:text-base'
            } font-black text-[#F4EDE0] tracking-tight leading-tight line-clamp-2`}
          >
            {card.title}
          </h3>

          {/* Subtitle / Category Description */}
          <p className="text-[9.5px] sm:text-[11px] text-[#F4EDE0]/75 font-medium line-clamp-1">
            {card.subtitle}
          </p>

          {/* Action CTA Pill Button in Coral */}
          <div className="pt-0.5">
            <div className="inline-flex items-center gap-1.5 bg-[#FF6B5B] hover:bg-[#E85545] text-white px-2.5 py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold shadow-xs transition-colors">
              <span>Shop Exclusive Deals</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Right Side: Spotlight Photo with Luxury Frame */}
        <div
          className={`relative shrink-0 flex items-center justify-center ${
            isDesktop ? 'w-28 lg:w-36 h-28 lg:h-36 ml-2' : 'w-24 sm:w-32 h-24 sm:h-32 ml-1'
          }`}
        >
          {/* Spotlight Framed Photo with Architectural Border */}
          <div
            className={`relative ${
              isDesktop ? 'w-24 h-24 lg:w-32 lg:h-32' : 'w-20 h-20 sm:w-28 sm:h-28'
            } rounded-2xl overflow-hidden p-0.5 sm:p-1 bg-gradient-to-tr from-[#FF6B5B] via-white/20 to-[#F4EDE0] shadow-2xl group-hover:scale-105 transition-transform duration-300`}
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover rounded-xl bg-[#0D1629]"
              loading="lazy"
            />

            {/* Price Tag Pill */}
            <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 bg-[#14213D]/95 text-[#F4EDE0] border border-[#FF6B5B]/50 px-1.5 py-0.5 rounded text-[8px] sm:text-[9.5px] font-black shadow-xs">
              {card.priceTag}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <section
      className="w-full md:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-3 sm:mt-4 mb-2 sm:mb-3 relative select-none"
      onMouseEnter={() => {
        isInteractingRef.current = true;
      }}
      onMouseLeave={() => {
        isInteractingRef.current = false;
      }}
      aria-label="Store Updates and Curated Collections"
    >
      {/* Relative wrapper for cards & desktop arrows */}
      <div className="relative group/carousel">
        {/* Navigation Arrow: Previous (Desktop / Tablet) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="hidden md:flex absolute -left-3 lg:-left-4 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-[#14213D] hover:bg-[#FF6B5B] text-[#F4EDE0] hover:text-white shadow-xl border border-white/20 items-center justify-center transition-all z-30 cursor-pointer active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Navigation Arrow: Next (Desktop / Tablet) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="hidden md:flex absolute -right-3 lg:-right-4 top-1/2 -translate-y-1/2 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-[#14213D] hover:bg-[#FF6B5B] text-[#F4EDE0] hover:text-white shadow-xl border border-white/20 items-center justify-center transition-all z-30 cursor-pointer active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Overflow Hidden Slider Window */}
        <div className="overflow-hidden rounded-2xl md:rounded-3xl">
          {/* Hardware-Accelerated 100% Transform Slider Track */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex w-full"
            style={{
              transform: `translateX(calc(-${activeIndex * 100}% + ${touchDelta}px))`,
              transition: isSwiping ? 'none' : 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {cards.map((card, idx) => {
              const nextCard = cards[(idx + 1) % cards.length];

              return (
                <div
                  key={card.id}
                  className="w-full min-w-full shrink-0"
                >
                  {/* MOBILE VIEW (< md): Single 100% full-width card (User verified: PERFECT) */}
                  <div
                    onClick={() => {
                      if (Math.abs(touchDeltaRef.current) < 6) {
                        navigate(card.link);
                      }
                    }}
                    className="md:hidden w-full relative cursor-pointer group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    {renderCardBody(card, false)}
                  </div>

                  {/* LAPTOP / DESKTOP VIEW (>= md): 2 Cards Side-by-Side filling max-w-7xl naturally */}
                  <div className="hidden md:flex items-center gap-4 lg:gap-5 w-full">
                    {/* Left Card */}
                    <div
                      onClick={() => navigate(card.link)}
                      className="flex-1 w-1/2 relative cursor-pointer group overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                    >
                      {renderCardBody(card, true)}
                    </div>

                    {/* Right Card (Next card in rotation) */}
                    <div
                      onClick={() => navigate(nextCard.link)}
                      className="flex-1 w-1/2 relative cursor-pointer group overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                    >
                      {renderCardBody(nextCard, true)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-2.5">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            type="button"
            onClick={() => goToSlide(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              idx === activeIndex
                ? 'w-6 h-1.5 bg-[#FF6B5B] shadow-xs'
                : 'w-1.5 h-1.5 bg-[#14213D]/25 hover:bg-[#14213D]/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TopStoreUpdateBanner;
