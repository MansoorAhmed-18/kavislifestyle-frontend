import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import ProductDetailPage from './pages/Product/ProductDetailPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import WishlistPage from './pages/Wishlist/WishlistPage';
import AccountPage from './pages/Account/AccountPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import PolicyPage from './pages/Policy/PolicyPage';
import AboutPage from './pages/About/AboutPage';
import SupportPage from './pages/Support/SupportPage';
import AdminDashboard from './admin/Dashboard/AdminDashboard';
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
