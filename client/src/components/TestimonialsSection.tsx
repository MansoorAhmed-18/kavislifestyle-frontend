import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  department: string;
  rating: number;
  comment: string;
  purchasedItem: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Ananya Srinivasan',
    location: 'Chennai, Tamil Nadu',
    department: "Women's Fashion",
    rating: 5,
    comment: 'The bridal Kanchipuram silk saree exceeded all expectations. The pure gold zari work was so delicate and the drape felt truly royal. Ordering was effortless!',
    purchasedItem: 'Kanchipuram Pure Zari Silk Saree',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't2',
    name: 'Rajesh & Meera Patel',
    location: 'Mumbai, Maharashtra',
    department: 'Dry Fruits & Nuts',
    rating: 5,
    comment: 'Ordered 15 wooden royal dry fruit gift hampers for our wedding celebration. Every single guest praised the freshness of the W180 cashews and jumbo California almonds.',
    purchasedItem: 'Royal 4-in-1 Wooden Dry Fruit Box',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't3',
    name: 'Farooq Al-Hashimi',
    location: 'Dubai, UAE (International Customer)',
    department: 'Perfumes & Fragrances',
    rating: 5,
    comment: 'The Imperial Oud & Smoked Amber is breathtaking. As someone from the Gulf who loves genuine oudh, I was impressed by the 14-hour longevity. Express shipping to Dubai was only 4 days!',
    purchasedItem: 'Imperial Oud & Smoked Amber EDP',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't4',
    name: 'Dr. Kavitha Raman',
    location: 'Bengaluru, Karnataka',
    department: 'Cosmetics & Beauty',
    rating: 5,
    comment: 'Kumkumadi Thailam from Kavi is authentic Ayurvedic goodness. The saffron aroma is natural and after 3 weeks of nightly use, my skin barrier looks nourished and radiant.',
    purchasedItem: 'Kumkumadi Ayurvedic Facial Elixir',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-18 bg-[#F4EDE0] stripe-cream border-b border-[#E5D8C5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF6B5B]">
            Customer Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14213D] tracking-tight mt-1">
            Loved Across India & Overseas
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#14213D]/70 font-medium">
            Real feedback from verified patrons across fashion, gourmet dry fruits, and fragrances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#FAF6EE] stripe-card rounded-2xl p-6 border border-[#E5D8C5] shadow-xs flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#FF6B5B]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF6B5B] text-[#FF6B5B]" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#E5D8C5]" />
                </div>

                <p className="text-xs sm:text-sm text-[#14213D]/80 leading-relaxed mb-4 font-medium">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5D8C5] flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5D8C5]"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#14213D] truncate">
                    {t.name}
                  </h4>
                  <div className="text-[11px] text-[#14213D]/60 truncate">{t.location}</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
