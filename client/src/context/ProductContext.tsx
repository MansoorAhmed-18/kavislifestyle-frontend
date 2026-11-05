import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCT_STORAGE_KEY = 'kavis_catalog_products_v5';
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
      isNewArrival: true,
    };

    // Track admin store updates for the 24-hour spotlight banner
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
        timestamp: Date.now(),
        addedAt: nowIso,
      };
      const filtered = Array.isArray(existing) ? existing.filter((u: any) => u.id !== newProduct.id) : [];
      localStorage.setItem('kavis_admin_store_updates', JSON.stringify([newUpdate, ...filtered]));
    } catch (e) {
      console.error('Failed to save admin store update', e);
    }

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
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
