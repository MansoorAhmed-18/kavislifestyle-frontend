import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, Search } from 'lucide-react';
import { AnnouncementBar } from '../../components/AnnouncementBar';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ProductCard } from '../../components/ProductCard';
import { ProductQuickViewModal } from '../../components/ProductQuickViewModal';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { saveSearchQuery } from '../../utils/personalization';
import { DEPARTMENTS, CATEGORIES } from '../../data/departments';
import { Product, DepartmentId } from '../../types';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDept = searchParams.get('dept') as DepartmentId | null;
  const initialSearch = searchParams.get('search') || '';

  const { products: allCatalogProducts } = useProducts();
  const { user } = useAuth();

  const [selectedDept, setSelectedDept] = useState<string>(initialDept || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [priceRange, setPriceRange] = useState<number>(15000);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL search query or dept changes
  useEffect(() => {
    if (searchParams.get('search') !== null) {
      setSearchQuery(searchParams.get('search') || '');
    }
    if (searchParams.get('dept') !== null) {
      setSelectedDept(searchParams.get('dept') || 'all');
    }
  }, [searchParams]);

  // Save search query when user searches
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        saveSearchQuery(searchQuery.trim(), user?.email);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, user]);

  // Available categories based on selected department
  const filteredCategories = useMemo(() => {
    if (selectedDept === 'all') return CATEGORIES;
    return CATEGORIES.filter((c) => c.departmentId === selectedDept);
  }, [selectedDept]);

  // Filtered & sorted products from live catalog
  const products = useMemo(() => {
    return allCatalogProducts
      .filter((product) => {
        if (selectedDept !== 'all' && product.departmentId !== selectedDept) return false;
        if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
        const effectivePrice = product.discountPrice ?? product.price;
        if (effectivePrice > priceRange) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const tokens = q.split(/\s+/).filter(Boolean);
          const name = product.name.toLowerCase();
          const cat = product.category.toLowerCase();
          const sub = (product.subcategory || '').toLowerCase();
          const brand = (product.brand || '').toLowerCase();
          const desc = (product.shortDescription || product.description || '').toLowerCase();
          const attrs = Object.values(product.attributes || {}).join(' ').toLowerCase();
          const sku = (product.sku || '').toLowerCase();
          const searchBlob = `${name} ${cat} ${sub} ${brand} ${desc} ${attrs} ${sku}`;

          const matchesAllTokens = tokens.every((token) => searchBlob.includes(token));
          if (!matchesAllTokens) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);

        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    allCatalogProducts,
    selectedDept,
    selectedCategory,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange(15000);
    setSortBy('featured');
    if (selectedDept === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ dept: selectedDept });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4EDE0] stripe-cream text-[#14213D] pb-16 md:pb-0">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="text-xs text-[#14213D]/60 mb-1">
            <span>Home</span> / <span className="font-bold text-[#14213D]">Catalog</span>
            {selectedDept !== 'all' ? (
              <> / <span className="text-[#14213D] font-bold capitalize">{selectedDept.replace('-', ' ')}</span></>
            ) : null}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-black text-[#14213D] flex items-center gap-2">
              {selectedDept === 'all'
                ? 'All Lifestyle Collections'
                : DEPARTMENTS.find((d) => d.id === selectedDept)?.title}
            </h1>
            <span className="text-xs text-[#14213D]/70 font-medium">
              Showing <strong>{products.length}</strong> products
            </span>
          </div>
        </div>

        {/* Top Controls Bar */}
        <div className="bg-[#FAF6EE] stripe-card rounded-2xl p-3.5 border border-[#E5D8C5] shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6B5B] text-white text-xs font-bold cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Department Quick Pills */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
              {/* All Collections Pill */}
              <button
                onClick={() => {
                  setSearchParams({});
                  setSelectedDept('all');
                  setSelectedCategory('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedDept === 'all'
                    ? 'bg-[#FF6B5B] text-white shadow-xs'
                    : 'bg-[#F4EDE0] text-[#14213D] border border-[#E5D8C5] hover:border-[#FF6B5B]'
                }`}
              >
                All
              </button>

              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => {
                    setSearchParams({ dept: dept.id });
                    setSelectedDept(dept.id);
                    setSelectedCategory('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedDept === dept.id
                      ? 'bg-[#FF6B5B] text-white shadow-xs'
                      : 'bg-[#F4EDE0] text-[#14213D] border border-[#E5D8C5] hover:border-[#FF6B5B]'
                  }`}
                >
                  {dept.title}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5C554E] font-bold hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-bold border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filter (3 cols) */}
          <aside
            className={`lg:col-span-3 bg-[#FAF6EE] stripe-card p-5 rounded-2xl border border-[#E5D8C5] shadow-xs space-y-6 ${
              showMobileFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D8C5]">
              <div className="flex items-center gap-2 font-bold text-xs text-[#14213D] uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4 text-[#FF6B5B]" />
                <span>Filter Catalog</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#FF6B5B] hover:underline font-bold cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Department Filter - Only shown when viewing "All" departments */}
            {selectedDept === 'all' && (
              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
                  Department
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
                    <input
                      type="radio"
                      name="dept"
                      checked={selectedDept === 'all'}
                      onChange={() => {
                        setSelectedDept('all');
                        setSelectedCategory('all');
                        setSearchParams({});
                      }}
                      className="accent-black"
                    />
                    <span>All Departments</span>
                  </label>
                  {DEPARTMENTS.map((dept) => (
                    <label key={dept.id} className="flex items-center gap-2 text-xs text-black cursor-pointer">
                      <input
                        type="radio"
                        name="dept"
                        checked={(selectedDept as string) === dept.id}
                        onChange={() => {
                          setSelectedDept(dept.id);
                          setSelectedCategory('all');
                          setSearchParams({ dept: dept.id });
                        }}
                        className="accent-black"
                      />
                      <span>{dept.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Category Filter */}
            {filteredCategories.length > 0 && (
              <div className={selectedDept === 'all' ? 'pt-4 border-t border-[#E5DCD3]' : ''}>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
                  Category
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
                    <input
                      type="radio"
                      name="cat"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="accent-black"
                    />
                    <span>All Categories</span>
                  </label>
                  {filteredCategories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 text-xs text-black cursor-pointer">
                      <input
                        type="radio"
                        name="cat"
                        checked={selectedCategory === cat.name}
                        onChange={() => setSelectedCategory(cat.name)}
                        className="accent-black"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Slider */}
            <div className="pt-4 border-t border-[#E5DCD3]">
              <div className="flex justify-between text-xs font-bold text-black mb-2">
                <span>Max Price</span>
                <span>₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="200"
                max="25000"
                step="250"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#5C554E] mt-1">
                <span>₹200</span>
                <span>₹25,000</span>
              </div>
            </div>
          </aside>

          {/* Right Product Grid (9 cols) */}
          <div className="lg:col-span-9">
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E5DCD3] shadow-xs space-y-4">
                <Search className="w-10 h-10 text-[#5C554E] mx-auto" />
                <h3 className="text-base font-bold text-black">No products found</h3>
                <p className="text-xs text-[#5C554E] max-w-sm mx-auto">
                  No catalog items match your search or price criteria. Try adjusting or clearing your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-[#2A2A2A] transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-6 lg:grid-cols-3 mobile-product-grid">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenQuickView={(item) => setQuickViewProduct(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {quickViewProduct && (
          <ProductQuickViewModal
            product={quickViewProduct}
            isOpen={Boolean(quickViewProduct)}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
