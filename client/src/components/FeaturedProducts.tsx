import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Product, DepartmentId } from '../types';
import { ProductCard } from './ProductCard';
import { ProductQuickViewModal } from './ProductQuickViewModal';

export const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [selectedDept, setSelectedDept] = useState<'all' | DepartmentId>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    if (selectedDept === 'all') return p.isFeatured;
    return p.departmentId === selectedDept;
  });

  const tabOptions: { id: 'all' | DepartmentId; label: string }[] = [
    { id: 'all', label: 'All Featured' },
    { id: 'womens-fashion', label: "Women's Fashion" },
    { id: 'dry-fruits-nuts', label: 'Dry Fruits & Nuts' },
    { id: 'perfumes-fragrances', label: 'Perfumes & Attars' },
    { id: 'cosmetics-beauty', label: 'Cosmetics & Beauty' }
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#F4EDE0] stripe-cream border-b border-[#E5D8C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#14213D] text-[#F4EDE0] text-xs font-bold mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B5B]" />
              <span>Handpicked Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#14213D] tracking-tight">
              Featured Products
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#14213D]/70 font-medium">
              Top-rated selections across sarees, gourmet nuts, artisanal oud, and pure beauty.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-xs font-bold text-[#14213D] hover:text-[#FF6B5B] transition group self-start md:self-auto cursor-pointer"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FF6B5B]" />
          </button>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 gap-2 mb-8 no-scrollbar">
          {tabOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDept(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedDept === tab.id
                  ? 'bg-[#FF6B5B] text-white shadow-xs'
                  : 'bg-[#FAF6EE] text-[#14213D] border border-[#E5D8C5] hover:border-[#FF6B5B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid (2 columns on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-6 lg:grid-cols-4 mobile-product-grid">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {quickViewProduct && (
          <ProductQuickViewModal
            product={quickViewProduct}
            isOpen={Boolean(quickViewProduct)}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </div>
    </section>
  );
};
