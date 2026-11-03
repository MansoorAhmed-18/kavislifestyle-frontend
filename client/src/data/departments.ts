import { DepartmentId, Category } from '../types';

export interface DepartmentInfo {
  id: DepartmentId;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  itemCount: string;
  accentColor: string;
  bgGradient: string;
  featuredCategorySlugs: string[];
}

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'womens-fashion',
    title: "Women's Fashion",
    subtitle: 'From Heritage Sarees to Modern Comfort',
    tagline: 'Pure Silk, Artisanal Cottons, Salwars & Western Essentials',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    itemCount: '150+ Styles',
    accentColor: '#173F46',
    bgGradient: 'from-[#173F46]/90 to-[#0d262b]',
    featuredCategorySlugs: ['sarees', 'salwar-collections', 'western-wear', 'bottom-wear', 'nightwear']
  },
  {
    id: 'dry-fruits-nuts',
    title: 'Dry Fruits & Nuts',
    subtitle: 'Nature’s Finest Harvest',
    tagline: 'Premium Almonds, Jumbo Cashews, Kashmiri Walnuts & Gift Boxes',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    itemCount: '40+ Gourmet Varieties',
    accentColor: '#B87A38',
    bgGradient: 'from-[#5C3D1E]/90 to-[#2A1808]',
    featuredCategorySlugs: ['almonds', 'cashews', 'pistachios', 'walnuts', 'dates', 'gift-packs']
  },
  {
    id: 'perfumes-fragrances',
    title: 'Perfumes & Fragrances',
    subtitle: 'Captivating Scents & Artisanal Attars',
    tagline: 'Luxury EDPs, Pure Essential Attars & Signature Fragrances',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
    itemCount: '35+ Fragrances',
    accentColor: '#7A3E65',
    bgGradient: 'from-[#4F1A3B]/90 to-[#1F0716]',
    featuredCategorySlugs: ['mens-perfumes', 'womens-perfumes', 'unisex-perfumes', 'attars', 'gift-sets']
  },
  {
    id: 'cosmetics-beauty',
    title: 'Cosmetics & Beauty',
    subtitle: 'Pure Radiance & Ayurvedic Glow',
    tagline: 'Clean Skincare, Ayurvedic Elixirs, Makeup & Hair Rituals',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    itemCount: '60+ Beauty Products',
    accentColor: '#C45163',
    bgGradient: 'from-[#6E1C2B]/90 to-[#31060E]',
    featuredCategorySlugs: ['skincare', 'face-care', 'makeup', 'hair-care', 'personal-care']
  }
];

export const CATEGORIES: Category[] = [
  // Women's Fashion
  {
    id: 'cat-sarees',
    name: 'Sarees',
    slug: 'sarees',
    departmentId: 'womens-fashion',
    description: 'Timeless handwoven silks, pure cottons, and opulent brocades.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    subcategories: [
      'Kanchipuram Silk Sarees',
      'Katan Silk Sarees',
      'Cotton Sarees',
      'Semi-Silk Sarees',
      'Silk Sarees',
      'Silk Cotton Sarees',
      'Brocade Sarees',
      'Premium Sarees'
    ]
  },
  {
    id: 'cat-salwar',
    name: 'Salwar Collections',
    slug: 'salwar-collections',
    departmentId: 'womens-fashion',
    description: 'Designer unstitched fabrics, ready-to-wear sets and plus sizes up to 3XL.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    subcategories: [
      'Unstitched Salwar Materials',
      'Stitched Salwar Suits',
      'Plus-size Collections up to 3XL'
    ]
  },
  {
    id: 'cat-western',
    name: 'Western Wear',
    slug: 'western-wear',
    departmentId: 'womens-fashion',
    description: 'Modern silhouettes, chic tops, versatile co-ord sets, and three-piece ensembles.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Tops', 'Co-ord Sets', 'Three-piece Sets']
  },
  {
    id: 'cat-bottomwear',
    name: 'Bottom Wear',
    slug: 'bottom-wear',
    departmentId: 'womens-fashion',
    description: 'Comfortable 4-way leggings, tailored cotton pants, jeggings, and palazzos.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    subcategories: ['4-way Leggings', 'Jeggings', 'Cotton Pants', 'Patiala', 'Palazzo']
  },
  {
    id: 'cat-other-fashion',
    name: 'Other Collections',
    slug: 'other-collections',
    departmentId: 'womens-fashion',
    description: 'Shawls, blouse materials, nightwear gowns, Pranjul nightwear, shapewear and petticoats.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    subcategories: [
      'Shawls',
      'Blouse Materials',
      'Normal Nightwear',
      'Pranjul Nightwear',
      'Nightwear Gowns',
      'Maxi Dresses',
      'Ladies Innerwear',
      'Shapewear (M–XXL)',
      'Cotton Petticoats'
    ]
  },

  // Dry Fruits & Nuts
  {
    id: 'cat-almonds',
    name: 'Almonds',
    slug: 'almonds',
    departmentId: 'dry-fruits-nuts',
    description: 'Crisp California almonds and authentic rich Mamra almonds.',
    image: 'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&w=600&q=80',
    subcategories: ['California Almonds', 'Mamra Giri', 'Roasted Almonds']
  },
  {
    id: 'cat-cashews',
    name: 'Cashews',
    slug: 'cashews',
    departmentId: 'dry-fruits-nuts',
    description: 'King size W180 and W240 whole crunchy cashews, plain and roasted.',
    image: 'https://images.unsplash.com/photo-1536591375315-1b836821db36?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Jumbo W180 Cashews', 'W240 Whole Cashews', 'Salted & Pepper Roasted']
  },
  {
    id: 'cat-pistachios',
    name: 'Pistachios',
    slug: 'pistachios',
    departmentId: 'dry-fruits-nuts',
    description: 'Irani & Californian naturally opened roasted salted pistachios.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Roasted & Salted Pistachios', 'Raw Green Pistachio Kernels']
  },
  {
    id: 'cat-walnuts',
    name: 'Walnuts',
    slug: 'walnuts',
    departmentId: 'dry-fruits-nuts',
    description: 'Snow white Kashmiri walnut kernels with high natural oil content.',
    image: 'https://images.unsplash.com/photo-1543208543-605655fe1c41?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Kashmiri Snow White Halves', 'In-shell Organic Walnuts']
  },
  {
    id: 'cat-dates-raisins',
    name: 'Dates & Raisins',
    slug: 'dates-raisins',
    departmentId: 'dry-fruits-nuts',
    description: 'Sweet Medjool & Kimia dates, golden and black Afghan raisins.',
    image: 'https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Medjool Dates', 'Kimia Dates', 'Golden Raisins', 'Black Afghani Raisins']
  },
  {
    id: 'cat-gift-packs',
    name: 'Gift Packs & Mixed Boxes',
    slug: 'gift-packs',
    departmentId: 'dry-fruits-nuts',
    description: 'Artisanal wooden gift hampers and festive celebration boxes.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Royal Wooden 4-in-1 Box', 'Festive Celebration Tray', 'Wellness Mix Packs']
  },

  // Perfumes & Fragrances
  {
    id: 'cat-mens-perfumes',
    name: "Men's Perfumes",
    slug: 'mens-perfumes',
    departmentId: 'perfumes-fragrances',
    description: 'Deep woody, aquatic, spicy and citrus Eau De Parfums with 12h+ longevity.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Woody & Leather', 'Fresh Aquatic', 'Spicy Oriental']
  },
  {
    id: 'cat-womens-perfumes',
    name: "Women's Perfumes",
    slug: 'womens-perfumes',
    departmentId: 'perfumes-fragrances',
    description: 'Graceful floral notes, velvety vanilla, exotic night jasmine and fruit blossoms.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Floral Bouquet', 'Warm Vanilla', 'Fresh Citrus & Rose']
  },
  {
    id: 'cat-unisex-perfumes',
    name: 'Unisex Perfumes',
    slug: 'unisex-perfumes',
    departmentId: 'perfumes-fragrances',
    description: 'Rich amber, smoky oudh and balanced musks designed for all.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Royal Amber Oudh', 'Velvet Musk', 'Cardamom & Cedar']
  },
  {
    id: 'cat-attars',
    name: 'Traditional Attars',
    slug: 'attars',
    departmentId: 'perfumes-fragrances',
    description: 'Pure non-alcoholic steam-distilled Kannauj attars crafted over sandalwood base.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Mitti Attar (Petrichor)', 'Ruh Gulab (Damascena Rose)', 'Shamama Gold', 'Mysore Sandalwood']
  },
  {
    id: 'cat-perfume-gifts',
    name: 'Perfume Gift Sets',
    slug: 'perfume-gift-sets',
    departmentId: 'perfumes-fragrances',
    description: 'Curated discovery sets and luxury anniversary fragrance gift boxes.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Luxury Discovery Set (5x10ml)', 'Duo Couple Gift Hamper']
  },

  // Cosmetics & Beauty
  {
    id: 'cat-skincare',
    name: 'Skincare',
    slug: 'skincare',
    departmentId: 'cosmetics-beauty',
    description: 'Hydrating serums, barrier creams, SPF protections, and night elixirs.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Face Serums', 'Moisturizers', 'Sun Protection SPF 50', 'Eye Creams']
  },
  {
    id: 'cat-facecare',
    name: 'Face Care & Ayurvedic',
    slug: 'face-care',
    departmentId: 'cosmetics-beauty',
    description: 'Authentic Kumkumadi Thailam, Kashmiri saffron ubtan, and rose water toners.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Kumkumadi Facial Oils', 'Saffron Radiance Ubtan', 'Pure Rose Mist']
  },
  {
    id: 'cat-makeup',
    name: 'Makeup',
    slug: 'makeup',
    departmentId: 'cosmetics-beauty',
    description: 'Long-lasting matte lipsticks, smudge-proof herbal kajals, and luminous foundations.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Lipsticks & Glosses', 'Herbal Kajal & Liner', 'Blush & Highlighters']
  },
  {
    id: 'cat-haircare',
    name: 'Hair Care',
    slug: 'hair-care',
    departmentId: 'cosmetics-beauty',
    description: 'Cold-pressed Ayurvedic Bhringraj oils, sulphate-free shampoos, and deep masks.',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Bhringraj Scalp Oils', 'Gentle Cleansers', 'Keratin Hair Masks']
  },
  {
    id: 'cat-accessories',
    name: 'Beauty Accessories & Tools',
    slug: 'beauty-accessories',
    departmentId: 'cosmetics-beauty',
    description: 'Real rose quartz facial rollers, Gua Sha stones, silk scrunchies, and brush sets.',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Rose Quartz Rollers', 'Gua Sha Stones', 'Professional Makeup Brushes']
  }
];
