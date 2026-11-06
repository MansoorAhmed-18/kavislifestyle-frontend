import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../data/departments';

export const DepartmentCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="departments-section" className="py-14 sm:py-18 bg-[#F4EDE0] stripe-cream border-b border-[#E5D8C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#14213D] text-[#F4EDE0] text-xs font-bold mb-2.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B5B]" />
            <span>Four Curated Realms</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#14213D] tracking-tight">
            Shop by Department
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#14213D]/70 font-medium">
            Heritage sarees, gourmet dry fruits, artisanal perfumes, and clean Ayurvedic wellness.
          </p>
        </div>

        {/* 4 Cards Grid (2 on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
          {DEPARTMENTS.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => navigate(`/shop?dept=${dept.id}`)}
              className="group bg-[#FAF6EE] stripe-card rounded-2xl overflow-hidden border border-[#E5D8C5] hover:border-[#FF6B5B] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between text-left"
            >
              {/* Card Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0D1629]">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
                />
                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9.5px] sm:text-[11px] font-black bg-[#FF6B5B] text-white shadow-xs">
                  {dept.itemCount}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xs sm:text-base font-black text-[#14213D] group-hover:text-[#FF6B5B] transition-colors leading-snug">
                    {dept.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#14213D]/70 mt-1 line-clamp-2 leading-relaxed font-medium hidden sm:block">
                    {dept.tagline}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E5D8C5] flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#14213D] group-hover:text-[#FF6B5B] transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#FF6B5B]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
