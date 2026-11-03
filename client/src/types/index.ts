export type DepartmentId = "womens-fashion" | "dry-fruits-nuts" | "perfumes-fragrances" | "cosmetics-beauty";

export interface Category {
  id: string;
  name: string;
  slug: string;
  departmentId?: string;
  description?: string;
  image?: string;
  subcategories?: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  type?: string;
  priceModifier?: number;
  stock?: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: string[];
  category: string;
  subcategory?: string;
  departmentId: string;
  rating: number;
  reviewsCount: number;
  shortDescription: string;
  variants?: ProductVariant[];
  stock: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  attributes?: Record<string, string | number | boolean>;
  sku?: string;
  brand?: string;
  description?: string;
  createdAt?: string;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: string;
  avatarUrl?: string;
  createdAt?: string;
}
