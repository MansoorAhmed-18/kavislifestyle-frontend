import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Heart,
  Award,
  Navigation,
} from 'lucide-react';

export const StoreLocatorAndAboutUs: React.FC = () => {
  return (
    <section
      id="about-and-store-locator"
      className="bg-[#FAF6F2] py-14 sm:py-20 border-b border-[#E5DCD3] text-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        
        {/* ========================================================= */}
        {/* PART 1: ABOUT US BRAND HERITAGE                           */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE169]" />
              <span>Our Heritage & Philosophy</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
              From Beloved Kavi Boutique to a Modern Indian Lifestyle Destination
            </h2>

            <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed">
              Founded on Usman Road in Chennai’s legendary T. Nagar district, Kavi began with a deep reverence for South India’s master weavers. What started as an intimate boutique celebrated for pure Kanchipuram silk sarees and Chettinad handlooms has grown into <strong className="text-black">Kavi’s Lifestyle</strong>—a unified sanctuary of everyday luxury.
            </p>

            <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed">
              Today, alongside our heirloom sarees, we curate nature’s finest harvests: gourmet Kashmiri walnuts, jumbo California almonds, traditional Kannauj rose & sandalwood attars, and clean Ayurvedic botanical self-care. Every item is guided by a singular principle: <strong className="text-black">uncompromising authenticity, zero middle-tier dilution, and direct artisan partnerships.</strong>
            </p>

            {/* 4 Brand Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="p-3.5 bg-white rounded-2xl border border-[#E5DCD3] shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center mb-2">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-black">40+ Weaver Clusters</h4>
                <p className="text-[11px] text-[#5C554E] mt-0.5">
                  Direct alliances with master artisans in Tamil Nadu, Mysore & Varanasi.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#E5DCD3] shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-black">100% Certified Purity</h4>
                <p className="text-[11px] text-[#5C554E] mt-0.5">
                  Silk Mark certified weaves, FSSAI-tested dry fruits, and alcohol-free attars.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#E5DCD3] shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center mb-2">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-black">Zero Middlemen</h4>
                <p className="text-[11px] text-[#5C554E] mt-0.5">
                  Artisan-to-doorstep pricing ensuring genuine value for every patron.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#E5DCD3] shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center mb-2">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-black">Pan-India Express</h4>
                <p className="text-[11px] text-[#5C554E] mt-0.5">
                  Delivered with 256-bit secure checkout to 19,000+ Indian PIN codes.
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5DCD3] aspect-4/5">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Kavi Boutique Saree Artisans"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFE169]">
                  FLAGSHIP STUDIO • CHENNAI
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  Kavi Boutique Heritage Lounge
                </h3>
                <p className="text-xs text-[#E5DCD3] mt-0.5">
                  Usman Road, T. Nagar, Chennai — Experience the drape in person.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PART 2: PHYSICAL STORE LOCATOR & VISIT EXPERIENCE         */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DCD3] shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F2] text-black text-xs font-bold border border-[#E5DCD3] mb-2">
              <MapPin className="w-3.5 h-3.5 text-black" />
              <span>Physical Storefront</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-black tracking-tight">
              Visit Our Flagship Store in Chennai
            </h3>
            <p className="text-xs sm:text-sm text-[#5C554E] mt-1">
              Step into our experiential store to feel the weight of pure zari silks, sample freshly roasted gourmet nuts, and experience handcrafted Kannauj attars.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Store Information Card */}
            <div className="lg:col-span-7 bg-[#FAF6F2] rounded-2xl p-5 sm:p-7 border border-[#E5DCD3] space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black">
                      Kavi Boutique & Lifestyle Studio
                    </h4>
                    <p className="text-xs text-[#5C554E] mt-0.5 leading-relaxed">
                      No. 42, Usman Road (Near Panagal Park), T. Nagar, Chennai, Tamil Nadu — 600017
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ● Open Today • Valet Parking Available
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-[#E5DCD3]">
                    <Clock className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-black">Store Timings</p>
                      <p className="text-[11px] text-[#5C554E]">Mon–Sat: 10:00 AM – 9:00 PM</p>
                      <p className="text-[11px] text-[#5C554E]">Sunday: 11:00 AM – 8:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-[#E5DCD3]">
                    <Phone className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-black">Direct Store Line</p>
                      <p className="text-[11px] text-[#5C554E]">+91 98400 12345</p>
                      <p className="text-[11px] text-[#5C554E]">care@kavislifestyle.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E5DCD3]">
                <a
                  href="https://maps.google.com/?q=Usman+Road+T+Nagar+Chennai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-black hover:bg-[#2A2A2A] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-xs active:scale-95"
                >
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="tel:+919840012345"
                  className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-black font-bold text-xs rounded-xl border border-[#E5DCD3] flex items-center gap-1.5 transition active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Store</span>
                </a>

                <a
                  href="https://wa.me/919840012345?text=Hi%20Kavi's%20Lifestyle,%20I%20would%20like%20to%20inquire%20about%20visiting%20the%20Chennai%20store."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-xs active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Store</span>
                </a>
              </div>
            </div>

            {/* In-Store Highlights Card */}
            <div className="lg:col-span-5 bg-black text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFE169]">
                  In-Store Highlights
                </span>
                <h4 className="text-base sm:text-lg font-black text-white mt-1">
                  Complimentary Patron Services
                </h4>

                <ul className="space-y-3 mt-4 text-xs text-[#E5DCD3]">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-[#FFE169] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong className="text-white">Bridal Saree Draping Lounge:</strong> Try bridal weaves with customized styling guidance from experienced draping specialists.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-[#FFE169] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong className="text-white">Pure Silver Zari Purity Testing:</strong> Live microscopic and burn testing to verify pure silk and zari authenticity.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-[#FFE169] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong className="text-white">Gourmet Nut Roasting Bar:</strong> Sample freshly roasted California almonds, Kashmiri walnuts, and Afghan figs.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-[#FFE169] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong className="text-white">Custom Wedding & Corporate Gifting:</strong> Bespoke wooden boxes with engraved message cards and pan-India dispatch.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between text-xs text-[#E5DCD3]">
                <span>Visiting Chennai? Walk-ins welcome anytime.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StoreLocatorAndAboutUs;
