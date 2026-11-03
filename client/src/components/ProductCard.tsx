import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

interface ProductCardProps {
  product: Product;
  onOpenQuickView?: (product: Product) => void;
  recommendationReason?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  recommendationReason,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const displayPrice = (product.discountPrice ?? product.price) + (selectedVariant?.priceModifier ?? 0);
  const originalPrice = product.price + (selectedVariant?.priceModifier ?? 0);
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);

  const handleCardClick = () => {
    navigate(`/product/${product.slug || product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E5DCD3] hover:border-black shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      {/* Product Image Stage */}
      <div className="relative w-full aspect-[4/5] bg-[#FAF6F2] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-10 max-w-[85%]">
          {recommendationReason && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide bg-[#E44A2D] text-white shadow-xs flex items-center gap-1 line-clamp-1">
              <Sparkles className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{recommendationReason}</span>
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide uppercase bg-black text-white shadow-xs">
              {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'SALE'}
            </span>
          )}
          {product.isBestSeller && !recommendationReason && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-white text-black border border-[#E5DCD3] shadow-xs">
              Popular
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-150 z-10 ${
            isFavorited
              ? 'bg-black text-white shadow-sm'
              : 'bg-white/90 text-black hover:bg-black hover:text-white shadow-xs'
          }`}
          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          {/* Department Tag & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] uppercase font-bold text-[#5C554E] tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-black bg-[#FAF6F2] px-2 py-0.5 rounded border border-[#E5DCD3]">
              <Star className="w-3.5 h-3.5 fill-black text-black" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[#5C554E] font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm text-black line-clamp-1 group-hover:underline transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#5C554E] line-clamp-1 mt-1 leading-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Variant Pills if available */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.variants.slice(0, 3).map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedVariant?.id === variant.id
                    ? 'bg-black text-white'
                    : 'bg-[#FAF6F2] text-black border border-[#E5DCD3] hover:border-black'
                }`}
              >
                {variant.value}
              </button>
            ))}
            {product.variants.length > 3 && (
              <span className="text-xs text-[#5C554E] self-center">
                +{product.variants.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price & Action Row */}
        <div className="pt-2.5 border-t border-[#E5DCD3] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-black">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#5C554E] line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAddedRecently
                ? 'bg-emerald-700 text-white'
                : 'bg-black hover:bg-[#2A2A2A] text-white active:scale-95'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : product.stock === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
