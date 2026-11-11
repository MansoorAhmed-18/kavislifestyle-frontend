import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';

// Route-level code splitting for instant initial loading
const ShopPage = lazy(() => import('./pages/Shop/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/Product/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/Cart/CartPage'));
const CheckoutPage = lazy(() => import('./pages/Checkout/CheckoutPage'));
const WishlistPage = lazy(() => import('./pages/Wishlist/WishlistPage'));
const AccountPage = lazy(() => import('./pages/Account/AccountPage'));
const CategoriesPage = lazy(() => import('./pages/Categories/CategoriesPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const PolicyPage = lazy(() => import('./pages/Policy/PolicyPage'));
const AboutPage = lazy(() => import('./pages/About/AboutPage'));
const SupportPage = lazy(() => import('./pages/Support/SupportPage'));
const AdminDashboard = lazy(() => import('./admin/Dashboard/AdminDashboard'));

import { CartDrawer } from './components/CartDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DeliveryLocationModal } from './components/DeliveryLocationModal';

import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';

function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F4EDE0] stripe-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-3 border-[#FF6B5B] border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-xs font-bold text-[#14213D] tracking-wider uppercase">Loading...</span>
    </div>
  );
}

function GlobalCartDrawer() {
  const navigate = useNavigate();
  return (
    <CartDrawer
      onCheckoutClick={() => navigate('/checkout')}
      onViewCartClick={() => navigate('/cart')}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <ProductProvider>
          <OrderProvider>
            <CurrencyProvider>
              <WishlistProvider>
                <CartProvider>
                  <BrowserRouter>
                    <GlobalCartDrawer />
                    <DeliveryLocationModal />
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/product/:slug" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/account/orders" element={<AccountPage />} />
                        <Route path="/account/profile" element={<AccountPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/store-locator" element={<AboutPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/faq" element={<SupportPage />} />
                        <Route path="/auth/login" element={<LoginPage />} />
                        <Route path="/auth/register" element={<RegisterPage />} />
                        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/shipping-policy" element={<PolicyPage />} />
                        <Route path="/returns-policy" element={<PolicyPage />} />
                        <Route path="/terms" element={<PolicyPage />} />
                        <Route path="/privacy" element={<PolicyPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                      </Routes>
                    </Suspense>
                    {/* Fixed Responsive Mobile Bottom Navigation */}
                    <MobileBottomNav />
                  </BrowserRouter>
                </CartProvider>
              </WishlistProvider>
            </CurrencyProvider>
          </OrderProvider>
        </ProductProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
