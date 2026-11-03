import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../data/departments';

export const DepartmentCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="departments-section" className="py-16 sm:py-20 bg-[#F5EFEB] border-b border-[#E5DCD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-black border border-[#E5DCD3] text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Four Curated Realms</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
            Shop by Department
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#5C554E]">
            Heritage sarees, gourmet dry fruits, artisanal perfumes, and clean Ayurvedic wellness.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTMENTS.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => navigate(`/shop?dept=${dept.id}`)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E5DCD3] hover:border-black shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left"
            >
              {/* Card Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6F2]">
                <img
                  src={dept.image}
                  alt={dept.title}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 ease-out"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-black text-white shadow-xs">
                  {dept.itemCount}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-black text-black group-hover:underline transition-colors leading-snug">
                    {dept.title}
                  </h3>
                  <p className="text-xs text-[#5C554E] mt-1 line-clamp-2 leading-relaxed font-medium">
                    {dept.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5DCD3] flex items-center justify-between text-xs font-bold text-black group-hover:text-black">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
