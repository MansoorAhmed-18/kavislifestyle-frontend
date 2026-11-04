import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThreeHeroShowcase } from './ThreeHeroShowcase';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#F5EFEB] pt-8 pb-16 sm:pb-20 border-b border-[#E5DCD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Story & CTAs (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Clean Heritage Eyebrow */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white text-black border border-[#E5DCD3] w-fit mb-4 sm:mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              <span className="text-[11px] sm:text-xs font-bold tracking-wide">
                From Kavi Boutique to Modern Lifestyle Destination
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight leading-[1.15]">
              Everything You Love,{' '}
              <span className="underline decoration-[#E44A2D] underline-offset-4 sm:underline-offset-8">
                Under One Roof.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-3.5 sm:mt-5 text-xs sm:text-base lg:text-lg text-[#5C554E] max-w-2xl leading-relaxed font-medium">
              Explore authentic Indian lifestyle essentials. Handwoven Kanchipuram silks, fresh Californian dry fruits, pure Kannauj attars, and clean Ayurvedic radiance — curated under one trusted brand.
            </p>

            {/* CTAs */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-black hover:bg-[#2A2A2A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 group"
              >
                <span>Shop All Departments</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const elem = document.getElementById('departments-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-[#FAF6F2] text-black border border-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                Explore 4 Departments
              </button>
            </div>

            {/* Trust Highlights Strip */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#E5DCD3] grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E5DCD3] text-black shadow-xs shrink-0">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-black">100% Genuine</div>
                  <div className="text-[10px] sm:text-[11px] text-[#5C554E]">Pure silk & harvest</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E5DCD3] text-black shadow-xs shrink-0">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-black">Free Delivery</div>
                  <div className="text-[10px] sm:text-[11px] text-[#5C554E]">Orders over ₹999</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E5DCD3] text-black shadow-xs shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-black">Easy Returns</div>
                  <div className="text-[10px] sm:text-[11px] text-[#5C554E]">7-Day doorstep pickup</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#E5DCD3] text-black shadow-xs shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-black">Razorpay Secure</div>
                  <div className="text-[10px] sm:text-[11px] text-[#5C554E]">256-Bit SSL payment</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Interactive Showcase (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-5 shadow-sm border border-[#E5DCD3]">
              {/* Interactive 3D Showcase */}
              <div className="rounded-2xl bg-[#FAF6F2] overflow-hidden border border-[#E5DCD3]">
                <ThreeHeroShowcase />
              </div>

              {/* Floating Department Badge */}
              <div className="mt-4 flex items-center justify-between px-4 py-2.5 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-black" />
                  <span className="text-xs font-bold text-black">
                    4 Departments • 1 Cart & Checkout
                  </span>
                </div>
                <span className="text-xs font-bold text-black bg-white px-2.5 py-0.5 rounded border border-[#E5DCD3]">
                  Global Delivery
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
