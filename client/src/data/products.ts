import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- DEPARTMENT 1: WOMEN'S FASHION ---
  {
    id: 'prod-sar-cotton',
    name: 'Cotton Saree',
    slug: 'cotton-saree-handloom',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Cotton Sarees',
    brand: "Kavi's Handloom Weaves",
    description: 'Fine count breathable pure handloom cotton saree in subtle peach-pink woven with delicate white floral embroidery motifs and silver zari border. Perfect for daily grace, summer comfort, and festive occasions.',
    shortDescription: 'Breathable pure handloom cotton saree with silver zari border and floral embroidery.',
    price: 1199,
    discountPrice: 825,
    discountPercentage: 31,
    rating: 4.8,
    reviewsCount: 34,
    images: [
      '/images/products/sarees/saree-1.jpg'
    ],
    stock: 25,
    sku: 'KV-SAR-COT-825',
    isBestSeller: true,
    attributes: {
      Fabric: '100% Pure Combed Cotton',
      Weave: 'Traditional Handloom with Silver Zari',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Gentle Hand Wash or Machine Wash'
    }
  },
  {
    id: 'prod-sar-semi-silk',
    name: 'Semi Silk Saree',
    slug: 'semi-silk-saree-festive',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Semi-Silk Sarees',
    brand: "Kavi's Festive Silks",
    description: 'Radiant mustard yellow festive semi silk saree with vibrant teal-cyan contrast border, subtle woven motifs across the body, and rich celebratory pallu for effortless elegance.',
    shortDescription: 'Lightweight mustard yellow semi silk drape with contrast teal-cyan border.',
    price: 899,
    discountPrice: 599,
    discountPercentage: 33,
    rating: 4.7,
    reviewsCount: 29,
    images: [
      '/images/products/sarees/saree-2.jpg'
    ],
    stock: 30,
    sku: 'KV-SAR-SMS-599',
    isFeatured: true,
    attributes: {
      Fabric: 'Artisanal Semi Silk Blend',
      Border: 'Contrast Teal-Cyan Woven Border',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean or Cold Hand Wash'
    }
  },
  {
    id: 'prod-sar-silk-cotton',
    name: 'Silk Cotton Saree',
    slug: 'silk-cotton-saree-sico',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Silk Cotton Sarees',
    brand: "Kavi's Heritage Handloom",
    description: 'Masterpiece sico weave combining pure royal blue mulberry silk warp with fine combed cotton weft. Features rich peach-copper zari borders, floral buttas, and handcrafted tassel pallu.',
    shortDescription: 'Royal blue pure silk warp and combed cotton weft with copper zari border.',
    price: 1750,
    discountPrice: 1240,
    discountPercentage: 29,
    rating: 4.9,
    reviewsCount: 41,
    images: [
      '/images/products/sarees/saree-3.jpg'
    ],
    stock: 22,
    sku: 'KV-SAR-SIC-1240',
    isBestSeller: true,
    attributes: {
      Fabric: 'Silk Cotton Blend (Sico)',
      Zari: 'Rich Peach-Copper Zari with Tassels',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Recommended'
    }
  },
  {
    id: 'prod-sar-brocade',
    name: 'Brocade Saree',
    slug: 'brocade-saree-royal-zari',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Brocade Sarees',
    brand: "Kavi's Royal Silks",
    description: 'Opulent royal blue brocade saree woven with ornate circular mandala motifs, intricate copper-gold floral jaal, heavy celebratory pallu, and handcrafted tassel embellishments.',
    shortDescription: 'Heavy gold and copper brocade weave with ornate mandala motifs.',
    price: 1150,
    discountPrice: 750,
    discountPercentage: 35,
    rating: 4.8,
    reviewsCount: 36,
    images: [
      '/images/products/sarees/saree-4.jpg'
    ],
    stock: 28,
    sku: 'KV-SAR-BRO-750',
    isFeatured: true,
    attributes: {
      Fabric: 'Royal Brocade Weave',
      Zari: 'Intricate Copper-Gold Brocade Threadwork',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Only'
    }
  },
  {
    id: 'prod-sar-kanchi-premium',
    name: 'Kanchi Premium Saree',
    slug: 'kanchi-premium-saree-heavy-bridal',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Premium Sarees',
    brand: "Kavi's Kanchipuram Weaves",
    description: 'Majestic Kanchipuram bridal wedding saree featuring subtle metallic gold checks body, authentic temple korvai border in rich wine-purple, and regal embossed grand zari pallu.',
    shortDescription: 'Gold checks Kanchi bridal silk with authentic wine-purple temple korvai border.',
    price: 2199,
    discountPrice: 1399,
    discountPercentage: 36,
    rating: 5.0,
    reviewsCount: 52,
    images: [
      '/images/products/sarees/saree-5.jpg'
    ],
    stock: 18,
    sku: 'KV-SAR-KPR-1399',
    isFeatured: true,
    isBestSeller: true,
    attributes: {
      Fabric: 'Kanchi Premium Silk',
      Zari: 'Heavy Wine-Purple Embossed Zari Border',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Only'
    }
  },
  {
    id: 'prod-sar-kanchi-silk-mark',
    name: 'Kanchipuram Silk Saree (Silk Mark Certified)',
    slug: 'kanchi-silk-saree-silk-mark-certified',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Kanchipuram Silk Sarees',
    brand: "Kavi's Certified Silks",
    description: '100% pure authenticated mulberry silk saree in vibrant magenta pink carrying official Silk Mark Certification. Handcrafted in Kanchipuram with contrast royal purple border and pure golden zari work.',
    shortDescription: 'Official Silk Mark certified pure magenta Kanchipuram silk saree with royal purple border.',
    price: 2499,
    discountPrice: 1575,
    discountPercentage: 37,
    rating: 5.0,
    reviewsCount: 64,
    images: [
      '/images/products/sarees/saree-6.jpg'
    ],
    stock: 15,
    sku: 'KV-SAR-KSMC-1575',
    isFeatured: true,
    isBestSeller: true,
    attributes: {
      Certification: 'Official Silk Mark Certified (100% Pure Silk)',
      Fabric: '100% Pure Mulberry Silk',
      Zari: 'Authentic Traditional Gold Zari',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Only'
    }
  },
  {
    id: 'prod-sar-katan-silk',
    name: 'Katan Silk Saree',
    slug: 'katan-silk-saree-banarasi',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Katan Silk Sarees',
    brand: "Kavi's Banarasi Weaves",
    description: 'Lustrous chocolate brown and deep maroon Katan silk saree woven using pure twisted silk filaments, featuring gold and red temple borders, fine floral buttas, and a regal drape with tassels.',
    shortDescription: 'Pure twisted filament Katan silk in deep chocolate maroon with gold temple border.',
    price: 2299,
    discountPrice: 1575,
    discountPercentage: 31,
    rating: 4.9,
    reviewsCount: 47,
    images: [
      '/images/products/sarees/saree-7.jpg'
    ],
    stock: 16,
    sku: 'KV-SAR-KAT-1575',
    isFeatured: true,
    attributes: {
      Fabric: 'Pure Twisted Katan Silk',
      Weave: 'Banarasi Kadwa Weave with Temple Borders',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Only'
    }
  },
  {
    id: 'prod-sar-mul-cotton',
    name: 'Mul Cotton Saree (Set of 3 Variants)',
    slug: 'mul-cotton-saree-soft',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Cotton Sarees',
    brand: "Kavi's Daily Weaves",
    description: 'Extraordinarily soft 100% pure mulmul cotton sarees. Available in 3 signature designs: Cream with festive contrast border, Yellow-Black-Grey checks, and Classic Monochrome Grey-White checks with tassel pallu. Featherlight and breathable for all-day comfort.',
    shortDescription: 'Ultra-soft featherlight 100% mulmul cotton saree available in 3 artisanal designs.',
    price: 1499,
    discountPrice: 1049,
    discountPercentage: 30,
    rating: 4.8,
    reviewsCount: 38,
    images: [
      '/images/products/sarees/saree-8.jpg',
      '/images/products/sarees/saree-9.jpg',
      '/images/products/sarees/saree-10.jpg'
    ],
    stock: 35,
    sku: 'KV-SAR-MUL-1049',
    isNewArrival: true,
    attributes: {
      Fabric: '100% Pure Mulmul Cotton',
      Prints: 'Handcrafted Border, Checks & Tassel Pallu',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Gentle Hand Wash'
    }
  },
  {
    id: 'prod-sar-kadhi-cotton',
    name: 'Khadhi Cotton Saree',
    slug: 'kadhi-cotton-saree-handspun',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Cotton Sarees',
    brand: "Kavi's Organic Khadi",
    description: 'Authentic handspun, handwoven khadi cotton saree in vivid royal blue with delicate golden round buttas, breathable organic texture, and handcrafted tassel border.',
    shortDescription: 'Vivid royal blue handspun khadi cotton saree with gold buttas and tassels.',
    price: 899,
    discountPrice: 599,
    discountPercentage: 33,
    rating: 4.7,
    reviewsCount: 27,
    images: [
      '/images/products/sarees/saree-11.jpg'
    ],
    stock: 25,
    sku: 'KV-SAR-KAD-599',
    attributes: {
      Fabric: 'Handspun Khadi Cotton',
      Drape: 'Breathable & Textured with Tassels',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Hand Wash in Cold Water'
    }
  },
  {
    id: 'prod-sar-sungudi-cotton',
    name: 'Sungudi Cotton Saree',
    slug: 'sungudi-cotton-saree-madurai',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Cotton Sarees',
    brand: "Kavi's Madurai Sungudi",
    description: 'Traditional Madurai Sungudi cotton saree in rich deep purple featuring woven golden zari stripes and striking turquoise blue peacock temple border and pallu.',
    shortDescription: 'Traditional deep purple Madurai Sungudi cotton saree with turquoise blue peacock border.',
    price: 1199,
    discountPrice: 799,
    discountPercentage: 33,
    rating: 4.9,
    reviewsCount: 43,
    images: [
      '/images/products/sarees/saree-12.jpg'
    ],
    stock: 24,
    sku: 'KV-SAR-SUN-799',
    isBestSeller: true,
    attributes: {
      Origin: 'Madurai, Tamil Nadu',
      Fabric: 'Pure Sungudi Combed Cotton',
      Border: 'Turquoise Blue Peacock Temple Border',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Gentle Cold Wash'
    }
  },
  {
    id: 'prod-sar-chettinad-cotton',
    name: 'Chettinad Cotton Saree',
    slug: 'chettinad-cotton-saree-heritage',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Cotton Sarees',
    brand: "Kavi's Chettinad Heritage",
    description: 'Renowned Tamil Nadu Chettinad handloom cotton saree in deep plum purple, adorned with striking parrot green traditional temple elephant motif border and matching green tassel pallu.',
    shortDescription: 'Plum purple Chettinad handloom cotton saree with parrot green elephant temple border.',
    price: 1699,
    discountPrice: 1200,
    discountPercentage: 29,
    rating: 4.8,
    reviewsCount: 35,
    images: [
      '/images/products/sarees/saree-13.jpg'
    ],
    stock: 20,
    sku: 'KV-SAR-CHE-1200',
    isFeatured: true,
    attributes: {
      Origin: 'Chettinad, Tamil Nadu',
      Fabric: 'Sturdy Handloom Cotton',
      Border: 'Parrot Green Traditional Elephant Temple Border',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Gentle Hand Wash'
    }
  },
  {
    id: 'prod-sar-semi-tussar-silk',
    name: 'Semi Tussar Silk Saree',
    slug: 'semi-tussar-silk-saree-golden',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Semi-Silk Sarees',
    brand: "Kavi's Wild Silks",
    description: 'Earthy golden fawn semi tussar silk saree with natural slub texture, tribal kantha inspired motifs, and rich antique zari pallu for sophisticated understated luxury.',
    shortDescription: 'Natural golden sheen semi tussar silk with earthy slub texture.',
    price: 1599,
    discountPrice: 1095,
    discountPercentage: 31,
    rating: 4.9,
    reviewsCount: 31,
    images: [
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 20,
    sku: 'KV-SAR-TUS-1095',
    isNewArrival: true,
    attributes: {
      Fabric: 'Semi Tussar Wild Silk Blend',
      Texture: 'Natural Golden Fawn Slub',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Recommended'
    }
  },
  {
    id: 'prod-sar-russian-semi-silk',
    name: 'Russian Semi Silk Saree',
    slug: 'russian-semi-silk-saree-fluid',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Semi-Silk Sarees',
    brand: "Kavi's Modern Silks",
    description: 'Silky smooth Russian semi silk saree with ultra-fluid drape, vibrant contemporary digital floral prints, and shimmering satin-feel border. Effortless to drape and wrinkle-resistant.',
    shortDescription: 'Smooth fluid Russian semi silk with digital florals and satin finish.',
    price: 1650,
    discountPrice: 1125,
    discountPercentage: 32,
    rating: 4.8,
    reviewsCount: 26,
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 22,
    sku: 'KV-SAR-RUS-1125',
    attributes: {
      Fabric: 'Fluid Russian Semi Silk',
      Finish: 'Satin Lustre Digital Print',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Gentle Machine Wash'
    }
  },
  {
    id: 'prod-sar-kadhi-georgette-silk',
    name: 'Kadhi Georgette Silk Saree',
    slug: 'kadhi-georgette-silk-saree-delicate',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Silk Sarees',
    brand: "Kavi's Haute Silks",
    description: 'Luxurious textured khadi georgette silk saree combining the crinkled sheer drape of pure georgette with the artisanal texture of khadi. Adorned with delicate zari patti and rich pallu.',
    shortDescription: 'Textured khadi georgette silk saree with crinkled sheer drape.',
    price: 2899,
    discountPrice: 2075,
    discountPercentage: 28,
    rating: 5.0,
    reviewsCount: 44,
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    sku: 'KV-SAR-KGS-2075',
    isFeatured: true,
    attributes: {
      Fabric: 'Khadi Georgette Silk Blend',
      Texture: 'Breezy Crinkle Drape',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Only'
    }
  },
  {
    id: 'prod-sar-dupion-silk',
    name: 'Dupion Silk Saree',
    slug: 'dupion-silk-saree-dual-tone',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Silk Sarees',
    brand: "Kavi's Royal Silks",
    description: 'Crisp textured raw dupion silk woven with cross-dyed yarns that produce an iridescent two-tone shimmer. Offers a structured royal silhouette with ornate golden borders.',
    shortDescription: 'Dual-tone raw dupion silk saree with iridescent two-tone shimmer.',
    price: 1999,
    discountPrice: 1375,
    discountPercentage: 31,
    rating: 4.9,
    reviewsCount: 39,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 19,
    sku: 'KV-SAR-DUP-1375',
    isBestSeller: true,
    attributes: {
      Fabric: 'Raw Dupion Silk',
      Shimmer: 'Cross-Dyed Dual Tone',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Recommended'
    }
  },
  {
    id: 'prod-sar-soft-chanderi-silk',
    name: 'Soft Chanderi Silk Saree',
    slug: 'soft-chanderi-silk-saree-booti',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Silk Sarees',
    brand: "Kavi's Chanderi Weaves",
    description: 'Translucent, featherlight Chanderi silk saree with glistening gold zari booti work and heritage borders from Madhya Pradesh. Sheer, glossy, and comfortable for all occasions.',
    shortDescription: 'Sheer soft Chanderi silk with glistening gold zari booti work.',
    price: 1799,
    discountPrice: 1225,
    discountPercentage: 32,
    rating: 4.8,
    reviewsCount: 37,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 21,
    sku: 'KV-SAR-SCH-1225',
    isFeatured: true,
    attributes: {
      Origin: 'Chanderi, Madhya Pradesh',
      Fabric: 'Soft Chanderi Silk',
      Zari: 'Fine Gold Zari Booti',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Recommended'
    }
  },
  {
    id: 'prod-sar-soft-tissue-silk-cotton',
    name: 'Soft Tissue Silk Cotton Saree',
    slug: 'soft-tissue-silk-cotton-saree-metallic',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Silk Cotton Sarees',
    brand: "Kavi's Tissue Silks",
    description: 'Radiant glazed metallic tissue silk-cotton saree with shimmering translucent glow, lightweight feel, and regal festive presence. Comes with matching tissue blouse piece.',
    shortDescription: 'Radiant glazed metallic tissue silk-cotton saree with festive shimmer.',
    price: 1550,
    discountPrice: 1050,
    discountPercentage: 32,
    rating: 4.9,
    reviewsCount: 40,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    sku: 'KV-SAR-TIS-1050',
    isNewArrival: true,
    attributes: {
      Fabric: 'Tissue Silk Cotton Blend',
      Finish: 'Glazed Metallic Luster',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Only'
    }
  },
  {
    id: 'prod-wf-001',
    name: 'Kanchipuram Pure Zari Bridal Silk Saree',
    slug: 'kanchipuram-pure-zari-bridal-silk-saree',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Kanchipuram Silk Sarees',
    brand: "Kavi's Boutique Heritage",
    description: 'Handwoven in pure mulberry silk with authentic gold zari border and rich contrasting pallu. Comes with silk mark certification and unstitched blouse piece.',
    shortDescription: 'Pure mulberry silk with real gold zari woven border and rich pallu.',
    price: 12499,
    discountPrice: 9999,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    sku: 'KV-SAR-KAN-01',
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { id: 'v1', name: 'Bridal Crimson Red', type: 'shade', value: 'Crimson Red', stock: 5, sku: 'KV-SAR-KAN-01-RED' },
      { id: 'v2', name: 'Royal Peacock Teal', type: 'shade', value: 'Peacock Teal', stock: 4, sku: 'KV-SAR-KAN-01-TEA' },
      { id: 'v3', name: 'Sunset Mustard Gold', type: 'shade', value: 'Mustard Gold', stock: 3, sku: 'KV-SAR-KAN-01-GLD' }
    ],
    attributes: {
      Fabric: 'Pure Mulberry Silk',
      Zari: 'Authentic Half-Fine Gold Zari',
      Length: '6.2 Meters with Blouse Piece',
      Care: 'Dry Clean Only'
    }
  },
  {
    id: 'prod-wf-002',
    name: 'Handblock Printed Chanderi Cotton Saree',
    slug: 'handblock-printed-chanderi-cotton-saree',
    departmentId: 'womens-fashion',
    category: 'Sarees',
    subcategory: 'Cotton Sarees',
    brand: "Kavi's Daily Weaves",
    description: 'Breathable artisanal Chanderi cotton woven with subtle zari patti, vegetable dyes, and traditional floral booti motifs.',
    shortDescription: 'Breathable artisanal cotton with natural floral block prints.',
    price: 2499,
    discountPrice: 1899,
    discountPercentage: 24,
    rating: 4.7,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    sku: 'KV-SAR-COT-02',
    isNewArrival: true,
    variants: [
      { id: 'v4', name: 'Indigo Blue', type: 'shade', value: 'Indigo Blue', stock: 12, sku: 'KV-SAR-COT-02-IND' },
      { id: 'v5', name: 'Sage Olive Green', type: 'shade', value: 'Sage Olive', stock: 13, sku: 'KV-SAR-COT-02-SGE' }
    ]
  },
  {
    id: 'prod-wf-003',
    name: 'Embroidered Anarkali Stitched Salwar Suit',
    slug: 'embroidered-anarkali-stitched-salwar-suit',
    departmentId: 'womens-fashion',
    category: 'Salwar Collections',
    subcategory: 'Plus-size Collections up to 3XL',
    brand: "Kavi's Elegance",
    description: 'Premium georgette flare kurti with intricate threadwork neckline, matching santoon pants, and pure chiffon sequin dupatta. Inclusive sizing up to 3XL.',
    shortDescription: 'Intricate threadwork georgette anarkali with chiffon dupatta up to 3XL.',
    price: 4999,
    discountPrice: 3899,
    discountPercentage: 22,
    rating: 4.8,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    sku: 'KV-SAL-ST-03',
    isFeatured: true,
    variants: [
      { id: 'v6', name: 'Size: M (Bust 38")', type: 'size', value: 'M', stock: 4, sku: 'KV-SAL-03-M' },
      { id: 'v7', name: 'Size: L (Bust 40")', type: 'size', value: 'L', stock: 5, sku: 'KV-SAL-03-L' },
      { id: 'v8', name: 'Size: XL (Bust 42")', type: 'size', value: 'XL', stock: 4, sku: 'KV-SAL-03-XL' },
      { id: 'v9', name: 'Size: XXL (Bust 44")', type: 'size', value: 'XXL', stock: 3, sku: 'KV-SAL-03-XXL' },
      { id: 'v10', name: 'Size: 3XL (Bust 46")', type: 'size', value: '3XL', stock: 2, sku: 'KV-SAL-03-3XL' }
    ]
  },
  {
    id: 'prod-wf-004',
    name: 'Chic Cotton Linen Three-Piece Co-ord Set',
    slug: 'chic-cotton-linen-three-piece-co-ord-set',
    departmentId: 'womens-fashion',
    category: 'Western Wear',
    subcategory: 'Three-piece Sets',
    brand: "Kavi Modern",
    description: 'Contemporary 3-piece co-ord featuring a crop camisole, relaxed fit trousers, and an oversized lightweight lapel shrug in natural earthy tones.',
    shortDescription: 'Modern 3-piece breathable linen set with jacket and tailored trousers.',
    price: 3299,
    discountPrice: 2499,
    discountPercentage: 24,
    rating: 4.6,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 20,
    sku: 'KV-WST-3PC-04',
    variants: [
      { id: 'v11', name: 'Size: S', type: 'size', value: 'S', stock: 5, sku: 'KV-WST-04-S' },
      { id: 'v12', name: 'Size: M', type: 'size', value: 'M', stock: 8, sku: 'KV-WST-04-M' },
      { id: 'v13', name: 'Size: L', type: 'size', value: 'L', stock: 7, sku: 'KV-WST-04-L' }
    ]
  },
  {
    id: 'prod-wf-005',
    name: 'Ultra-Comfort 4-Way Stretch Cotton Leggings',
    slug: 'ultra-comfort-4-way-stretch-cotton-leggings',
    departmentId: 'womens-fashion',
    category: 'Bottom Wear',
    subcategory: '4-way Leggings',
    brand: "Kavi Essentials",
    description: '95% combed cotton and 5% elastane with reinforced 4-way stretch, anti-pilling bio-wash, and all-day soft waistband.',
    shortDescription: 'Bio-washed combed cotton 4-way stretch leggings for effortless pairing.',
    price: 699,
    discountPrice: 499,
    discountPercentage: 29,
    rating: 4.8,
    reviewsCount: 88,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 60,
    sku: 'KV-BOT-LEG-05',
    isBestSeller: true,
    variants: [
      { id: 'v14', name: 'Classic Black (Free Size)', type: 'shade', value: 'Black', stock: 25, sku: 'KV-BOT-05-BLK' },
      { id: 'v15', name: 'Deep Maroon (Free Size)', type: 'shade', value: 'Maroon', stock: 20, sku: 'KV-BOT-05-MRN' },
      { id: 'v16', name: 'Royal Ivory (Free Size)', type: 'shade', value: 'Ivory', stock: 15, sku: 'KV-BOT-05-IVY' }
    ]
  },
  {
    id: 'prod-wf-006',
    name: 'Pranjul Pure Cotton Floral Daily Nightwear Gown',
    slug: 'pranjul-pure-cotton-floral-daily-nightwear-gown',
    departmentId: 'womens-fashion',
    category: 'Other Collections',
    subcategory: 'Pranjul Nightwear',
    brand: "Pranjul by Kavi",
    description: 'Authentic 100% fine cotton nighty with breathable soft drape, delicate floral motifs, and front zipper closure.',
    shortDescription: '100% pure cotton breathable nightwear gown with soft front closure.',
    price: 899,
    discountPrice: 699,
    discountPercentage: 22,
    rating: 4.7,
    reviewsCount: 34,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    sku: 'KV-NGT-PRN-06',
    variants: [
      { id: 'v17', name: 'Size: L', type: 'size', value: 'L', stock: 15, sku: 'KV-NGT-06-L' },
      { id: 'v18', name: 'Size: XL', type: 'size', value: 'XL', stock: 15, sku: 'KV-NGT-06-XL' }
    ]
  },

  // --- DEPARTMENT 2: DRY FRUITS & NUTS ---
  {
    id: 'prod-df-001',
    name: 'King California Jumbo Almonds (Badam Giri)',
    slug: 'king-california-jumbo-almonds',
    departmentId: 'dry-fruits-nuts',
    category: 'Almonds',
    subcategory: 'California Almonds',
    brand: "Kavi Gourmet Harvest",
    description: 'Grade-A 100% natural, crisp, vacuum-packed California jumbo almonds rich in vitamin E, magnesium and antioxidants.',
    shortDescription: 'Crisp 100% natural jumbo almonds packed with natural oil and crunch.',
    price: 349, // 250g base price
    discountPrice: 289,
    discountPercentage: 17,
    rating: 4.9,
    reviewsCount: 112,
    images: [
      'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 95,
    sku: 'KV-DF-ALM-01',
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { id: 'v19', name: '100g Pouch', type: 'weight', value: '100g', priceModifier: -160, stock: 30, sku: 'KV-DF-ALM-100G' },
      { id: 'v20', name: '250g Airtight Pack', type: 'weight', value: '250g', priceModifier: 0, stock: 35, sku: 'KV-DF-ALM-250G' },
      { id: 'v21', name: '500g Value Pack', type: 'weight', value: '500g', priceModifier: 250, stock: 20, sku: 'KV-DF-ALM-500G' },
      { id: 'v22', name: '1kg Bulk Jar', type: 'weight', value: '1kg', priceModifier: 750, stock: 10, sku: 'KV-DF-ALM-1KG' }
    ],
    attributes: {
      Origin: 'California, USA',
      Grade: 'Jumbo 23/25 Grade A',
      Preservatives: 'None / Zero Added Salt',
      ShelfLife: '9 Months in Cool & Dry place'
    }
  },
  {
    id: 'prod-df-002',
    name: 'Royal W180 King Size Whole Cashews (Kaju)',
    slug: 'royal-w180-king-size-whole-cashews',
    departmentId: 'dry-fruits-nuts',
    category: 'Cashews',
    subcategory: 'Jumbo W180 Cashews',
    brand: "Kavi Gourmet Harvest",
    description: 'The King of Cashews: W180 extra-large whole grade, sweet, buttery and rich. Sourced directly from premier coastal orchards.',
    shortDescription: 'Extra-large buttery sweet W180 whole cashews with supreme crunch.',
    price: 449,
    discountPrice: 389,
    discountPercentage: 13,
    rating: 4.9,
    reviewsCount: 76,
    images: [
      'https://images.unsplash.com/photo-1536591375315-1b836821db36?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 70,
    sku: 'KV-DF-CSH-02',
    isFeatured: true,
    variants: [
      { id: 'v23', name: '100g Pack', type: 'weight', value: '100g', priceModifier: -220, stock: 20, sku: 'KV-DF-CSH-100G' },
      { id: 'v24', name: '250g Pack', type: 'weight', value: '250g', priceModifier: 0, stock: 30, sku: 'KV-DF-CSH-250G' },
      { id: 'v25', name: '500g Pack', type: 'weight', value: '500g', priceModifier: 360, stock: 15, sku: 'KV-DF-CSH-500G' },
      { id: 'v26', name: '1kg Jar', type: 'weight', value: '1kg', priceModifier: 1100, stock: 5, sku: 'KV-DF-CSH-1KG' }
    ]
  },
  {
    id: 'prod-df-003',
    name: 'Kashmiri Snow White Walnut Kernels (Akhrot Giri)',
    slug: 'kashmiri-snow-white-walnut-kernels',
    departmentId: 'dry-fruits-nuts',
    category: 'Walnuts',
    subcategory: 'Kashmiri Snow White Halves',
    brand: "Kavi Gourmet Harvest",
    description: '100% whole Kashmiri walnut halves with supreme light colour, non-bitter taste, and loaded with heart-healthy Omega-3.',
    shortDescription: 'Whole light walnut halves from Kashmir Valley rich in natural brain oils.',
    price: 499,
    discountPrice: 429,
    discountPercentage: 14,
    rating: 4.8,
    reviewsCount: 53,
    images: [
      'https://images.unsplash.com/photo-1543208543-605655fe1c41?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 45,
    sku: 'KV-DF-WAL-03',
    variants: [
      { id: 'v27', name: '250g Airtight Box', type: 'weight', value: '250g', priceModifier: 0, stock: 25, sku: 'KV-DF-WAL-250G' },
      { id: 'v28', name: '500g Value Pack', type: 'weight', value: '500g', priceModifier: 390, stock: 20, sku: 'KV-DF-WAL-500G' }
    ]
  },
  {
    id: 'prod-df-004',
    name: 'Royal Heritage 4-in-1 Wooden Dry Fruit Box',
    slug: 'royal-heritage-4-in-1-wooden-dry-fruit-box',
    departmentId: 'dry-fruits-nuts',
    category: 'Gift Packs & Mixed Boxes',
    subcategory: 'Royal Wooden 4-in-1 Box',
    brand: "Kavi Gifting",
    description: 'An opulent handcrafted wooden gift box containing 200g California Almonds, 200g W180 Cashews, 200g Irani Roasted Pistachios, and 200g Afghani Green Raisins (Total 800g). Perfect for weddings, Diwali and corporate gifting.',
    shortDescription: 'Handcrafted luxury wooden gift hamper with 800g assorted dry fruits.',
    price: 1899,
    discountPrice: 1499,
    discountPercentage: 21,
    rating: 5.0,
    reviewsCount: 41,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    sku: 'KV-DF-GFT-04',
    isFeatured: true,
    isBestSeller: true
  },

  // --- DEPARTMENT 3: PERFUMES & FRAGRANCES ---
  {
    id: 'prod-pf-001',
    name: 'Imperial Oud & Smoked Amber Eau De Parfum',
    slug: 'imperial-oud-smoked-amber-eau-de-parfum',
    departmentId: 'perfumes-fragrances',
    category: 'Unisex Perfumes',
    subcategory: 'Royal Amber Oudh',
    brand: "Kavi Scents Privé",
    description: 'A magnetic, long-lasting unisex masterpiece. Opens with saffron and bergamot, developing into Cambodian oudh, dark rose, and a base of rich amber resin with 14-hour sillage.',
    shortDescription: 'Saffron, dark rose, and Cambodian oudh with magnetic 14h sillage.',
    price: 2499,
    discountPrice: 1999,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 64,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    sku: 'KV-PF-OUD-01',
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { id: 'v29', name: '30ml Travel Flacon', type: 'volume', value: '30ml', priceModifier: -600, stock: 15, sku: 'KV-PF-OUD-30' },
      { id: 'v30', name: '50ml Signature Bottle', type: 'volume', value: '50ml', priceModifier: 0, stock: 15, sku: 'KV-PF-OUD-50' },
      { id: 'v31', name: '100ml Luxury Decanter', type: 'volume', value: '100ml', priceModifier: 900, stock: 10, sku: 'KV-PF-OUD-100' }
    ]
  },
  {
    id: 'prod-pf-002',
    name: 'Kannauj Ruh Gulab Pure Rose Non-Alcoholic Attar',
    slug: 'kannauj-ruh-gulab-pure-rose-attar',
    departmentId: 'perfumes-fragrances',
    category: 'Traditional Attars',
    subcategory: 'Ruh Gulab (Damascena Rose)',
    brand: "Kavi Heritage Attars",
    description: 'Pure, authentic deg-bhapka steam-distilled Damascena rose attar from the perfume capital Kannauj. Free from alcohol, parabens, and chemicals. Calming, pure and therapeutic.',
    shortDescription: 'Pure steam-distilled Kannauj Damascus rose attar over sandalwood base.',
    price: 1599,
    discountPrice: 1299,
    discountPercentage: 19,
    rating: 5.0,
    reviewsCount: 47,
    images: [
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    sku: 'KV-PF-ATR-02',
    isFeatured: true,
    variants: [
      { id: 'v32', name: '6ml Crystal Tola', type: 'volume', value: '6ml', priceModifier: -400, stock: 15, sku: 'KV-PF-ATR-6ML' },
      { id: 'v33', name: '12ml Royal Velvet Box', type: 'volume', value: '12ml', priceModifier: 0, stock: 10, sku: 'KV-PF-ATR-12ML' }
    ]
  },
  {
    id: 'prod-pf-003',
    name: 'Tuscan Cedar & Bergamot Noir Pour Homme',
    slug: 'tuscan-cedar-bergamot-noir-pour-homme',
    departmentId: 'perfumes-fragrances',
    category: "Men's Perfumes",
    subcategory: 'Woody & Leather',
    brand: "Kavi Scents Privé",
    description: 'Crisp Calabrian bergamot blending into smoky vetiver, leather accord, and cedarwood. Tailored for executive confidence and evening galas.',
    shortDescription: 'Calabrian bergamot, leather accord, and Virginia cedarwood for men.',
    price: 2199,
    discountPrice: 1749,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    sku: 'KV-PF-MAN-03',
    variants: [
      { id: 'v34', name: '50ml EDP', type: 'volume', value: '50ml', priceModifier: 0, stock: 20, sku: 'KV-PF-MAN-50' },
      { id: 'v35', name: '100ml EDP', type: 'volume', value: '100ml', priceModifier: 700, stock: 15, sku: 'KV-PF-MAN-100' }
    ]
  },
  {
    id: 'prod-pf-004',
    name: 'Kannauj Gulab & Cardamom Non-Alcoholic Attar',
    slug: 'kannauj-gulab-cardamom-attar',
    departmentId: 'perfumes-fragrances',
    category: 'Attars & Essential Oils',
    subcategory: 'Floral Attars',
    brand: "Kavi Scents Privé",
    description: 'Hydro-distilled in traditional copper degs from freshly plucked Kannauj Damask roses, sweetened with green cardamom and pure sandalwood base. 100% alcohol-free.',
    shortDescription: 'Pure copper-distilled Kannauj rose and cardamom concentrated attar.',
    price: 1499,
    discountPrice: 1199,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 46,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    sku: 'KV-PF-ATT-04',
    isFeatured: true,
    variants: [
      { id: 'v35a', name: '6ml Crystal Tola', type: 'volume', value: '6ml', priceModifier: -400, stock: 25, sku: 'KV-PF-ATT-6ML' },
      { id: 'v35b', name: '12ml Royal Velvet Box', type: 'volume', value: '12ml', priceModifier: 0, stock: 15, sku: 'KV-PF-ATT-12ML' }
    ]
  },

  // --- DEPARTMENT 4: COSMETICS & BEAUTY ---
  {
    id: 'prod-cb-001',
    name: 'Kumkumadi Miraculous Ayurvedic Radiance Facial Elixir',
    slug: 'kumkumadi-miraculous-ayurvedic-facial-elixir',
    departmentId: 'cosmetics-beauty',
    category: 'Face Care & Ayurvedic',
    subcategory: 'Kumkumadi Facial Oils',
    brand: "Kavi Botanical Alchemy",
    description: 'Ancient Ayurvedic formula infused with Kashmiri saffron (Kesar), sandalwood, lotus extract, and 26 sacred herbs in pure sesame oil. Imparts a lit-from-within golden glow.',
    shortDescription: 'Authentic 26-herb saffron facial oil for an ageless radiant glow.',
    price: 1999,
    discountPrice: 1599,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 92,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    sku: 'KV-CB-KUM-01',
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { id: 'v36', name: '15ml Dropper', type: 'volume', value: '15ml', priceModifier: -600, stock: 25, sku: 'KV-CB-KUM-15' },
      { id: 'v37', name: '30ml Full Size', type: 'volume', value: '30ml', priceModifier: 0, stock: 25, sku: 'KV-CB-KUM-30' }
    ],
    attributes: {
      KeyHerbs: 'Kashmiri Mogra Saffron, Red Sandalwood, Manjistha',
      SkinType: 'All Skin Types (Non-comedogenic)',
      Formulation: '100% Ayurvedic Classical Thailam'
    }
  },
  {
    id: 'prod-cb-002',
    name: 'Velvet Silk Weightless Matte Liquid Lipstick',
    slug: 'velvet-silk-weightless-matte-liquid-lipstick',
    departmentId: 'cosmetics-beauty',
    category: 'Makeup',
    subcategory: 'Lipsticks & Glosses',
    brand: "Kavi Glam",
    description: '12-hour transfer-proof formula enriched with Vitamin E and almond oil. Comfortable non-drying velvety finish formulated to flatter Indian skin undertones.',
    shortDescription: '12h transfer-proof hydrating matte lipstick in flattering Indian tones.',
    price: 899,
    discountPrice: 699,
    discountPercentage: 22,
    rating: 4.7,
    reviewsCount: 56,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 80,
    sku: 'KV-CB-LIP-02',
    variants: [
      { id: 'v38', name: 'Royal Crimson (Red)', type: 'shade', value: 'Royal Crimson', stock: 30, sku: 'KV-CB-LIP-RED' },
      { id: 'v39', name: 'Warm Terracotta (Nude)', type: 'shade', value: 'Terracotta Nude', stock: 25, sku: 'KV-CB-LIP-TER' },
      { id: 'v40', name: 'Gulabi Berry (Pink Plum)', type: 'shade', value: 'Gulabi Berry', stock: 25, sku: 'KV-CB-LIP-BER' }
    ]
  },
  {
    id: 'prod-cb-003',
    name: 'Bhringraj & Red Onion Intensive Scalp Therapy Oil',
    slug: 'bhringraj-red-onion-intensive-scalp-therapy-oil',
    departmentId: 'cosmetics-beauty',
    category: 'Hair Care',
    subcategory: 'Bhringraj Scalp Oils',
    brand: "Kavi Botanical Alchemy",
    description: 'Cold-pressed coconut, castor, and almond oil infused with wild Bhringraj, red onion sulphur, curry leaves, and Brahmi. Stimulates roots and halts hair fall.',
    shortDescription: 'Ayurvedic cold-pressed Bhringraj and red onion roots strengthener.',
    price: 749,
    discountPrice: 599,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 68,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 65,
    sku: 'KV-CB-HAR-03',
    variants: [
      { id: 'v41', name: '100ml Flip Cap', type: 'volume', value: '100ml', priceModifier: -200, stock: 35, sku: 'KV-CB-HAR-100' },
      { id: 'v42', name: '200ml Applicator Comb Bottle', type: 'volume', value: '200ml', priceModifier: 0, stock: 30, sku: 'KV-CB-HAR-200' }
    ]
  },
  {
    id: 'prod-cb-004',
    name: 'Kashmiri Kesar & Wild Turmeric Radiance Ubtan',
    slug: 'kashmiri-kesar-wild-turmeric-ubtan',
    departmentId: 'cosmetics-beauty',
    category: 'Face Care & Ayurvedic',
    subcategory: 'Ubtan & Face Packs',
    brand: "Kavi Botanical Alchemy",
    description: 'Stone-ground Kasturi manjal, Kashmiri saffron pistils, almond powder, and sandalwood bark. Gentle exfoliating mask for bridal luminosity.',
    shortDescription: 'Stone-ground saffron, wild turmeric, and almond brightening mask.',
    price: 849,
    discountPrice: 679,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 55,
    sku: 'KV-CB-UBT-04',
    isFeatured: true,
    variants: [
      { id: 'v43', name: '100g Jar', type: 'weight', value: '100g', priceModifier: 0, stock: 35, sku: 'KV-CB-UBT-100' },
      { id: 'v44', name: '250g Value Tub', type: 'weight', value: '250g', priceModifier: 500, stock: 20, sku: 'KV-CB-UBT-250' }
    ]
  }
];
