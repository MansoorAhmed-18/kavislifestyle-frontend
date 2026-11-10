import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowLeft,
  X,
  CheckCircle2,
  Check,
  Box,
  Lock,
  LogOut,
  Eye,
  Truck,
  Filter,
  DollarSign,
  Upload,
  Trash2,
  Pencil,
  Copy,
  ExternalLink,
  Database,
  RefreshCw,
  RotateCcw,
  Video
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders, OrderStatus, Order } from '../../context/OrderContext';
import { useCurrency } from '../../context/CurrencyContext';
import { DEPARTMENTS } from '../../data/departments';
import { BrandLogo } from '../../components/BrandLogo';
import { Product } from '../../types';
import { getVideoFromIDB } from '../../utils/videoStorage';

const AdminReturnVideoPlayer: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>(videoUrl);

  useEffect(() => {
    if (videoUrl?.startsWith('idb:')) {
      const key = videoUrl.replace('idb:', '');
      getVideoFromIDB(key).then((full) => {
        if (full) setResolvedUrl(full);
      });
    } else {
      setResolvedUrl(videoUrl);
    }
  }, [videoUrl]);

  if (!resolvedUrl) {
    return (
      <div className="p-8 bg-slate-100 rounded-2xl text-center text-xs text-slate-500 border border-dashed border-slate-300">
        No video uploaded
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-slate-300 bg-black shadow-md">
      <video
        src={resolvedUrl}
        controls
        playsInline
        preload="metadata"
        className="w-full max-h-72 rounded-2xl object-contain bg-black"
      />
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loginAsAdmin, logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, updateOrderStatus, approveReturnRequest, rejectReturnRequest, supabaseTableStatus, refreshDatabaseStatus } = useOrders();
  const [sqlCopied, setSqlCopied] = useState(false);
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);

  const SUPABASE_SETUP_SQL = `-- 1. Create orders table for Kavi's Lifestyle
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT,
    user_email TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    status TEXT NOT NULL DEFAULT 'placed',
    subtotal NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    shipping_charge NUMERIC DEFAULT 0,
    total_amount NUMERIC DEFAULT 0,
    customer JSONB DEFAULT '{}'::jsonb,
    items JSONB DEFAULT '[]'::jsonb,
    payment_method TEXT DEFAULT 'Prepaid Online',
    payment_status TEXT DEFAULT 'paid',
    carrier TEXT DEFAULT 'BlueDart Express',
    tracking_number TEXT DEFAULT '',
    raw_data JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public update orders" ON public.orders;
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  const handleCheckDb = async () => {
    setIsRefreshingDb(true);
    await refreshDatabaseStatus();
    setTimeout(() => setIsRefreshingDb(false), 800);
  };

  // Strictly format all prices and revenues in Indian Rupees (₹) for the admin dashboard
  const formatRupees = (amount: number | string | undefined | null) => {
    const num = Number(amount) || 0;
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  };

  // Navigation tab state (Clean 4-tab admin navigation)
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'returns'>('overview');

  // Orders filter & selection state
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Returns & Verification state
  const [returnFilter, setReturnFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [returnRemarksMap, setReturnRemarksMap] = useState<{ [orderId: string]: string }>({});
  const [refundAmountMap, setRefundAmountMap] = useState<{ [orderId: string]: string }>({});
  const [actionSuccessMsg, setActionSuccessMsg] = useState<{ [orderId: string]: string }>({});

  const returnOrdersList = orders.filter((o) => !!o.returnRequest);
  const pendingReturnsCount = returnOrdersList.filter((o) => o.returnRequest?.status === 'pending').length;
  const approvedReturnsCount = returnOrdersList.filter((o) => o.returnRequest?.status === 'approved').length;
  const rejectedReturnsCount = returnOrdersList.filter((o) => o.returnRequest?.status === 'rejected').length;
  const filteredReturnOrders =
    returnFilter === 'all'
      ? returnOrdersList
      : returnOrdersList.filter((o) => o.returnRequest?.status === returnFilter);

  // Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productSavedSuccess, setProductSavedSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Edit Product Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productEditSuccess, setProductEditSuccess] = useState(false);
  const editFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [editProductForm, setEditProductForm] = useState({
    name: '',
    departmentId: 'womens-fashion',
    category: '',
    brand: '',
    price: '',
    discountPrice: '',
    stock: '',
    images: [''],
    shortDescription: '',
    description: '',
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    departmentId: 'womens-fashion',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    images: [''],
    shortDescription: '',
    description: ''
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setNewProduct(prev => ({
          ...prev,
          images: [dataUrl]
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Admin login form state (for unauthenticated gate)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // 1. GATE: If user is not admin, show secure Admin Login
  if (!user || user.role !== 'admin') {
    const handleAdminLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminEmail === 'admin@kavislifestyle.com' && adminPassword === 'admin123') {
        loginAsAdmin();
      } else {
        setLoginError('Invalid administrator credentials. Use demo button below or email: admin@kavislifestyle.com, pass: admin123');
      }
    };

    return (
      <div className="min-h-screen bg-[#F5EFEB] flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E5DCD3] shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              Kavi's Lifestyle Admin Portal
            </h1>
            <p className="text-xs text-[#5C554E]">
              Protected store management dashboard. Restricted to authorized administrators only.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-black block mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@kavislifestyle.com"
                className="w-full px-3.5 py-2.5 text-xs border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-black block mb-1">Access Password / PIN</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E44A2D] text-white font-bold text-xs rounded-xl hover:bg-[#cc3d22] transition shadow-xs"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-[#E5DCD3] text-center space-y-3">
            <button
              onClick={() => loginAsAdmin()}
              className="w-full py-2.5 bg-[#FAF6F2] hover:bg-[#EFE7DE] border border-[#E5DCD3] text-black font-bold text-xs rounded-xl transition"
            >
              ⚡ Quick Admin Access (Demo Login)
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#5C554E] hover:text-black font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Realistic statistics calculated dynamically
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter((p) => p.stock < 15);
  const filteredOrders =
    orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter);

  // Handle Add Product Form
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill in product name and price.');
      return;
    }

    addProduct({
      name: newProduct.name,
      departmentId: newProduct.departmentId as any,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      discountPrice: newProduct.discountPrice ? parseFloat(newProduct.discountPrice) : undefined,
      stock: parseInt(newProduct.stock) || 10,
      images: newProduct.images,
      shortDescription: newProduct.shortDescription || newProduct.name,
      description: newProduct.description || `${newProduct.name} - Handcrafted and curated by Kavi's Lifestyle.`,
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: true
    });

    setProductSavedSuccess(true);
    setTimeout(() => {
      setProductSavedSuccess(false);
      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        departmentId: 'womens-fashion',
        category: '',
        price: '',
        discountPrice: '',
        stock: '',
        images: [''],
        shortDescription: '',
        description: ''
      });
    }, 1200);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setEditProductForm({
      name: p.name,
      departmentId: p.departmentId || 'womens-fashion',
      category: p.category,
      brand: p.brand || '',
      price: p.price ? p.price.toString() : '',
      discountPrice: p.discountPrice ? p.discountPrice.toString() : '',
      stock: p.stock !== undefined ? p.stock.toString() : '10',
      images: p.images && p.images.length > 0 ? [...p.images] : [''],
      shortDescription: p.shortDescription || '',
      description: p.description || '',
    });
    setProductEditSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleEditImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setEditProductForm((prev) => ({
          ...prev,
          images: [base64, ...(prev.images.slice(1) || [])],
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;

    const priceNum = parseFloat(editProductForm.price) || 0;
    const discountPriceNum = editProductForm.discountPrice ? parseFloat(editProductForm.discountPrice) : undefined;
    const discountPercentage = discountPriceNum && discountPriceNum < priceNum
      ? Math.round(((priceNum - discountPriceNum) / priceNum) * 100)
      : undefined;

    updateProduct(editingProductId, {
      name: editProductForm.name.trim(),
      departmentId: editProductForm.departmentId as any,
      category: editProductForm.category.trim(),
      brand: editProductForm.brand.trim() || undefined,
      price: priceNum,
      discountPrice: discountPriceNum,
      discountPercentage,
      stock: parseInt(editProductForm.stock) || 10,
      images: editProductForm.images.filter(Boolean),
      shortDescription: editProductForm.shortDescription || editProductForm.name,
      description: editProductForm.description,
    });

    setProductEditSuccess(true);
    setTimeout(() => {
      setProductEditSuccess(false);
      setIsEditModalOpen(false);
      setEditingProductId(null);
    }, 1000);
  };

  const PRESET_IMAGES = [
    { label: 'Silk Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Dry Fruits', url: 'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&w=600&q=80' },
    { label: 'Luxury Perfume', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80' },
    { label: 'Lip Care', url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="min-h-screen bg-[#F4EDE0] stripe-cream flex flex-col font-sans text-[#14213D]">
      {/* Top Admin Navbar (45% Deep Navy #14213D + Stripes) */}
      <header className="bg-[#14213D] stripe-navy text-[#F4EDE0] px-2.5 sm:px-6 py-2 sm:py-3 flex items-center justify-between border-b border-[#1D2D50] shadow-md gap-1.5 sm:gap-4 overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          <Link
            to="/"
            title="Back to Storefront"
            className="flex items-center gap-1 text-xs text-[#F4EDE0]/90 hover:text-white transition font-medium shrink-0 p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B5B] shrink-0" />
            <span className="hidden sm:inline font-bold">Storefront</span>
          </Link>
          <div className="h-4 w-px bg-white/20 shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0">
            <BrandLogo variant="icon" size="sm" className="shrink-0 scale-90 sm:scale-100" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-extrabold text-xs sm:text-sm tracking-wide truncate text-[#F4EDE0] max-w-[110px] xs:max-w-[150px] sm:max-w-none">
                KAVI'S LIFESTYLE
              </span>
              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-[#FF6B5B] text-white shrink-0 tracking-wider">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs shrink-0">
          <span className="hidden md:inline text-[#F4EDE0]/80">
            Logged in as: <strong className="text-white">Admin (Kavi)</strong>
          </span>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-white/10 hover:bg-[#FF6B5B] hover:text-white text-white font-bold transition text-xs whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar / Mobile Tabs */}
        <aside className="w-full md:w-64 bg-[#FAF6EE] stripe-card border-b md:border-b-0 md:border-r border-[#E5D8C5] p-2.5 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`shrink-0 md:w-full flex items-center gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#FF6B5B] text-white shadow-xs'
                : 'text-[#14213D]/70 hover:bg-[#F4EDE0] hover:text-[#14213D]'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`shrink-0 md:w-full flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#FF6B5B] text-white shadow-xs'
                : 'text-[#14213D]/70 hover:bg-[#F4EDE0] hover:text-[#14213D]'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Customer Orders</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#FF6B5B] text-white'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`shrink-0 md:w-full flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#FF6B5B] text-white shadow-xs'
                : 'text-[#14213D]/70 hover:bg-[#F4EDE0] hover:text-[#14213D]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 shrink-0" />
              <span>Products Catalog</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-[#E5D8C5] text-[#14213D]'
              }`}
            >
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`shrink-0 md:w-full flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'returns'
                ? 'bg-[#FF6B5B] text-white shadow-xs'
                : 'text-[#14213D]/70 hover:bg-[#F4EDE0] hover:text-[#14213D]'
            }`}
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Returns & Verification</span>
            </div>
            {pendingReturnsCount > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 bg-amber-500 text-white animate-pulse">
                {pendingReturnsCount}
              </span>
            ) : (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                  activeTab === 'returns' ? 'bg-white/20 text-white' : 'bg-[#E5D8C5] text-[#14213D]'
                }`}
              >
                {returnOrdersList.length}
              </span>
            )}
          </button>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl min-w-0">
          
          {/* SUPABASE CLOUD STATUS BANNER */}
          {supabaseTableStatus === 'table_missing' ? (
            <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 border-2 border-[#FF6B5B]/50 rounded-2xl p-4 sm:p-5 text-left shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B5B] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#FF6B5B] px-2 py-0.5 rounded-full">
                        Action Required for Cross-Device Sync
                      </span>
                      <h2 className="text-sm sm:text-base font-extrabold text-[#14213D]">
                        Supabase Database: Create "orders" Table (1-Click)
                      </h2>
                    </div>
                    <p className="text-xs text-[#14213D]/80 mt-1.5 max-w-2xl leading-relaxed font-medium">
                      Your Supabase credentials are valid, but the <strong>public.orders</strong> table has not been created in your Supabase project yet. Because the table is missing, mobile orders cannot persist to the cloud. Click <strong>Copy SQL</strong> and run it once in Supabase.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-3.5 py-2 rounded-xl bg-[#14213D] hover:bg-[#1D2D50] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#FF6B5B]" />
                    <span>{sqlCopied ? '✓ Copied SQL!' : 'Copy SQL Migration'}</span>
                  </button>
                  <a
                    href="https://supabase.com/dashboard/project/yxvsfaqqkfbfcjuymebo/sql/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#FF6B5B] hover:bg-[#e05a4b] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Open Supabase SQL Editor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCheckDb}
                    disabled={isRefreshingDb}
                    className="px-3 py-2 rounded-xl bg-white border border-[#E5D8C5] hover:border-[#14213D] text-[#14213D] font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingDb ? 'animate-spin' : ''}`} />
                    <span>{isRefreshingDb ? 'Checking...' : 'Recheck'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : supabaseTableStatus === 'connected' ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-emerald-950 font-bold shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Supabase Cloud Database: <strong>Connected & Active</strong></span>
                <span className="hidden sm:inline text-emerald-700 font-medium">— Live Real-Time WebSockets Syncing Mobile & Laptop Orders</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-extrabold uppercase">
                Real-Time Live
              </span>
            </div>
          ) : null}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-black">Performance Snapshot</h2>
                <p className="text-xs text-[#5C554E] mt-0.5">Real-time overview of your e-commerce operations.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-[#E5DCD3] shadow-xs">
                  <div className="flex justify-between items-center text-[#5C554E] text-xs font-semibold mb-2">
                    <span>Total Store Revenue</span>
                    <TrendingUp className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-2xl font-black text-black">{formatRupees(totalRevenue)}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">Live customer orders synced</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5DCD3] shadow-xs">
                  <div className="flex justify-between items-center text-[#5C554E] text-xs font-semibold mb-2">
                    <span>Total Orders Placed</span>
                    <ShoppingBag className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-2xl font-black text-black">{orders.length}</div>
                  <div className="text-[11px] text-[#5C554E] mt-1">
                    {orders.filter((o) => o.status === 'delivered').length} Delivered •{' '}
                    {orders.filter((o) => o.status !== 'delivered').length} In Progress
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5DCD3] shadow-xs">
                  <div className="flex justify-between items-center text-[#5C554E] text-xs font-semibold mb-2">
                    <span>Active Catalog</span>
                    <Package className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-2xl font-black text-black">{products.length} Items</div>
                  <div className="text-[11px] text-[#5C554E] mt-1">Across 4 departments</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5DCD3] shadow-xs">
                  <div className="flex justify-between items-center text-[#5C554E] text-xs font-semibold mb-2">
                    <span>Low Stock Alert</span>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-black">{lowStockProducts.length} Items</div>
                  <div className="text-[11px] text-amber-800 mt-1">Stock below 15 units</div>
                </div>
              </div>

              {/* Department Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5DCD3] shadow-xs">
                <h3 className="text-sm font-bold text-black mb-4">4 Departments Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {DEPARTMENTS.map((d) => {
                    const deptItems = products.filter((p) => p.departmentId === d.id);
                    return (
                      <div key={d.id} className="p-4 rounded-xl bg-[#FAF6F2] border border-[#E5DCD3]">
                        <span className="text-xs font-bold text-black block">{d.title}</span>
                        <span className="text-[11px] text-[#5C554E] mt-0.5 block">{deptItems.length} active products</span>
                        <div className="mt-3 text-xs font-semibold text-emerald-700">Healthy Customer Demand</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-black">Customer Orders ({orders.length})</h2>
                  <p className="text-xs text-[#5C554E] mt-0.5">
                    Live orders placed by customers in the frontend. Update fulfillment status below.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {(['all', 'placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                        orderFilter === st
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-white text-black border border-[#E5DCD3] hover:bg-[#FAF6F2]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Container (Mobile Card View + Desktop Table) */}
              <div className="bg-white rounded-2xl border border-[#E5DCD3] shadow-xs overflow-hidden">
                {/* 1. Mobile Card List (md:hidden) */}
                <div className="md:hidden divide-y divide-[#E5DCD3]">
                  {filteredOrders.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#5C554E]">
                      No orders found for the selected status.
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div key={order.id} className="p-4 space-y-3 hover:bg-[#FAF6F2]/50 transition">
                        {/* Header: Order Number & Date & Payment Status */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-sm text-black block">{order.orderNumber}</span>
                            <span className="text-[10px] text-[#5C554E]">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {order.returnRequest && (
                              <button
                                type="button"
                                onClick={() => setActiveTab('returns')}
                                className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500 hover:bg-amber-600 text-white transition shadow-2xs cursor-pointer"
                              >
                                <Video className="w-2.5 h-2.5" />
                                <span>📹 Return Video ({order.returnRequest.status})</span>
                              </button>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-black text-black block text-sm">{formatRupees(order.total)}</span>
                            <span
                              className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                order.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Address */}
                        <div className="bg-[#FAF6F2] p-2.5 rounded-xl text-xs space-y-0.5">
                          <div className="font-bold text-black flex items-center justify-between">
                            <span>{order.customer.name}</span>
                            <span className="text-[11px] text-[#5C554E] font-normal">{order.customer.phone}</span>
                          </div>
                          <div className="text-[11px] text-[#5C554E]">
                            {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                          </div>
                          {order.customer.email && (
                            <div className="text-[10px] text-[#8C827A] truncate">
                              Account: {order.customer.email}
                            </div>
                          )}
                        </div>

                        {/* Items Ordered */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-[#5C554E] block">
                            Ordered Items ({order.items.length})
                          </span>
                          <div className="space-y-1">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-9 h-9 object-cover rounded-lg border border-[#E5DCD3] shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-black truncate">{item.name}</div>
                                  <div className="text-[10px] text-[#5C554E]">
                                    Qty: {item.quantity} • {formatRupees(item.unitPrice || item.price || 0)}
                                  </div>
                                  {item.customization && item.customization.totalAddonPrice > 0 && (
                                    <div className="mt-1 text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200/70 p-1.5 rounded-md text-left leading-snug">
                                      {item.customization.fallAndPico && (
                                        <div className="font-bold text-emerald-800">✨ Fall & Pico Included (+₹{item.customization.fallAndPicoPrice || 199})</div>
                                      )}
                                      {item.customization.blouseCustomization && (
                                        <div>
                                          <span className="font-bold">✂️ Blouse: </span>
                                          <span>{item.customization.blouseCustomization.stitchingType}</span>
                                          {item.customization.blouseCustomization.bustSize && (
                                            <span className="text-[9px] text-[#5C554E] block">
                                              Size: {item.customization.blouseCustomization.bustSize}" • {item.customization.blouseCustomization.sleeveStyle} • {item.customization.blouseCustomization.neckStyle}
                                            </span>
                                          )}
                                          {item.customization.blouseCustomization.notes && (
                                            <span className="text-[9px] italic text-[#5C554E] block">
                                              Notes: "{item.customization.blouseCustomization.notes}"
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      {item.customization.tassels && (
                                        <div>🧵 Pallu Tassels (+₹{item.customization.tasselsPrice || 249})</div>
                                      )}
                                      {item.customization.petticoat && (
                                        <div>👗 {item.customization.petticoatType || 'Matching Saree Inskirt'} (+₹{item.customization.petticoatPrice || 299})</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status Selector & 1-Click Advance */}
                        <div className="pt-2 border-t border-[#E5DCD3] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-[11px] font-bold text-[#5C554E]">Order Status:</label>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value as OrderStatus)
                              }
                              className={`flex-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : order.status === 'packed'
                                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                                  : order.status === 'confirmed'
                                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                                  : 'bg-amber-100 text-amber-900 border-amber-300'
                              }`}
                            >
                              <option value="placed">1. Placed (Ordered)</option>
                              <option value="confirmed">2. Confirmed</option>
                              <option value="packed">3. Packed</option>
                              <option value="shipped">4. Shipped</option>
                              <option value="delivered">5. Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>

                          {/* Quick 1-Click Advance Buttons */}
                          {order.status === 'placed' && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Click to Confirm Order</span>
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'packed')}
                              className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                            >
                              <Box className="w-3.5 h-3.5" />
                              <span>Click to Pack Saree/Item</span>
                            </button>
                          )}
                          {order.status === 'packed' && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'shipped')}
                              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Click to Handover & Ship</span>
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark as Delivered</span>
                            </button>
                          )}
                          {order.status === 'delivered' && (
                            <div className="py-1.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg">
                              ✓ Successfully Delivered
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="w-full py-2 px-3 bg-black hover:bg-[#2A2A2A] text-white rounded-lg font-bold text-xs transition"
                          >
                            View Order Details Modal
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* 2. Desktop Table (hidden md:block) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF6F2] text-[#5C554E] font-bold border-b border-[#E5DCD3]">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Items Ordered</th>
                        <th className="py-3 px-4">Amount & Payment</th>
                        <th className="py-3 px-4">Current Status (Change)</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DCD3]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-xs text-[#5C554E]">
                            No orders found for the selected status.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#FAF6F2] transition">
                            <td className="py-3.5 px-4 font-mono">
                              <span className="font-bold text-black block">{order.orderNumber}</span>
                              <span className="text-[10px] text-[#5C554E]">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {order.returnRequest && (
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('returns')}
                                  className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500 hover:bg-amber-600 text-white transition shadow-2xs cursor-pointer"
                                >
                                  <Video className="w-2.5 h-2.5" />
                                  <span>📹 Return Video ({order.returnRequest.status})</span>
                                </button>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-bold text-black">{order.customer.name}</div>
                              <div className="text-[11px] text-[#5C554E]">{order.customer.phone}</div>
                              <div className="text-[10px] text-[#5C554E] truncate max-w-xs">{order.customer.city}, {order.customer.state}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-bold text-black block">{order.items.length} product(s)</span>
                              <div className="text-[10px] text-[#5C554E] truncate max-w-[200px]">
                                {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-black text-black block">{formatRupees(order.total)}</span>
                              <span className="text-[10px] text-[#5C554E] block">{order.paymentMethod}</span>
                              <span
                                className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                  order.paymentStatus === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 min-w-[180px]">
                              {/* Direct Status Selector */}
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateOrderStatus(order.id, e.target.value as OrderStatus)
                                }
                                className={`w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                                    : order.status === 'packed'
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : order.status === 'confirmed'
                                    ? 'bg-sky-100 text-sky-900 border-sky-300'
                                    : 'bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                              >
                                <option value="placed">1. Placed (Ordered)</option>
                                <option value="confirmed">2. Confirmed</option>
                                <option value="packed">3. Packed</option>
                                <option value="shipped">4. Shipped</option>
                                <option value="delivered">5. Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>

                              {/* Quick 1-Click Next Stage Button */}
                              {order.status === 'placed' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                  className="mt-1.5 w-full py-1 px-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition shadow-2xs"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Click to Confirm</span>
                                </button>
                              )}
                              {order.status === 'confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, 'packed')}
                                  className="mt-1.5 w-full py-1 px-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition shadow-2xs"
                                >
                                  <Box className="w-3 h-3" />
                                  <span>Click to Pack</span>
                                </button>
                              )}
                              {order.status === 'packed' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                                  className="mt-1.5 w-full py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition shadow-2xs"
                                >
                                  <Truck className="w-3 h-3" />
                                  <span>Click to Ship</span>
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                  className="mt-1.5 w-full py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition shadow-2xs"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Mark Delivered</span>
                                </button>
                              )}
                              {order.status === 'delivered' && (
                                <span className="block mt-1 text-[10px] font-bold text-emerald-700 text-center">
                                  ✓ Order Complete
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 bg-black hover:bg-[#2A2A2A] text-white rounded-lg font-bold text-xs transition"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-[#E5DCD3] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#E5DCD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-black">Product Management ({products.length})</h3>
                  <p className="text-xs text-[#5C554E]">
                    Live catalog available on the storefront. Click "Add Product" to add new items.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#E44A2D] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#cc3d22] transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6F2] text-[#5C554E] font-bold border-b border-[#E5DCD3]">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Department & Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DCD3]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF6F2]">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-black line-clamp-1">{p.name}</span>
                            <span className="text-[10px] text-[#5C554E]">{p.brand || "Kavi's Boutique"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-black block">{p.category}</span>
                          <span className="text-[10px] text-[#5C554E]">{p.departmentId}</span>
                        </td>
                        <td className="py-3 px-4 font-black text-black">
                          {formatRupees(p.discountPrice || p.price)}
                          {p.discountPrice && (
                            <span className="text-[10px] line-through text-[#5C554E] ml-1.5 block">
                              {formatRupees(p.price)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              p.stock < 15
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FAF6F2] hover:bg-[#E44A2D] text-black hover:text-white rounded-lg border border-[#E5DCD3] hover:border-[#E44A2D] font-bold text-xs transition shadow-2xs cursor-pointer"
                              title={`Edit ${p.name}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-bold text-xs transition cursor-pointer"
                              title={`Delete ${p.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RETURNS & PRODUCT VERIFICATION VIDEOS */}
          {activeTab === 'returns' && (
            <div className="space-y-6 text-left">
              {/* Header Box */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5DCD3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6B5B] text-white flex items-center justify-center shadow-xs">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-black">
                        Returns & Defect Video Verification ({returnOrdersList.length})
                      </h3>
                      <p className="text-xs text-[#5C554E]">
                        Mandatory unboxing and defect verification video inspection before issuing refunds.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setReturnFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      returnFilter === 'all'
                        ? 'bg-[#14213D] text-white shadow-xs'
                        : 'bg-[#FAF6F2] hover:bg-[#F0E6D8] text-black border border-[#E5DCD3]'
                    }`}
                  >
                    All ({returnOrdersList.length})
                  </button>
                  <button
                    onClick={() => setReturnFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      returnFilter === 'pending'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    <span>Pending Inspection</span>
                    {pendingReturnsCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-white text-amber-700 rounded-full text-[10px] font-black">
                        {pendingReturnsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setReturnFilter('approved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      returnFilter === 'approved'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    Approved & Refunded ({approvedReturnsCount})
                  </button>
                  <button
                    onClick={() => setReturnFilter('rejected')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      returnFilter === 'rejected'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                    }`}
                  >
                    Declined ({rejectedReturnsCount})
                  </button>
                </div>
              </div>

              {/* Protocol Notice Banner */}
              <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Video className="w-4 h-4" />
                </div>
                <div className="text-xs text-amber-950">
                  <span className="font-extrabold block">Store Video Inspection Protocol</span>
                  <span className="text-[11px] text-amber-900 block mt-0.5 leading-relaxed">
                    Every customer return requires a video inspection. Watch the uploaded video to confirm the defect, verify that the genuine Kavi's Lifestyle garment was returned with tags, and ensure no fraudulent claim before approving the refund.
                  </span>
                </div>
              </div>

              {/* Return Requests List */}
              {filteredReturnOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#E5DCD3] space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <RotateCcw className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-extrabold text-black">No Return Requests Found</h4>
                  <p className="text-xs text-[#5C554E] max-w-sm mx-auto">
                    {returnFilter === 'pending'
                      ? 'No return requests currently awaiting video verification.'
                      : 'When customers request returns and attach defect videos, they will appear right here for your inspection.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredReturnOrders.map((order) => {
                    const ret = order.returnRequest!;
                    const refundAmt = refundAmountMap[order.id] !== undefined ? refundAmountMap[order.id] : String(ret.refundAmount || order.total);
                    const remarks = returnRemarksMap[order.id] !== undefined ? returnRemarksMap[order.id] : (ret.adminRemarks || 'Defect verified upon video inspection. Refund approved.');
                    const successNote = actionSuccessMsg[order.id];

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-[#E5DCD3] shadow-xs overflow-hidden"
                      >
                        {/* Top Ribbon */}
                        <div className="p-4 sm:p-5 bg-[#FAF6EE] border-b border-[#E5DCD3] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-extrabold text-[#14213D] font-mono">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                ret.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : ret.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                                  : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                              }`}
                            >
                              {ret.status === 'approved' && '✓ Approved & Refunded'}
                              {ret.status === 'rejected' && '✕ Return Declined'}
                              {ret.status === 'pending' && '⏳ Pending Video Verification'}
                            </span>
                          </div>

                          <div className="text-xs text-[#5C554E]">
                            Requested on {new Date(ret.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                          
                          {/* Left Column (6 cols): Customer Details & Item Info */}
                          <div className="lg:col-span-6 space-y-4">
                            {/* Customer Profile */}
                            <div className="p-3.5 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3] space-y-1 text-xs">
                              <span className="text-[10px] uppercase font-black text-slate-500 block tracking-wider">
                                Customer Details
                              </span>
                              <div className="font-extrabold text-black text-sm">{ret.customerName}</div>
                              <div className="text-slate-600 font-medium">{ret.customerEmail} • {ret.customerPhone || order.customer?.phone}</div>
                              <div className="text-slate-500 text-[11px] truncate">
                                {order.customer?.address}, {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                              </div>
                            </div>

                            {/* Return Reason Box */}
                            <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1.5 text-xs">
                              <span className="text-[10px] uppercase font-black text-rose-800 block tracking-wider">
                                Customer Stated Defect Reason
                              </span>
                              <div className="font-extrabold text-rose-950 text-sm">
                                {ret.reason}
                              </div>
                              <div className="text-rose-900 bg-white/80 p-2.5 rounded-lg border border-rose-200/60">
                                <strong>Customer Explanation:</strong> "{ret.description}"
                              </div>
                            </div>

                            {/* Items in Return */}
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase font-black text-slate-500 block tracking-wider">
                                Item(s) Requested for Return
                              </span>
                              <div className="space-y-2">
                                {order.items
                                  .filter((it) => !ret.itemIds || ret.itemIds.length === 0 || ret.itemIds.includes(it.id))
                                  .map((it, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 bg-white"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <img
                                          src={it.image}
                                          alt=""
                                          className="w-12 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                                        />
                                        <div className="min-w-0">
                                          <div className="font-bold text-xs text-black truncate">{it.name}</div>
                                          <div className="text-[11px] text-slate-500">
                                            Qty: {it.quantity} {it.variant ? `• ${it.variant}` : ''}
                                          </div>
                                          {it.customization && (
                                            <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                              Customized Handloom
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <span className="text-xs font-black text-black shrink-0">
                                        {formatRupees((it.unitPrice || it.price || 0) * it.quantity)}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-bold">
                                <span>Total Order Value:</span>
                                <span className="font-extrabold text-base text-[#14213D]">{formatRupees(order.total)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column (6 cols): Verification Video & Admin Decision */}
                          <div className="lg:col-span-6 space-y-4">
                            
                            {/* Verification Video Player */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-[#14213D] flex items-center gap-1.5">
                                  <Video className="w-4 h-4 text-[#FF6B5B]" />
                                  <span>Customer Defect Verification Video</span>
                                </span>
                                {ret.videoName && (
                                  <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                                    {ret.videoName}
                                  </span>
                                )}
                              </div>

                              <AdminReturnVideoPlayer videoUrl={ret.videoUrl} />
                              <p className="text-[11px] text-[#5C554E] italic">
                                💡 Tip: Watch the video to inspect the weave, defect area, and tags.
                              </p>
                            </div>

                            {/* Decision & Action Area */}
                            {successNote && (
                              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span>{successNote}</span>
                              </div>
                            )}

                            {ret.status === 'pending' ? (
                              <div className="space-y-3 p-4 bg-[#FAF6EE] rounded-2xl border border-[#E5D8C5]">
                                <span className="text-xs font-black uppercase text-[#14213D] block tracking-wider">
                                  Admin Verification & Refund Actions
                                </span>

                                {/* Refund Amount Input */}
                                <div>
                                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                    Refund Amount (₹):
                                  </label>
                                  <input
                                    type="number"
                                    value={refundAmt}
                                    onChange={(e) =>
                                      setRefundAmountMap({ ...refundAmountMap, [order.id]: e.target.value })
                                    }
                                    className="w-full px-3 py-2 text-xs font-extrabold border border-[#E5DCD3] rounded-xl outline-none focus:border-emerald-600 bg-white"
                                  />
                                </div>

                                {/* Admin Remarks */}
                                <div>
                                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                    Admin Remarks (Sent to Customer):
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={remarks}
                                    onChange={(e) =>
                                      setReturnRemarksMap({ ...returnRemarksMap, [order.id]: e.target.value })
                                    }
                                    placeholder="Explanation of decision..."
                                    className="w-full px-3 py-2 text-xs border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const amt = parseFloat(refundAmt) || order.total;
                                      approveReturnRequest(order.id, amt, remarks);
                                      setActionSuccessMsg({
                                        ...actionSuccessMsg,
                                        [order.id]: `Return approved! ₹${amt} refund credited.`
                                      });
                                    }}
                                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Approve & Refund</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!remarks || remarks.includes('Refund approved')) {
                                        alert('Please enter a specific reason for declining the return in the Admin Remarks box.');
                                        return;
                                      }
                                      rejectReturnRequest(order.id, remarks);
                                      setActionSuccessMsg({
                                        ...actionSuccessMsg,
                                        [order.id]: 'Return request declined.'
                                      });
                                    }}
                                    className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                    <span>Decline Return</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                                  ret.status === 'approved'
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                    : 'bg-rose-50 border-rose-300 text-rose-950'
                                }`}
                              >
                                <span className="font-black uppercase tracking-wider block text-[11px]">
                                  {ret.status === 'approved' ? '✓ Return Approved & Refund Initiated' : '✕ Return Request Declined'}
                                </span>
                                {ret.status === 'approved' && (
                                  <div className="font-extrabold text-sm">
                                    Refund Amount: {formatRupees(ret.refundAmount || order.total)}
                                  </div>
                                )}
                                <div>
                                  <strong>Admin Remarks:</strong> {ret.adminRemarks}
                                </div>
                                {ret.reviewedAt && (
                                  <div className="text-[10px] opacity-75">
                                    Reviewed on: {new Date(ret.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                )}
                              </div>
                            )}

                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E5DCD3] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-[#F5EFEB] text-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-black mb-1">Add New Product</h3>
            <p className="text-xs text-[#5C554E] mb-5">
              Enter product specifications to publish immediately to the live catalog.
            </p>

            {productSavedSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-base text-black">Product Published Successfully!</h4>
                <p className="text-xs text-[#5C554E]">The new product is now active in the store catalog.</p>
              </div>
            ) : (
              <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-black block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Royal Mysore Crepe Silk Saree"
                    className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-black block mb-1">Department *</label>
                    <select
                      value={newProduct.departmentId}
                      onChange={(e) => setNewProduct({ ...newProduct, departmentId: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                    >
                      <option value="womens-fashion">Women's Fashion</option>
                      <option value="dry-fruits-nuts">Dry Fruits & Nuts</option>
                      <option value="perfumes-fragrances">Perfumes & Fragrances</option>
                      <option value="cosmetics-beauty">Cosmetics & Beauty</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-black block mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      placeholder="e.g. Silk Sarees, Pure Attars, Almonds"
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-black block mb-1">Regular Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="e.g. 3999"
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-black block mb-1">Offer Price (₹)</label>
                    <input
                      type="number"
                      value={newProduct.discountPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                      placeholder="e.g. 2999 (optional)"
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-black block mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="e.g. 25"
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-black">Product Image *</label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E44A2D] hover:bg-[#cc3d22] text-white rounded-lg text-[11px] font-bold transition shadow-2xs active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Browse Internal Storage</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={newProduct.images[0]}
                      onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                      placeholder="Paste image URL (https://...) or click Browse Internal Storage"
                      className="flex-1 px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white text-xs"
                    />
                    {newProduct.images[0] && (
                      <button
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, images: [''] })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Clear image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Live Thumbnail Preview */}
                  {newProduct.images[0] && (
                    <div className="mt-2.5 flex items-center gap-3 p-2.5 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3] animate-in fade-in">
                      <img
                        src={newProduct.images[0]}
                        alt="Product Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-[#E5DCD3] bg-white shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-black block truncate">
                          {newProduct.images[0].startsWith('data:image') ? 'Uploaded from Internal Storage' : 'Linked via Image URL'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          ✓ Image ready to publish
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2 flex-wrap items-center">
                    <span className="text-[10px] text-[#5C554E] self-center">Or sample presets:</span>
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setNewProduct({ ...newProduct, images: [preset.url] })}
                        className="px-2 py-0.5 rounded bg-[#FAF6F2] hover:bg-[#E5DCD3] text-[10px] font-semibold text-black transition"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={newProduct.shortDescription}
                    onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                    placeholder="Brief highlight of materials, origin, and craftsmanship..."
                    className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#E5DCD3] font-bold text-black hover:bg-[#FAF6F2] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#E44A2D] text-white font-bold hover:bg-[#cc3d22] transition shadow-xs"
                  >
                    Save & Publish
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E5DCD3] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingProductId(null);
              }}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-[#F5EFEB] text-black transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-black mb-1">Edit Product</h3>
            <p className="text-xs text-[#5C554E] mb-5">
              Update pricing, category, stock inventory, or media for this product.
            </p>

            {productEditSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-base text-black">Product Updated Successfully!</h4>
                <p className="text-xs text-[#5C554E]">The changes have been saved to the live catalog.</p>
              </div>
            ) : (
              <form onSubmit={handleEditProductSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-black block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editProductForm.name}
                    onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-black block mb-1">Department *</label>
                    <select
                      value={editProductForm.departmentId}
                      onChange={(e) => setEditProductForm({ ...editProductForm, departmentId: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                    >
                      <option value="womens-fashion">Women's Fashion</option>
                      <option value="dry-fruits-nuts">Dry Fruits & Nuts</option>
                      <option value="perfumes-fragrances">Perfumes & Fragrances</option>
                      <option value="cosmetics-beauty">Cosmetics & Beauty</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-black block mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={editProductForm.category}
                      onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-black block mb-1">MRP Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editProductForm.price}
                      onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-black block mb-1">Selling / Offer (₹)</label>
                    <input
                      type="number"
                      min="1"
                      value={editProductForm.discountPrice}
                      onChange={(e) => setEditProductForm({ ...editProductForm, discountPrice: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-black block mb-1">Stock Units *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editProductForm.stock}
                      onChange={(e) => setEditProductForm({ ...editProductForm, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Brand / Weave House</label>
                  <input
                    type="text"
                    value={editProductForm.brand}
                    onChange={(e) => setEditProductForm({ ...editProductForm, brand: e.target.value })}
                    placeholder="e.g. Kavi's Handloom Weaves"
                    className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-black">Product Image *</label>
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E44A2D] hover:bg-[#cc3d22] text-white rounded-lg text-[11px] font-bold transition shadow-2xs active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Browse Internal Storage</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/*"
                    onChange={handleEditImageFileChange}
                    className="hidden"
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={editProductForm.images[0] || ''}
                      onChange={(e) => setEditProductForm({ ...editProductForm, images: [e.target.value] })}
                      placeholder="Paste image URL (https://...) or click Browse Internal Storage"
                      className="flex-1 px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white text-xs"
                    />
                    {editProductForm.images[0] && (
                      <button
                        type="button"
                        onClick={() => setEditProductForm({ ...editProductForm, images: [''] })}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Clear image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Live Thumbnail Preview */}
                  {editProductForm.images[0] && (
                    <div className="mt-2.5 flex items-center gap-3 p-2.5 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3] animate-in fade-in">
                      <img
                        src={editProductForm.images[0]}
                        alt="Product Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-[#E5DCD3] bg-white shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-black block truncate">
                          {editProductForm.images[0].startsWith('data:image') ? 'Uploaded from Internal Storage' : 'Linked via Image URL'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          ✓ Image active
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2 flex-wrap items-center">
                    <span className="text-[10px] text-[#5C554E] self-center">Or sample presets:</span>
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setEditProductForm({ ...editProductForm, images: [preset.url] })}
                        className="px-2 py-0.5 rounded bg-[#FAF6F2] hover:bg-[#E5DCD3] text-[10px] font-semibold text-black transition"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Short Description</label>
                  <input
                    type="text"
                    value={editProductForm.shortDescription}
                    onChange={(e) => setEditProductForm({ ...editProductForm, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Full Description</label>
                  <textarea
                    rows={2}
                    value={editProductForm.description}
                    onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5DCD3] rounded-xl outline-none focus:border-black bg-white"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingProductId(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-[#E5DCD3] font-bold text-black hover:bg-[#FAF6F2] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#E44A2D] text-white font-bold hover:bg-[#cc3d22] transition shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E5DCD3] shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-[#F5EFEB] text-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#E5DCD3] pb-4">
              <span className="text-[10px] font-mono text-[#5C554E] uppercase">Order Details</span>
              <h3 className="text-lg font-black text-black">{selectedOrder.orderNumber}</h3>
              <p className="text-xs text-[#5C554E]">
                Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Customer Details */}
            <div className="bg-[#FAF6F2] p-4 rounded-xl space-y-1.5 text-xs">
              <span className="font-bold text-black block mb-1">Customer & Delivery Info</span>
              <p><strong className="text-black">Name:</strong> {selectedOrder.customer.name}</p>
              <p><strong className="text-black">Email:</strong> {selectedOrder.customer.email}</p>
              <p><strong className="text-black">Phone:</strong> {selectedOrder.customer.phone}</p>
              <p><strong className="text-black">Address:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</p>
            </div>

            {/* Status Workflow Controls */}
            <div className="bg-white p-4 rounded-xl text-xs space-y-2 border border-[#E5DCD3] shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black">Order Fulfillment Progression:</span>
                <span className={`px-2 py-0.5 rounded font-black uppercase text-[10px] ${
                  selectedOrder.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-900'
                    : selectedOrder.status === 'shipped'
                    ? 'bg-blue-100 text-blue-900'
                    : selectedOrder.status === 'packed'
                    ? 'bg-purple-100 text-purple-900'
                    : selectedOrder.status === 'confirmed'
                    ? 'bg-sky-100 text-sky-900'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  Current: {selectedOrder.status}
                </span>
              </div>
              <p className="text-[11px] text-[#5C554E]">
                Click any step below to instantly update the customer's account view and tracking alerts:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
                {(['placed', 'confirmed', 'packed', 'shipped', 'delivered'] as const).map((st) => {
                  const isCurrent = selectedOrder.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, st);
                        setSelectedOrder({ ...selectedOrder, status: st });
                      }}
                      className={`py-2 px-1.5 rounded-lg text-xs font-bold capitalize transition border text-center ${
                        isCurrent
                          ? 'bg-black text-white border-black shadow-xs ring-2 ring-black/20'
                          : 'bg-[#FAF6F2] text-black border-[#E5DCD3] hover:border-black hover:bg-white'
                      }`}
                    >
                      {st === 'placed' ? '1. Ordered' : st === 'confirmed' ? '2. Confirm' : st === 'packed' ? '3. Pack' : st === 'shipped' ? '4. Ship' : '5. Deliver'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-black block">Items in this Order:</span>
              <div className="divide-y divide-[#E5DCD3] border border-[#E5DCD3] rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-12 object-cover rounded bg-slate-100" />
                      <div>
                        <span className="font-bold text-black block">{item.name}</span>
                        <span className="text-[10px] text-[#5C554E]">Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}</span>
                        {item.customization && item.customization.totalAddonPrice > 0 && (
                          <div className="mt-1 text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200/70 p-1.5 rounded-md text-left leading-snug">
                            {item.customization.fallAndPico && (
                              <div className="font-bold text-emerald-800">✨ Fall & Pico Included (+₹{item.customization.fallAndPicoPrice || 199})</div>
                            )}
                            {item.customization.blouseCustomization && (
                              <div>
                                <span className="font-bold">✂️ Blouse Stitching: </span>
                                <span>{item.customization.blouseCustomization.stitchingType}</span>
                                {item.customization.blouseCustomization.bustSize && (
                                  <span className="text-[9px] text-[#5C554E] block">
                                    Size: {item.customization.blouseCustomization.bustSize}" • {item.customization.blouseCustomization.sleeveStyle} • {item.customization.blouseCustomization.neckStyle}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-black text-black">{formatRupees(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Math */}
            <div className="bg-[#FAF6F2] p-4 rounded-xl text-xs space-y-1">
              <div className="flex justify-between text-[#5C554E]">
                <span>Subtotal:</span>
                <span>{formatRupees(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-{formatRupees(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-black text-sm pt-2 border-t border-[#E5DCD3]">
                <span>Total Amount:</span>
                <span>{formatRupees(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-black text-white font-bold text-xs rounded-xl hover:bg-[#2A2A2A] transition"
              >
                Close Order Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
