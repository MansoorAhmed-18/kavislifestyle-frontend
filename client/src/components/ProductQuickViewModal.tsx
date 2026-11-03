import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen?: boolean;
  onClose: () => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isOpen = true,
  onClose,
  onViewDetails
}) => {
  if (!product || !isOpen) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const unitPrice = (product.discountPrice ?? product.price) + (selectedVariant?.priceModifier ?? 0);
  const originalPrice = product.price + (selectedVariant?.priceModifier ?? 0);
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 border border-[#F2D9A6]/40 my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition z-20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Image Gallery */}
            <div className="p-6 bg-[#F7F2EB] flex flex-col justify-between">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-xs mb-3">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-16 rounded-md overflow-hidden border-2 transition ${
                        selectedImage === img ? 'border-[#F26B4F]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Buying options */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#173F46]/10 text-[#173F46]">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="text-xs text-gray-500">â€¢ {product.brand}</span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-[#173F46] leading-snug">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {product.rating.toFixed(1)} ({product.reviewsCount} customer reviews)
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#173F46]">
                    {formatPrice(unitPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#F26B4F] text-white">
                        {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'SPECIAL'}
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Variants Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-gray-700 block mb-1.5 uppercase tracking-wide">
                      Select {product?.variants?.[0]?.type?.toUpperCase?.()}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                            selectedVariant?.id === v.id
                              ? 'bg-[#173F46] text-white border-[#173F46] shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-[#173F46]'
                          }`}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-semibold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#F26B4F] hover:bg-[#df5335] text-white active:scale-98'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart ({formatPrice(unitPrice * quantity)})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-xl border transition ${
                      isFavorited
                        ? 'border-[#F26B4F] bg-[#F26B4F]/10 text-[#F26B4F]'
                        : 'border-gray-200 text-gray-600 hover:border-[#F26B4F] hover:text-[#F26B4F]'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#173F46]" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#173F46]" />
                  <span>Pan-India Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-[#173F46]" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
