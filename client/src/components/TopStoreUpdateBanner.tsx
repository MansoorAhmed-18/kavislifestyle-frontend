import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  ShieldCheck,
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;
  const isInteractingRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingProgrammatically = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

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

  // Construct individual separated banner cards matching the uploaded screenshot
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

    // 2. Festive Cards matching the screenshot (Separated individual cards)
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

  // Exact, smooth card scrolling ensuring every card turns 100% fully into view on both mobile and desktop
  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    // Wrap around smoothly across all cards (0 -> length-1, length -> 0)
    const targetIndex = (index + cards.length) % cards.length;
    const targetCard = children[targetIndex];

    if (targetCard) {
      isScrollingProgrammatically.current = true;
      setActiveIndex(targetIndex);

      // Exact native pixel scroll position relative to container
      const targetScroll = targetCard.offsetLeft - container.offsetLeft;

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });

      // Release programmatic scrolling lock after smooth animation completes
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 500);
    }
  };

  const scrollNext = () => scrollToCard(activeIndexRef.current + 1);
  const scrollPrev = () => scrollToCard(activeIndexRef.current - 1);
  const scrollToIndex = (index: number) => scrollToCard(index);

  // Automatically turn to next card every 5 seconds (5000ms) without getting stuck
  useEffect(() => {
    if (cards.length <= 1) return;

    const interval = setInterval(() => {
      if (!isInteractingRef.current) {
        scrollToCard(activeIndexRef.current + 1);
      }
    }, 5000); // 5 seconds interval

    return () => {
      clearInterval(interval);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [cards.length]);

  // Track active dot index on manual swipe / scroll
  const handleScroll = () => {
    if (isScrollingProgrammatically.current) return;
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const containerScroll = container.scrollLeft;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    let closestIndex = 0;
    let minDiff = Infinity;

    children.forEach((child, idx) => {
      const childOffset = child.offsetLeft - container.offsetLeft;
      const diff = Math.abs(childOffset - containerScroll);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeIndexRef.current) {
      setActiveIndex(closestIndex);
    }
  };

  // Touch gesture handlers for mobile thumb swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    isInteractingRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      // If user swiped more than 40px left or right with thumb
      if (diff > 40) {
        scrollNext();
      } else if (diff < -40) {
        scrollPrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 4000);
  };

  if (cards.length === 0) return null;

  return (
    <section
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3.5 sm:mt-5 mb-2 sm:mb-3 relative select-none"
      onMouseEnter={() => {
        isInteractingRef.current = true;
      }}
      onMouseLeave={() => {
        isInteractingRef.current = false;
      }}
      aria-label="Festive Offers and Store Updates"
    >
      {/* Relative wrapper for cards & arrows */}
      <div className="relative group/carousel">
        {/* Navigation Arrow: Previous (Desktop / Tablet) */}
        <button
          type="button"
          onClick={scrollPrev}
          className="hidden sm:flex absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-black shadow-lg border border-[#E5DCD3] items-center justify-center transition-all z-30 cursor-pointer active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>

        {/* Navigation Arrow: Next (Desktop / Tablet) */}
        <button
          type="button"
          onClick={scrollNext}
          className="hidden sm:flex absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-black shadow-lg border border-[#E5DCD3] items-center justify-center transition-all z-30 cursor-pointer active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </button>

        {/* Multi-Card Separated Horizontal Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex items-center gap-2.5 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-1 px-0.5"
          style={{
            scrollSnapType: 'x mandatory',
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
              onClick={() => navigate(card.link)}
              className="w-[calc(100vw-1.5rem)] sm:w-[460px] md:w-[490px] lg:w-[520px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative cursor-pointer group mobile-banner-card"
            >
              {/* Decorative Top Scalloped Golden Garland Arch */}
              <div className="absolute top-0 left-0 right-0 h-3 sm:h-3.5 z-20 pointer-events-none flex justify-around opacity-95 overflow-hidden">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-3 sm:h-3.5 rounded-b-full bg-gradient-to-b from-[#FFF59D] to-[#FFD000] shadow-2xs border-b border-[#F48C06]"
                  />
                ))}
              </div>

              {/* Card Canvas */}
              <div
                className={`relative bg-gradient-to-r ${card.bgGradient} text-white min-h-[200px] sm:min-h-[225px] flex items-center justify-between p-3.5 sm:p-5 md:p-6 overflow-hidden`}
              >
                {/* Subtle Festive Sparkle Dot Pattern */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:14px_14px]" />

                {/* Left Side: Festive Badge, Headline, Subtitle, Bank Offer */}
                <div className="relative z-10 flex-1 max-w-[62%] sm:max-w-[60%] text-left space-y-1.5 sm:space-y-2">
                  {/* Top Badge Row */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* 3D Festive Explosion Emblem */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFE169] text-[#780000] font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm border border-white transform -rotate-1">
                      <Sparkles className="w-3 h-3 fill-[#780000] text-[#780000]" />
                      <span>{card.badge}</span>
                    </div>

                    {/* 24-Hour Tag for Admin Store Updates */}
                    {card.isStoreUpdate && card.hoursLeft !== undefined && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-[#FFE169] text-[9px] sm:text-[10px] font-extrabold border border-[#FFE169]/40">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Live for {card.hoursLeft}h</span>
                      </div>
                    )}
                  </div>

                  {/* Main Headline (Min. X% Off or Deal) */}
                  <h3 className="text-sm sm:text-xl md:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-sm line-clamp-2">
                    {card.title}
                  </h3>

                  {/* Subtitle / Category Description */}
                  <p className="text-[10px] sm:text-xs text-white/90 font-medium line-clamp-1">
                    {card.subtitle}
                  </p>

                  {/* Bank Instant Discount Bar (Same as in screenshot) */}
                  <div className="pt-0.5 sm:pt-1">
                    <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-white text-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[8.5px] sm:text-[10px] font-bold shadow-xs">
                      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#00529C] text-white flex items-center justify-center text-[7px] font-black shrink-0">
                        ₹
                      </div>
                      <span className="truncate">SBI Card 10% Instant Discount*</span>
                      <span className="hidden sm:inline text-neutral-400">|</span>
                      <span className="hidden sm:inline text-[#00529C] font-extrabold">10% Savings*</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Spotlight Photo with Floating Lantern & Gift Boxes */}
                <div className="relative shrink-0 flex items-center justify-center w-24 sm:w-40 md:w-48 h-24 sm:h-40 md:h-44 ml-1">
                  {/* Floating Sky Lantern */}
                  <div className="absolute -top-1 -left-1 sm:-top-3 sm:-left-4 w-6 h-8 sm:w-10 sm:h-13 bg-gradient-to-t from-[#FF7B00] to-[#FFD000] rounded-t-full rounded-b-md shadow-md flex items-center justify-center border border-amber-300">
                    <Flame className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white fill-white animate-pulse" />
                  </div>

                  {/* Spotlight Framed Photo with Golden Border */}
                  <div className="relative w-20 h-20 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-xl sm:rounded-2xl overflow-hidden p-0.5 sm:p-1 bg-gradient-to-tr from-[#FFE169] via-white to-[#FFB703] shadow-xl group-hover:scale-104 transition-transform duration-300">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl bg-white"
                      loading="lazy"
                    />

                    {/* Price / Offer Tag */}
                    <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 bg-black/85 text-[#FFE169] px-1 sm:px-1.5 py-0.5 rounded text-[8.5px] sm:text-[10px] font-black shadow-xs">
                      {card.priceTag}
                    </div>
                  </div>

                  {/* Festive Gift Boxes & Diya at bottom right */}
                  <div className="absolute -bottom-1 -left-1 sm:bottom-0 sm:-left-2 flex items-center gap-1 z-10 pointer-events-none">
                    <div className="w-5 h-5 sm:w-7 sm:h-7 bg-[#B7094C] rounded-md shadow-md border border-[#FFD000] flex items-center justify-center rotate-6">
                      <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFE169]" />
                    </div>
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-[#780000] rounded-md shadow-xs border border-white flex items-center justify-center -rotate-12">
                      <Gift className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators matching the screenshot */}
      <div className="flex items-center justify-center gap-1.5 pt-2.5">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            type="button"
            onClick={() => scrollToIndex(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              idx === activeIndex
                ? 'w-5 h-1.5 bg-[#FF6A00] shadow-xs'
                : 'w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-500'
            }`}
            aria-label={`Go to card ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TopStoreUpdateBanner;
