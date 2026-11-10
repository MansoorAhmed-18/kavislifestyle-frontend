import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { DEPARTMENTS } from '../data/departments';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14213D] stripe-navy text-[#F4EDE0] pt-16 pb-8 border-t border-[#1D2D50] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid: 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/15">

          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center group">
              <BrandLogo variant="full" theme="light" size="md" />
            </Link>

            <p className="text-xs sm:text-sm text-[#F4EDE0]/80 leading-relaxed max-w-sm font-medium">
              Rooted in the timeless textile tradition of Kavi Boutique, Kavi's Lifestyle is a unified destination celebrating authentic Indian sarees, finest gourmet dry fruits, artisanal Kannauj attars, and clean botanical wellness.
            </p>

            <div className="space-y-2 text-xs text-[#F4EDE0]/80 pt-2 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B5B] flex-shrink-0" />
                <span>Kavi Boutique, T. Nagar, Chennai, Tamil Nadu — 600017</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF6B5B] flex-shrink-0" />
                <span>Customer Care: +91 90953 16566 (Mon–Sat, 10 AM – 7 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B5B] flex-shrink-0" />
                <span>care@kavislifestyle.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Departments */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF6B5B] mb-4">
              Departments
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F4EDE0]/80">
              {DEPARTMENTS.map((dept) => (
                <li key={dept.id}>
                  <Link
                    to={`/shop?dept=${dept.id}`}
                    className="hover:text-[#FF6B5B] transition flex items-center justify-between group font-medium"
                  >
                    <span>{dept.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF6B5B]" />
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="hover:text-[#FF6B5B] transition text-[#F4EDE0] font-bold underline">
                  All Collections →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service & Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF6B5B] mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F4EDE0]/80">
              <li>
                <Link to="/support" className="hover:text-[#FF6B5B] transition font-bold text-[#F4EDE0]">
                  24/7 Support & FAQs →
                </Link>
              </li>
              <li>
                <Link to="/store-locator" className="hover:text-[#FF6B5B] transition font-bold text-[#F4EDE0]">
                  Flagship Store Locator →
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FF6B5B] transition font-medium">
                  About Kavi's Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/account?tab=orders" className="hover:text-[#FF6B5B] transition font-medium">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#FF6B5B] transition font-medium">
                  Shipping & Pan-India Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-[#FF6B5B] transition font-medium">
                  7-Day Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#FF6B5B] transition font-medium">
                  Privacy Policy & 256-Bit SSL
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#FF6B5B] transition font-medium">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Global Dispatch */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF6B5B] mb-4">
              Worldwide Shipping
            </h4>
            <p className="text-xs text-[#F4EDE0]/80 leading-relaxed font-medium">
              Serving patrons across USA, UAE, UK, Singapore, and Canada with express international dispatch.
            </p>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#F4EDE0]/70">
          <div className="flex items-center gap-1 font-medium">
            <span>© 2026 Kavi's Lifestyle. All rights reserved.</span>
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6B5B] fill-[#FF6B5B] inline" />
            <span>in Chennai, India.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy" className="hover:text-[#FF6B5B]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#FF6B5B]">Terms</Link>
            <Link to="/shipping-policy" className="hover:text-[#FF6B5B]">Shipping</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
