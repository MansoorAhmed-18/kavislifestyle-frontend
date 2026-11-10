import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Navigation,
  Car,
} from 'lucide-react';

export const PhysicalStorefront: React.FC = () => {
  return (
    <section
      id="physical-storefront"
      className="bg-[#F4EDE0] stripe-cream py-12 sm:py-16 border-b border-[#E5D8C5] text-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14213D] text-[#F4EDE0] text-xs font-bold shadow-xs mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#FF6B5B]" />
            <span>Physical Storefront</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#14213D] tracking-tight leading-tight">
            Visit Our Flagship Store in Chennai
          </h2>
          <p className="text-xs sm:text-sm text-[#14213D]/80 mt-2 leading-relaxed">
            Step into our experiential studio lounge to feel the weight of pure zari silks, sample freshly roasted gourmet nuts, and experience handcrafted Kannauj attars in person.
          </p>
        </div>

        {/* Store Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5D8C5] shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#14213D] text-white flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-6 h-6 text-[#FF6B5B]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#14213D]">
                  Kavi Boutique & Lifestyle Studio
                </h3>
                <p className="text-xs sm:text-sm text-[#14213D]/80 mt-1 leading-relaxed">
                  No. 42, Usman Road (Near Panagal Park), T. Nagar, Chennai, Tamil Nadu — 600017
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Store Open Today (10:00 AM – 9:00 PM)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#14213D] bg-[#FAF6EE] px-3 py-0.5 rounded-full border border-[#E5D8C5]">
                    <Car className="w-3 h-3 text-[#FF6B5B]" />
                    Valet Parking Available
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              <a
                href="https://maps.google.com/?q=Usman+Road+T+Nagar+Chennai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#FF6B5B] hover:bg-[#E85545] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition shadow-sm active:scale-95 cursor-pointer"
              >
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="tel:+919840012345"
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#14213D] hover:bg-[#1f3158] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition shadow-sm active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FF6B5B]" />
                <span>Call Store</span>
              </a>

              <a
                href="https://wa.me/919840012345?text=Hi%20Kavi's%20Lifestyle,%20I%20would%20like%20to%20inquire%20about%20visiting%20the%20Chennai%20store."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition shadow-sm active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Store</span>
              </a>
            </div>

            {/* Quick Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3.5 bg-[#FAF6EE] rounded-2xl border border-[#E5D8C5] shadow-2xs">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-[#FF6B5B]" />
                  <p className="font-bold text-xs text-[#14213D]">Opening Hours</p>
                </div>
                <p className="text-[11px] text-[#14213D]/80">Mon–Sat: 10 AM – 9 PM</p>
                <p className="text-[11px] text-[#14213D]/80">Sun: 11 AM – 8 PM</p>
              </div>

              <div className="p-3.5 bg-[#FAF6EE] rounded-2xl border border-[#E5D8C5] shadow-2xs">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-[#FF6B5B]" />
                  <p className="font-bold text-xs text-[#14213D]">Direct Helpline</p>
                </div>
                <p className="text-[11px] text-[#14213D]/80">+91 90953 16566</p>
                <p className="text-[11px] text-[#14213D]/80">care@kavislifestyle.com</p>
              </div>

              <div className="p-3.5 bg-[#FAF6EE] rounded-2xl border border-[#E5D8C5] shadow-2xs">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-4 h-4 text-[#FF6B5B]" />
                  <p className="font-bold text-xs text-[#14213D]">Landmark & Access</p>
                </div>
                <p className="text-[11px] text-[#14213D]/80">Near Panagal Park</p>
                <p className="text-[11px] text-[#14213D]/80">T. Nagar Metro Nearby</p>
              </div>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5D8C5] aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 group">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Kavi Boutique Flagship Storefront Lounge"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B5B] bg-[#14213D]/90 px-2 py-0.5 rounded w-fit mb-1 border border-[#FF6B5B]/30">
                  FLAGSHIP STUDIO • CHENNAI
                </span>
                <h4 className="text-base sm:text-lg font-black text-white">
                  Kavi Boutique Heritage Lounge
                </h4>
                <p className="text-xs text-[#E5DCD3] mt-0.5">
                  Usman Road, T. Nagar, Chennai — Experience the drape in person.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhysicalStorefront;
