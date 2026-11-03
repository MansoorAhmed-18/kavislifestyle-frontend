import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, ArrowRight, CheckCircle2 } from 'lucide-react';

export const FestivePromoBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-[#F5EFEB] border-b border-[#E5DCD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-black text-white p-8 sm:p-12 shadow-md border border-black">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-4 border border-white/20">
                <Gift className="w-3.5 h-3.5 text-white" />
                <span>Celebration & Gifting Collection</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                Festive & Corporate Gifting
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-[#E5DCD3] max-w-xl leading-relaxed font-medium">
                Wooden dry fruit gift boxes, pure Kanchipuram sarees, and Kannauj attars. Curated with care for Indian weddings, celebrations, and corporate milestones.
              </p>

              {/* Offer Badges */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Customized Gifting Message Cards
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Priority Dispatch Pan-India & Global
                </span>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <button
                  onClick={() => navigate('/shop')}
                  className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#FAF6F2] text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-98"
                >
                  <span>Explore Gift Boxes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Card / Coupon Box (4 cols) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 text-center max-w-xs w-full">
                <span className="text-xs font-bold text-[#E5DCD3] block mb-1">
                  Festive Special Promo
                </span>
                <div className="bg-white text-black rounded-xl p-3 my-2 shadow-xs">
                  <span className="font-mono text-xl font-black text-black tracking-widest">
                    KAVI10
                  </span>
                </div>
                <span className="text-[11px] text-[#E5DCD3] block">
                  Flat 10% Discount on all orders
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
