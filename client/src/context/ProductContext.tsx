import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCT_STORAGE_KEY = 'kavis_catalog_products_v6';
const DELETED_PRODUCTS_KEY = 'kavis_deleted_product_ids_v1';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const deletedIds = new Set<string>(
        JSON.parse(localStorage.getItem(DELETED_PRODUCTS_KEY) || '[]')
      );
      const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: Product) => p.id));
          // Merge any newly introduced initial products that haven't been deleted
          const newlyAddedInitial = INITIAL_PRODUCTS.filter(
            (p) => !existingIds.has(p.id) && !deletedIds.has(p.id)
          );
          // Sync any initial product specifications (photos, price updates)
          const updatedParsed = parsed
            .filter((p: Product) => !deletedIds.has(p.id))
            .map((p: Product) => {
              const initialMatch = INITIAL_PRODUCTS.find((init) => init.id === p.id);
              return initialMatch ? { ...p, ...initialMatch } : p;
            });
          return [...newlyAddedInitial, ...updatedParsed];
        }
      }
      // If no saved data, load initial products excluding any deleted ones
      return INITIAL_PRODUCTS.filter((p) => !deletedIds.has(p.id));
    } catch (e) {
      console.error('Failed to load products from localStorage', e);
      return INITIAL_PRODUCTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Synchronize products from Supabase Cloud if products table exists
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped: Product[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            slug: row.slug || row.id,
            category: row.category,
            departmentId: row.department_id,
            price: Number(row.price),
            discountPrice: row.discount_price ? Number(row.discount_price) : undefined,
            rating: Number(row.rating || 4.8),
            reviewsCount: Number(row.reviews_count || 1),
            stock: Number(row.stock || 15),
            images: Array.isArray(row.images) ? row.images : (typeof row.images === 'string' ? JSON.parse(row.images) : []),
            description: row.description || '',
            shortDescription: row.short_description || row.name,
            variants: Array.isArray(row.variants) ? row.variants : [],
            isNewArrival: Boolean(row.is_new_arrival),
            isBestSeller: Boolean(row.is_best_seller),
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));

          setProducts((prev) => {
            const map = new Map<string, Product>();
            prev.forEach((p) => map.set(p.id, p));
            mapped.forEach((p) => map.set(p.id, p));
            return Array.from(map.values());
          });
        }
      } catch {
        // Fallback silently
      }
    })();
  }, []);

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const slug =
      productData.slug ||
      productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const nowIso = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      slug,
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 1,
      stock: Number(productData.stock) || 10,
      price: Number(productData.price),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
      createdAt: productData.createdAt || nowIso,
      updatedAt: nowIso,
      isNewArrival: true,
    };

    // Track admin store updates for the 2 to 3 days spotlight banner
    try {
      const existing = JSON.parse(localStorage.getItem('kavis_admin_store_updates') || '[]');
      const newUpdate = {
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category,
        departmentId: newProduct.departmentId,
        image: newProduct.images && newProduct.images[0] ? newProduct.images[0] : '',
        price: newProduct.discountPrice || newProduct.price,
        originalPrice: newProduct.price,
        shortDescription: newProduct.shortDescription || newProduct.name,
        slug: newProduct.slug,
        timestamp: Date.now(),
        addedAt: nowIso,
        updatedAt: nowIso,
        isEdited: false,
      };
      const filtered = Array.isArray(existing) ? existing.filter((u: any) => u.id !== newProduct.id) : [];
      localStorage.setItem('kavis_admin_store_updates', JSON.stringify([newUpdate, ...filtered]));
    } catch (e) {
      console.error('Failed to save admin store update', e);
    }

    setProducts((prev) => [newProduct, ...prev]);

    // Push new product to Supabase Cloud if configured
    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from('products').upsert({
            id: newProduct.id,
            name: newProduct.name,
            department_id: newProduct.departmentId,
            category: newProduct.category,
            price: newProduct.price,
            discount_price: newProduct.discountPrice || null,
            rating: newProduct.rating,
            reviews_count: newProduct.reviewsCount,
            stock: newProduct.stock,
            images: newProduct.images,
            description: newProduct.description,
            short_description: newProduct.shortDescription,
            variants: newProduct.variants || [],
            is_new_arrival: newProduct.isNewArrival,
            is_best_seller: newProduct.isBestSeller,
            created_at: newProduct.createdAt,
            updated_at: newProduct.updatedAt,
          });
        } catch {}
      })();
    }

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const nowIso = new Date().toISOString();
    const nowMs = Date.now();

    setProducts((prev) => {
      const updatedList = prev.map((p) => {
        if (p.id !== id) return p;
        const mergedProduct: Product = {
          ...p,
          ...updates,
          updatedAt: nowIso,
        };

        // Track admin store update for the top banner (persists for 2 to 3 days)
        try {
          const existing = JSON.parse(localStorage.getItem('kavis_admin_store_updates') || '[]');
          const newUpdate = {
            id: mergedProduct.id,
            name: mergedProduct.name,
            category: mergedProduct.category,
            departmentId: mergedProduct.departmentId,
            image: mergedProduct.images && mergedProduct.images[0] ? mergedProduct.images[0] : '',
            price: mergedProduct.discountPrice || mergedProduct.price,
            originalPrice: mergedProduct.price,
            shortDescription: mergedProduct.shortDescription || mergedProduct.name,
            slug: mergedProduct.slug || mergedProduct.id,
            timestamp: nowMs,
            updatedAt: nowIso,
            isEdited: true,
          };
          const filtered = Array.isArray(existing) ? existing.filter((u: any) => u.id !== mergedProduct.id) : [];
          localStorage.setItem('kavis_admin_store_updates', JSON.stringify([newUpdate, ...filtered]));
        } catch (e) {
          console.error('Failed to record update in admin store updates', e);
        }

        return mergedProduct;
      });

      try {
        localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (err) {
        console.error('Failed to save updated catalog', err);
      }

      return updatedList;
    });
  };

  const deleteProduct = (id: string) => {
    // 1. Record in deleted IDs list so it never reappears
    try {
      const deletedList: string[] = JSON.parse(
        localStorage.getItem(DELETED_PRODUCTS_KEY) || '[]'
      );
      if (!deletedList.includes(id)) {
        deletedList.push(id);
        localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deletedList));
      }
    } catch (e) {
      console.error('Failed to save deleted ID', e);
    }

    // 2. Remove product immediately from admin store updates in localStorage
    try {
      const storedUpdates = localStorage.getItem('kavis_admin_store_updates');
      if (storedUpdates) {
        const parsed = JSON.parse(storedUpdates);
        if (Array.isArray(parsed)) {
          const productToDelete = products.find((p) => p.id === id);
          const filtered = parsed.filter(
            (u: any) =>
              u.id !== id &&
              (!productToDelete || u.name?.toLowerCase() !== productToDelete.name?.toLowerCase())
          );
          localStorage.setItem('kavis_admin_store_updates', JSON.stringify(filtered));
        }
      }
    } catch (e) {
      console.error('Failed to remove admin update on product delete', e);
    }

    // 3. Update products state and sync with storage
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update catalog storage', err);
      }
      return updated;
    });

    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase.from('products').delete().eq('id', id);
        } catch {}
      })();
    }
  };

  const getProductBySlug = (slug: string) => {
    return products.find(
      (p) => p.slug === slug || p.id === slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,
        getProductById
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
