import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { AnnouncementBar } from '../../components/AnnouncementBar';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const handleMoveToCart = (product: any) => {
    addToCart(product, product.variants ? product.variants[0] : undefined, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFEB] text-black pb-16 md:pb-0">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5DCD3]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black flex items-center gap-2">
              <Heart className="w-6 h-6 text-black fill-current" />
              <span>My Wishlist</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#5C554E] mt-1 font-medium">
              Your saved items across fashion, gourmet dry fruits, and fragrances.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-black border border-[#E5DCD3]">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5DCD3] shadow-xs max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#FAF6F2] text-black border border-[#E5DCD3] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-black">Your wishlist is empty</h2>
            <p className="text-xs text-[#5C554E] mt-1 mb-6">
              Save items you love by clicking the heart icon while browsing our four departments.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-bold text-xs hover:bg-[#2A2A2A] transition shadow-xs"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5DCD3] shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div
                  onClick={() => navigate(`/product/${product.slug || product.id}`)}
                  className="relative aspect-[4/5] bg-[#FAF6F2] cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-[#5C554E] hover:text-red-600 shadow-xs transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C554E]">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => navigate(`/product/${product.slug || product.id}`)}
                      className="text-xs font-bold text-black line-clamp-1 mt-0.5 hover:underline cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-black text-black">
                        {formatPrice(product.discountPrice ?? product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-[#5C554E] line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 px-3 bg-black hover:bg-[#2A2A2A] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
