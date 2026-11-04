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
        badge: 'BIG BANG UPDATE',
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

    // 2. Festive Cards
    list.push({
      id: 'festive-sarees',
      isStoreUpdate: false,
      badge: 'BIG BANG DIWALI',
      partnerText: "Kavi's Boutique • Fashion Partner",
      title: 'Heritage Mysore & Silks Min. 70% Off',
      subtitle: 'Pure zari sarees, bridal silks & more',
      priceTag: 'Under ₹1,999',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      link: '/shop?dept=womens-fashion',
      bgGradient: 'from-[#D71921] via-[#E85D04] to-[#F48C06]',
    });

    list.push({
      id: 'festive-dryfruits',
      isStoreUpdate: false,
      badge: 'BIG BANG DIWALI',
      partnerText: "Nature's Harvest • Gourmet Packs",
      title: 'California Jumbo Almonds Min. 60% Off',
      subtitle: 'Jumbo cashews, walnuts & gift packs',
      priceTag: 'Under ₹599',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=80',
      link: '/shop?dept=dry-fruits-nuts',
      bgGradient: 'from-[#9B2226] via-[#BA181B] to-[#E85D04]',
    });

    list.push({
      id: 'festive-perfumes',
      isStoreUpdate: false,
      badge: 'BIG BANG DIWALI',
      partnerText: 'Luxury Fragrance • Artisanal Attars',
      title: 'Kannauj Rose & Sandalwood Min. 65% Off',
      subtitle: 'Pure attars, luxury EDPs & gift sets',
      priceTag: 'Under ₹799',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
      link: '/shop?dept=perfumes-fragrances',
      bgGradient: 'from-[#6B0F1A] via-[#941B0C] to-[#BC3908]',
    });

    list.push({
      id: 'festive-beauty',
      isStoreUpdate: false,
      badge: 'BIG BANG DIWALI',
      partnerText: 'Clean Skincare • Ayurvedic Elixirs',
      title: 'Kumkumadi Radiance Oil Min. 50% Off',
      subtitle: 'Saffron face glow, ubtans & rituals',
      priceTag: 'Under ₹499',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
      link: '/shop?dept=cosmetics-beauty',
      bgGradient: 'from-[#540B0E] via-[#9E2A2B] to-[#E09F3E]',
    });

    list.push({
      id: 'festive-sale',
      isStoreUpdate: false,
      badge: 'BIG BANG DIWALI',
      partnerText: 'SALE IS LIVE • 60-90% OFF',
      title: 'Grand Festive Showcase Min. 70% Off',
      subtitle: 'Sarees, dry fruits, perfumes & beauty',
      priceTag: 'Festive Deals',
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

  // Touch handlers with directional lock to prevent vertical page scrolling interference
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

    // Detect if the user is swiping horizontally or scrolling vertically
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
        // Swiped Left -> Next Slide
        nextSlide();
      } else if (delta > 35) {
        // Swiped Right -> Prev Slide
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

  return (
    <section
      className="w-full max-w-[480px] sm:max-w-[510px] mx-auto px-3 sm:px-4 mt-3 sm:mt-4 mb-2 sm:mb-3 relative select-none"
      onMouseEnter={() => {
        isInteractingRef.current = true;
      }}
      onMouseLeave={() => {
        isInteractingRef.current = false;
      }}
      aria-label="Festive Offers and Store Updates"
    >
      {/* Relative wrapper for card & desktop arrows */}
      <div className="relative group/carousel">
        {/* Navigation Arrow: Previous (Desktop / Tablet) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-black shadow-lg border border-[#E5DCD3] items-center justify-center transition-all z-30 cursor-pointer active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>

        {/* Navigation Arrow: Next (Desktop / Tablet) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-black shadow-lg border border-[#E5DCD3] items-center justify-center transition-all z-30 cursor-pointer active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </button>

        {/* Overflow Hidden Card Frame */}
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300">
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
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  if (Math.abs(touchDeltaRef.current) < 6) {
                    navigate(card.link);
                  }
                }}
                className="w-full min-w-full shrink-0 relative cursor-pointer group"
              >
                {/* Decorative Top Scalloped Golden Garland Arch */}
                <div className="absolute top-0 left-0 right-0 h-2.5 sm:h-3 z-20 pointer-events-none flex justify-around opacity-95 overflow-hidden">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-6 sm:w-7 h-2.5 sm:h-3 rounded-b-full bg-gradient-to-b from-[#FFF59D] to-[#FFD000] shadow-2xs border-b border-[#F48C06]"
                    />
                  ))}
                </div>

                {/* Card Canvas */}
                <div
                  className={`relative bg-gradient-to-r ${card.bgGradient} text-white min-h-[175px] sm:min-h-[195px] flex items-center justify-between p-3 sm:p-4.5 overflow-hidden`}
                >
                  {/* Subtle Festive Sparkle Dot Pattern */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:14px_14px]" />

                  {/* Left Side: Festive Badge, Headline, Subtitle, Bank Offer */}
                  <div className="relative z-10 flex-1 max-w-[62%] text-left space-y-1 sm:space-y-1.5">
                    {/* Top Badge Row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* 3D Festive Explosion Emblem */}
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFE169] text-[#780000] font-black text-[9.5px] sm:text-[10px] uppercase tracking-wider shadow-sm border border-white transform -rotate-1">
                        <Sparkles className="w-2.5 h-2.5 fill-[#780000] text-[#780000]" />
                        <span>{card.badge}</span>
                      </div>

                      {/* 24-Hour Tag for Admin Store Updates */}
                      {card.isStoreUpdate && card.hoursLeft !== undefined && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-[#FFE169] text-[8.5px] sm:text-[9px] font-extrabold border border-[#FFE169]/40">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Live for {card.hoursLeft}h</span>
                        </div>
                      )}
                    </div>

                    {/* Main Headline (Min. X% Off or Deal) */}
                    <h3 className="text-xs sm:text-base font-black text-white tracking-tight leading-tight drop-shadow-sm line-clamp-2">
                      {card.title}
                    </h3>

                    {/* Subtitle / Category Description */}
                    <p className="text-[9.5px] sm:text-[11px] text-white/90 font-medium line-clamp-1">
                      {card.subtitle}
                    </p>

                    {/* Bank Instant Discount Bar */}
                    <div className="pt-0.5">
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-white text-black px-2 py-0.5 sm:py-1 rounded-md text-[8px] sm:text-[9.5px] font-bold shadow-xs">
                        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#00529C] text-white flex items-center justify-center text-[7px] font-black shrink-0">
                          ₹
                        </div>
                        <span className="truncate">SBI Card 10% Instant Discount*</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Spotlight Photo with Floating Lantern & Gift Boxes */}
                  <div className="relative shrink-0 flex items-center justify-center w-24 sm:w-32 h-24 sm:h-32 ml-1">
                    {/* Floating Sky Lantern */}
                    <div className="absolute -top-1.5 -left-1 sm:-top-2 sm:-left-2 w-6 h-8 sm:w-8 sm:h-10 bg-gradient-to-t from-[#FF7B00] to-[#FFD000] rounded-t-full rounded-b-md shadow-md flex items-center justify-center border border-amber-300">
                      <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white animate-pulse" />
                    </div>

                    {/* Spotlight Framed Photo with Golden Border */}
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden p-0.5 sm:p-1 bg-gradient-to-tr from-[#FFE169] via-white to-[#FFB703] shadow-xl group-hover:scale-104 transition-transform duration-300">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover rounded-lg sm:rounded-xl bg-white"
                        loading="lazy"
                      />

                      {/* Price / Offer Tag */}
                      <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 bg-black/85 text-[#FFE169] px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black shadow-xs">
                        {card.priceTag}
                      </div>
                    </div>

                    {/* Festive Gift Boxes & Diya at bottom right */}
                    <div className="absolute -bottom-1 -left-1 sm:bottom-0 sm:-left-1.5 flex items-center gap-1 z-10 pointer-events-none">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#B7094C] rounded-md shadow-md border border-[#FFD000] flex items-center justify-center rotate-6">
                        <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFE169]" />
                      </div>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#780000] rounded-md shadow-xs border border-white flex items-center justify-center -rotate-12">
                        <Gift className="w-2 h-2 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                ? 'w-5 h-1.5 bg-[#FF6A00] shadow-xs'
                : 'w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-500'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TopStoreUpdateBanner;
