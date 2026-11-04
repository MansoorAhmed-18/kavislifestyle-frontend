import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Share2,
  Check,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useProducts } from '../../context/ProductContext';
import { useLocation } from '../../context/LocationContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ProductCard } from '../../components/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { getProductBySlug, products } = useProducts();

  // Find product by slug or id from dynamic catalog
  const product: Product | undefined = getProductBySlug(slug || '');

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  const [isAdded, setIsAdded] = useState(false);

  const { location } = useLocation();

  useEffect(() => {
    if (location.isSet) {
      setPincode(location.pincode);
      setDeliveryEstimate(`Express Delivery to ${location.city} (${location.pincode}): Arriving in 2 to 3 Business Days via Bluedart. Free shipping unlocked!`);
    }
  }, [location]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5EFEB] text-black pb-32 md:pb-0">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-black text-black">Product Not Found</h2>
          <p className="text-xs text-[#5C554E] mt-2 mb-6">
            The product you are looking for might have been updated or moved.
          </p>
          <Link
            to="/shop"
            className="px-6 py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-[#2A2A2A] transition"
          >
            Explore Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = (product.discountPrice ?? product.price) + (selectedVariant?.priceModifier ?? 0);
  const originalPrice = product.price + (selectedVariant?.priceModifier ?? 0);
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const isFavorited = isInWishlist(product.id);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setDeliveryEstimate(`Express Delivery to ${pincode}: Arriving in 3 to 4 Business Days (Delivery/BlueDart). Free shipping unlocked!`);
    } else {
      setDeliveryEstimate('Please enter a valid 6-digit Indian delivery pincode.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const relatedProducts = products
    .filter(p => p.departmentId === product.departmentId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFEB] text-black pb-32 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-[#5C554E]">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#5C554E]" />
          <Link to="/shop" className="hover:text-black">Shop</Link>
          <ChevronRight className="w-3 h-3 text-[#5C554E]" />
          <Link to={`/shop?dept=${product.departmentId}`} className="hover:text-black capitalize">
            {product.departmentId.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3 h-3 text-[#5C554E]" />
          <span className="font-bold text-black truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DCD3] shadow-xs">
          
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Featured Image Frame */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF6F2] border border-[#E5DCD3]">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-black bg-black text-white shadow-xs uppercase tracking-wider">
                  {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'SPECIAL OFFER'}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                      selectedImage === img
                        ? 'border-black shadow-xs'
                        : 'border-[#E5DCD3] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category, Brand, & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FAF6F2] text-black border border-[#E5DCD3]">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="text-xs text-[#5C554E] font-medium">By {product.brand}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-black bg-[#FAF6F2] px-2 py-0.5 rounded-md border border-[#E5DCD3]">
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-[#5C554E] font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-black leading-snug">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-black">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-[#5C554E] line-through font-normal">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Inclusive of all taxes
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-4 text-xs sm:text-sm text-[#5C554E] leading-relaxed font-medium">
                {product.description}
              </p>

              {/* Variant Selectors (Size / Weight / Volume / Shade) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6 pt-5 border-t border-[#E5DCD3]">
                  <label className="text-xs font-bold uppercase tracking-wider text-black block mb-2.5">
                    Select {(product.variants[0].type || 'Option').toUpperCase()}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                          selectedVariant?.id === v.id
                            ? 'bg-black text-white border-black shadow-xs'
                            : 'bg-white text-black border-[#E5DCD3] hover:border-black'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Buy Buttons */}
              <div className="mt-6 pt-5 border-t border-[#E5DCD3] space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-black uppercase tracking-wide">Quantity:</span>
                  <div className="flex items-center border border-[#E5DCD3] rounded-xl overflow-hidden bg-[#FAF6F2]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-black hover:bg-[#E5DCD3] transition font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-black text-black">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-black hover:bg-[#E5DCD3] transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs text-[#5C554E]">
                    ({product.stock} units currently in stock)
                  </span>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm active:scale-98 ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-black hover:bg-[#2A2A2A] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart ({formatPrice(currentPrice * quantity)})</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-[#FAF6F2] text-black border border-black flex items-center justify-center gap-2 transition shadow-xs active:scale-98"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-xl border transition flex items-center justify-center ${
                      isFavorited
                        ? 'border-black bg-black text-white'
                        : 'border-[#E5DCD3] text-black hover:border-black'
                    }`}
                    title={isFavorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Pincode Delivery Checker */}
              <div className="mt-6 pt-5 border-t border-[#E5DCD3]">
                <span className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
                  Check Doorstep Delivery & COD Availability
                </span>
                <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode (e.g. 600040)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs border border-[#E5DCD3] rounded-xl outline-none focus:border-black font-medium bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white font-bold text-xs rounded-xl hover:bg-[#2A2A2A] transition"
                  >
                    Check
                  </button>
                </form>

                {deliveryEstimate && (
                  <p className="mt-2 text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-black flex-shrink-0" />
                    <span>{deliveryEstimate}</span>
                  </p>
                )}
              </div>

              {/* Trust Badges Strip */}
              <div className="mt-6 pt-5 border-t border-[#E5DCD3] grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3]">
                  <ShieldCheck className="w-4 h-4 text-black mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-black block">100% Genuine</span>
                  <span className="text-[10px] text-[#5C554E]">Brand authentic</span>
                </div>
                <div className="p-3 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3]">
                  <RefreshCw className="w-4 h-4 text-black mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-black block">7-Day Returns</span>
                  <span className="text-[10px] text-[#5C554E]">Doorstep pickup</span>
                </div>
                <div className="p-3 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3]">
                  <Truck className="w-4 h-4 text-black mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-black block">Express Dispatch</span>
                  <span className="text-[10px] text-[#5C554E]">Orders ship in 24h</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Tabbed Specifications & Customer Reviews */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DCD3] shadow-xs">
          <div className="flex border-b border-[#E5DCD3] mb-6 gap-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 ${
                activeTab === 'details'
                  ? 'border-black text-black'
                  : 'border-transparent text-[#5C554E] hover:text-black'
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 ${
                activeTab === 'specs'
                  ? 'border-black text-black'
                  : 'border-transparent text-[#5C554E] hover:text-black'
              }`}
            >
              Specifications & Origin
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-black text-black'
                  : 'border-transparent text-[#5C554E] hover:text-black'
              }`}
            >
              Customer Reviews ({product.reviewsCount})
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-4 text-xs sm:text-sm text-[#5C554E] leading-relaxed">
              <p>{product.description}</p>
              <p>
                Each item at <strong>Kavi's Lifestyle</strong> is backed by our strict brand authenticity guarantee. Hand-inspected before packaging and shipped directly in protective boutique boxes to safeguard quality during transit.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF6F2] rounded-xl flex justify-between">
                  <span className="text-[#5C554E] font-medium">Department</span>
                  <span className="font-bold text-black capitalize">{product.departmentId.replace('-', ' ')}</span>
                </div>
                <div className="p-3 bg-[#FAF6F2] rounded-xl flex justify-between">
                  <span className="text-[#5C554E] font-medium">Category</span>
                  <span className="font-bold text-black">{product.category}</span>
                </div>
                <div className="p-3 bg-[#FAF6F2] rounded-xl flex justify-between">
                  <span className="text-[#5C554E] font-medium">Curator Brand</span>
                  <span className="font-bold text-black">Kavi's Boutique (Chennai, India)</span>
                </div>
                {product.attributes &&
                  Object.entries(product.attributes).map(([k, v]) => (
                    <div key={k} className="p-3 bg-[#FAF6F2] rounded-xl flex justify-between">
                      <span className="text-[#5C554E] font-medium">{k}</span>
                      <span className="font-bold text-black">{String(v)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF6F2] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-black">{product.rating.toFixed(1)} / 5.0</div>
                  <div className="text-xs text-[#5C554E] mt-0.5">Based on {product.reviewsCount} verified purchases</div>
                </div>
                <div className="flex gap-1 text-black">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-black text-black" />
                  ))}
                </div>
              </div>

              {/* Sample Review */}
              <div className="p-4 border border-[#E5DCD3] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-black">Priyadarshini Sundaram (Verified Buyer)</span>
                  <span className="text-[#5C554E]">Verified Pan-India Delivery</span>
                </div>
                <p className="text-xs text-[#5C554E] pt-1">
                  "Exceeded all expectations. Exceptional craftsmanship, authentic fabric feel, and delivered in pristine boutique packaging. Highly recommended!"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-black">
              More from this Department
            </h2>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-6 lg:grid-cols-4 mobile-product-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Mobile Bottom Quick Buy Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5DCD3] px-3 py-2 flex items-center gap-2 shadow-lg">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 ${
            isAdded ? 'bg-emerald-700 text-white' : 'bg-black text-white'
          }`}
        >
          {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          <span>{isAdded ? 'Added' : 'Add to Bag'}</span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-[#E44A2D] text-white flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
        >
          <span>Buy Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <Footer />
    </div>
  );
}
