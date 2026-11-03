import { Product } from '../types';
import { Order } from '../context/OrderContext';

const SEARCH_HISTORY_KEY = 'kavis_search_history';

/**
 * Saves a search term to localStorage (keeps last 20 unique queries)
 */
export function saveSearchQuery(query: string, userEmail?: string): void {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return;

  try {
    const key = userEmail ? `${SEARCH_HISTORY_KEY}_${userEmail.toLowerCase().trim()}` : SEARCH_HISTORY_KEY;
    const existing = getSearchHistory(userEmail);
    // Remove if already present and prepend to top
    const updated = [clean, ...existing.filter((item) => item.toLowerCase() !== clean)].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(updated));

    // Also update generic key as backup
    if (userEmail) {
      const generic = getSearchHistory();
      const updatedGeneric = [clean, ...generic.filter((item) => item.toLowerCase() !== clean)].slice(0, 20);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedGeneric));
    }
  } catch (e) {
    console.error('Failed to save search history', e);
  }
}

/**
 * Retrieves the user's recent search queries
 */
export function getSearchHistory(userEmail?: string): string[] {
  try {
    if (userEmail) {
      const userKey = `${SEARCH_HISTORY_KEY}_${userEmail.toLowerCase().trim()}`;
      const savedUser = localStorage.getItem(userKey);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read search history', e);
  }
  return [];
}

/**
 * Clears search history
 */
export function clearSearchHistory(userEmail?: string): void {
  try {
    if (userEmail) {
      localStorage.removeItem(`${SEARCH_HISTORY_KEY}_${userEmail.toLowerCase().trim()}`);
    }
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear search history', e);
  }
}

export interface PersonalizedItem {
  product: Product;
  score: number;
  reasons: string[];
}

/**
 * Computes personalized product recommendations based on:
 * 1. User's previous orders (products, categories, departments)
 * 2. User's search history (keywords and interests)
 * 3. Store quality signals (bestsellers, ratings, discounts)
 */
export function getPersonalizedProducts(
  products: Product[],
  orders: Order[] = [],
  searchHistory: string[] = []
): PersonalizedItem[] {
  if (!products || products.length === 0) return [];

  // 1. Extract ordered products and categories
  const orderedProductNames = new Set<string>();
  const orderedCategories = new Map<string, number>();
  const orderedDepartments = new Map<string, number>();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const itemNameLower = item.name.toLowerCase();
      orderedProductNames.add(itemNameLower);

      // Match item with a catalog product to derive category & department
      const matchedCatalogProduct = products.find(
        (p) =>
          p.id === item.id ||
          p.name.toLowerCase() === itemNameLower ||
          itemNameLower.includes(p.name.toLowerCase()) ||
          p.name.toLowerCase().includes(itemNameLower)
      );

      if (matchedCatalogProduct) {
        const cat = matchedCatalogProduct.category;
        const dept = matchedCatalogProduct.departmentId;
        orderedCategories.set(cat, (orderedCategories.get(cat) || 0) + 1);
        orderedDepartments.set(dept, (orderedDepartments.get(dept) || 0) + 1);
      }
    });
  });

  // Recent searches (prioritize top 5 most recent)
  const recentSearches = searchHistory.slice(0, 5).map((s) => s.toLowerCase().trim());

  // 2. Score each product
  const scoredItems: PersonalizedItem[] = products.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    const prodName = product.name.toLowerCase();
    const prodCat = product.category.toLowerCase();
    const prodSub = (product.subcategory || '').toLowerCase();
    const prodDesc = (product.description || '').toLowerCase();
    const prodDept = product.departmentId;

    // --- Order History Affinity ---
    if (orderedProductNames.has(prodName)) {
      score += 45;
      reasons.push('Previously ordered item');
    }

    if (orderedCategories.has(product.category)) {
      const count = orderedCategories.get(product.category) || 1;
      score += Math.min(35, 25 + count * 4);
      reasons.push(`Based on your orders in ${product.category}`);
    } else if (orderedDepartments.has(prodDept)) {
      const count = orderedDepartments.get(prodDept) || 1;
      score += Math.min(20, 12 + count * 3);
      reasons.push('Popular in your preferred department');
    }

    // --- Search History Affinity ---
    recentSearches.forEach((term, index) => {
      // Recency multiplier: most recent search has highest weight
      const recencyWeight = 1 - index * 0.12; // 1.0, 0.88, 0.76...

      if (prodName.includes(term)) {
        const pts = Math.round(35 * recencyWeight);
        score += pts;
        reasons.push(`Matches search "${term}"`);
      } else if (prodCat.includes(term) || prodSub.includes(term)) {
        const pts = Math.round(25 * recencyWeight);
        score += pts;
        reasons.push(`Matches search interest "${term}"`);
      } else if (prodDesc.includes(term)) {
        const pts = Math.round(14 * recencyWeight);
        score += pts;
      }
    });

    // --- Store Quality Baseline ---
    if (product.isBestSeller) score += 8;
    if (product.isFeatured) score += 6;
    if (product.rating && product.rating >= 4.5) score += 5;
    if (product.discountPercentage && product.discountPercentage >= 20) score += 4;

    return { product, score, reasons: Array.from(new Set(reasons)) };
  });

  // Sort descending by personalization score
  return scoredItems.sort((a, b) => b.score - a.score);
}

/**
 * Returns summary explanation and badges for why products were personalized
 */
export function getPersonalizationSummary(
  orders: Order[] = [],
  searchHistory: string[] = [],
  catalog: Product[] = []
): {
  title: string;
  subtitle: string;
  tags: string[];
  hasPersonalization: boolean;
} {
  const tags: string[] = [];
  const recentSearches = searchHistory.slice(0, 3);

  // Extract order highlights
  const orderedCatNames = new Set<string>();
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const matched = catalog.find(
        (p) =>
          p.id === item.id ||
          p.name.toLowerCase().includes(item.name.toLowerCase()) ||
          item.name.toLowerCase().includes(p.name.toLowerCase())
      );
      if (matched) orderedCatNames.add(matched.category);
    });
  });

  if (orderedCatNames.size > 0) {
    const list = Array.from(orderedCatNames).slice(0, 2).join(' & ');
    tags.push(`Orders: ${list}`);
  }

  if (recentSearches.length > 0) {
    const list = recentSearches.slice(0, 3).map((s) => `"${s}"`).join(', ');
    tags.push(`Searches: ${list}`);
  }

  const hasPersonalization = tags.length > 0;

  if (hasPersonalization) {
    return {
      title: 'Recommended For You',
      subtitle: 'Smartly curated based on your past orders and recent search preferences.',
      tags,
      hasPersonalization: true,
    };
  }

  return {
    title: 'Curated For You',
    subtitle: 'Handpicked bestsellers, top-rated essentials, and trending artisanal products.',
    tags: ['Flagship Bestsellers', 'Top Customer Rated', 'Artisanal Essentials'],
    hasPersonalization: false,
  };
}

