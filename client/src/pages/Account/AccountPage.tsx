import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Box,
  Check,
  ShoppingBag,
  ArrowRight,
  Bell,
  BellRing,
  Lock,
  Edit3,
  Star,
  HelpCircle
} from 'lucide-react';
import { CustomerSupportAndFAQ } from '../../components/CustomerSupportAndFAQ';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { validatePhone, sanitizePhoneInput } from '../../utils/validation';

interface DemoOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: {
    name: string;
    image: string;
    variant?: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  total: number;
  status: 'confirmed' | 'packed' | 'shipped' | 'delivered';
  trackingNumber: string;
  carrier: string;
}

const DEMO_ORDERS: DemoOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'KV-2026-98124',
    date: 'February 28, 2026',
    items: [
      {
        name: 'Kanchipuram Pure Zari Bridal Silk Saree',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
        variant: 'Bridal Crimson Red',
        quantity: 1,
        price: 9999
      },
      {
        name: 'King California Jumbo Almonds (Badam Giri)',
        image: 'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&w=400&q=80',
        variant: '500g Value Pack',
        quantity: 2,
        price: 539
      }
    ],
    subtotal: 11077,
    total: 11077,
    status: 'shipped',
    trackingNumber: 'DLV984210982',
    carrier: 'Delivery Express'
  },
  {
    id: 'ord-102',
    orderNumber: 'KV-2026-87410',
    date: 'January 14, 2026',
    items: [
      {
        name: 'Imperial Oud & Smoked Amber Eau De Parfum',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
        variant: '500g Signature Bottle',
        quantity: 1,
        price: 1999
      }
    ],
    subtotal: 1999,
    total: 1999,
    status: 'delivered',
    trackingNumber: 'BLU765109283',
    carrier: 'BlueDart Air'
  }
];

export default function AccountPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, addresses, logout, updateProfile, addAddress, removeAddress, setDefaultAddress } = useAuth();
  const { wishlistCount } = useWishlist();
  const { formatPrice } = useCurrency();
  const { getUserOrders } = useOrders();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const userOrders = getUserOrders(user?.email);

  // Redirect to login if user is not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth/login', { state: { from: '/account' } });
    }
  }, [user, navigate]);

  const activeTabParam = searchParams.get('tab') as 'orders' | 'profile' | 'addresses' | 'notifications' | 'help' | null;
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'notifications' | 'help'>(
    activeTabParam || (userOrders.length > 0 ? 'orders' : 'profile')
  );

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    newPassword: ''
  });
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    orderStatusAlerts: true,
    dispatchTracking: true,
    whatsappAlerts: true,
    exclusiveOffers: true
  });

  // User-scoped read notification IDs
  const userKey = user?.email ? user.email.toLowerCase().trim() : 'guest';
  const readNotifKey = `kavis_read_notifications_${userKey}`;

  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(readNotifKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Re-sync read notifications when user switches
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(readNotifKey);
      setReadNotificationIds(saved ? JSON.parse(saved) : []);
    } catch {
      setReadNotificationIds([]);
    }
  }, [readNotifKey]);

  // Generate real-time notifications based on user's actual orders and admin fulfillment status
  const notifications = React.useMemo(() => {
    if (!userOrders || userOrders.length === 0) return [];
    const list: Array<{
      id: string;
      title: string;
      message: string;
      time: string;
      type: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered';
      orderNumber: string;
      isUnread: boolean;
    }> = [];

    userOrders.forEach((order) => {
      // 5. Delivered milestone
      if (order.status === 'delivered') {
        list.push({
          id: `${order.id}-delivered`,
          title: 'Order Delivered Successfully 🎉',
          message: `Your package for Order #${order.orderNumber} was successfully delivered. Enjoy your purchase!`,
          time: 'Today',
          type: 'delivered',
          orderNumber: order.orderNumber,
          isUnread: false
        });
      }

      // 4. Shipped milestone
      if (order.status === 'shipped' || order.status === 'delivered') {
        list.push({
          id: `${order.id}-shipped`,
          title: 'Item Dispatched & In Transit 🚚',
          message: `Order #${order.orderNumber} has been dispatched via ${order.carrier || 'BlueDart Express'}. Tracking ID: ${order.trackingNumber || 'BD-982341209IN'}.`,
          time: order.status === 'shipped' ? 'Today' : '1 day ago',
          type: 'shipped',
          orderNumber: order.orderNumber,
          isUnread: order.status === 'shipped'
        });
      }

      // 3. Packed milestone
      if (order.status === 'packed' || order.status === 'shipped' || order.status === 'delivered') {
        list.push({
          id: `${order.id}-packed`,
          title: 'Items Hand-Inspected & Packed 📦',
          message: `Order #${order.orderNumber} has passed quality inspection and is packed in boutique packaging.`,
          time: order.status === 'packed' ? 'Today' : '2 days ago',
          type: 'packed',
          orderNumber: order.orderNumber,
          isUnread: order.status === 'packed'
        });
      }

      // 2. Confirmed by Admin milestone
      if (order.status === 'confirmed' || order.status === 'packed' || order.status === 'shipped' || order.status === 'delivered') {
        list.push({
          id: `${order.id}-confirmed`,
          title: 'Order Confirmed by Store Admin ✅',
          message: `Order #${order.orderNumber} has been verified and confirmed by our store manager. Preparing for packing.`,
          time: order.status === 'confirmed' ? 'Today' : 'Recent',
          type: 'confirmed',
          orderNumber: order.orderNumber,
          isUnread: order.status === 'confirmed'
        });
      }

      // 1. Order Placed milestone (shown immediately upon placing order)
      list.push({
        id: `${order.id}-placed`,
        title: 'Order Received & Placed ⏳',
        message: `Order #${order.orderNumber} with ${order.items?.length || 1} item(s) has been placed. Waiting for store confirmation.`,
        time: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
        type: 'placed',
        orderNumber: order.orderNumber,
        isUnread: order.status === 'placed'
      });
    });

    return list;
  }, [userOrders]);

  // Calculate dynamic unread notification count
  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !readNotificationIds.includes(n.id)).length;
  }, [notifications, readNotificationIds]);

  // Mark all notifications as read
  const markAllAsRead = React.useCallback(() => {
    const allIds = notifications.map((n) => n.id);
    setReadNotificationIds((prev) => {
      const merged = Array.from(new Set([...prev, ...allIds]));
      try {
        localStorage.setItem(readNotifKey, JSON.stringify(merged));
      } catch (e) {
        console.error(e);
      }
      return merged;
    });
  }, [notifications, readNotifKey]);

  // When user is viewing the notifications tab, automatically mark them as read after a brief pause
  React.useEffect(() => {
    if (activeTab === 'notifications' && notifications.length > 0) {
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [activeTab, notifications, markAllAsRead]);

  React.useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        newPassword: ''
      });
    }
  }, [user]);

  // New Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  const handleTabChange = (tab: 'orders' | 'profile' | 'addresses' | 'notifications' | 'help') => {
    setActiveTab(tab);
    setSearchParams({ tab });
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById('account-tab-content-mobile');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileForm.phone) {
      const phoneCheck = validatePhone(profileForm.phone, true);
      if (!phoneCheck.isValid) {
        alert(phoneCheck.message || 'Phone number must be strictly 10 digits.');
        return;
      }
    }
    updateProfile({
      fullName: profileForm.fullName,
      phone: profileForm.phone,
      ...(profileForm.newPassword ? { newPassword: profileForm.newPassword } : {})
    });
    setProfileSavedMsg(true);
    setProfileForm(prev => ({ ...prev, newPassword: '' }));
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.postalCode) {
      alert('Please fill all required address fields.');
      return;
    }
    const phoneCheck = validatePhone(newAddress.phone, true);
    if (!phoneCheck.isValid) {
      alert(phoneCheck.message || 'Phone number must be strictly 10 digits.');
      return;
    }
    addAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const calculateDeliveryTurnaround = (city?: string, pincode?: string) => {
    const cleanCity = (city || '').toLowerCase();
    const cleanPin = (pincode || '').slice(0, 2);

    if (
      cleanCity.includes('chennai') ||
      cleanPin === '60' ||
      cleanPin === '61' ||
      cleanPin === '62' ||
      cleanPin === '63' ||
      cleanPin === '64'
    ) {
      return {
        daysRange: '1–2 Business Days',
        daysCount: 2,
        tier: 'Local Express Delivery',
        courier: 'BlueDart Local Express'
      };
    }

    if (
      cleanCity.includes('bengaluru') ||
      cleanCity.includes('bangalore') ||
      cleanCity.includes('mumbai') ||
      cleanCity.includes('delhi') ||
      cleanCity.includes('hyderabad') ||
      cleanCity.includes('kolkata') ||
      cleanCity.includes('pune') ||
      cleanPin === '56' ||
      cleanPin === '40' ||
      cleanPin === '11' ||
      cleanPin === '50' ||
      cleanPin === '70' ||
      cleanPin === '41'
    ) {
      return {
        daysRange: '2–3 Business Days',
        daysCount: 3,
        tier: 'Metro Priority Air',
        courier: 'BlueDart Air Express'
      };
    }

    return {
      daysRange: '3–4 Business Days',
      daysCount: 4,
      tier: 'Pan-India Express',
      courier: 'Delhivery Express'
    };
  };

  const getExpectedDeliveryDateString = (daysToAdd: number, baseDate?: string | Date) => {
    const d = baseDate ? new Date(baseDate) : new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStatusTracker = (status: string, daysRange: string = '3–4 Business Days') => {
    const steps = [
      { key: 'placed', label: 'Order Placed', time: 'Day 1 (Instant)', icon: Clock },
      { key: 'confirmed', label: 'Confirmed', time: 'Day 1 (Verified)', icon: CheckCircle2 },
      { key: 'packed', label: 'Packed', time: 'Day 1–2 (Inspected)', icon: Box },
      { key: 'shipped', label: 'In Transit', time: 'Day 2–3 (Dispatched)', icon: Truck },
      { key: 'delivered', label: 'Delivered', time: `${daysRange} (Doorstep)`, icon: Check }
    ];

    const currentStepIndex =
      status === 'placed'
        ? 0
        : status === 'confirmed'
        ? 1
        : status === 'packed'
        ? 2
        : status === 'shipped'
        ? 3
        : 4;

    return (
      <div className="py-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E5DCD3] -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const IconComponent = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center relative z-10 px-0.5 max-w-[68px] sm:max-w-none">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isCompleted
                      ? 'bg-black text-white shadow-sm ring-4 ring-white'
                      : 'bg-white text-[#5C554E] border-2 border-[#E5DCD3]'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold mt-1.5 leading-tight ${
                    isCurrent ? 'text-black font-extrabold' : isCompleted ? 'text-black' : 'text-[#786F66]'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[9px] text-[#5C554E] font-medium leading-tight mt-0.5">
                  {step.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF6F2]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E5DCD3] shadow-xl text-center animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <User className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">Sign in to your account</h1>
            <p className="text-xs text-[#5C554E] mt-2 mb-6 font-medium leading-relaxed">
              Please sign in with your email and password to view your orders, saved addresses, and profile settings.
            </p>
            <Link
              to="/auth/login"
              state={{ from: '/account' }}
              className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-sm active:scale-98"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-5 pt-5 border-t border-[#E5DCD3]/70 text-xs text-[#5C554E]">
              New to Kavi's Lifestyle?{' '}
              <Link to="/auth/register" className="font-bold text-black underline">
                Create an Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderTabContent = () => (
    <>
            {/* TAB 1: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#114B5F] mb-1">Order History & Live Status</h2>
                    <p className="text-xs text-slate-500">Track shipments, estimated delivery turnaround days, and courier details.</p>
                  </div>
                  <span className="text-xs font-bold bg-[#FAF6F2] border border-[#E5DCD3] px-3 py-1.5 rounded-xl text-black">
                    {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'} Placed
                  </span>
                </div>

                {userOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-black">No orders placed yet</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        Your ordered items and live delivery turnaround tracking will appear right here once you checkout.
                      </p>
                    </div>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition"
                    >
                      <span>Explore Shop</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  userOrders.map((order) => {
                    const deliveryTurnaround = calculateDeliveryTurnaround(
                      order.customer?.city,
                      order.customer?.pincode
                    );
                    const expectedDeliveryDate = getExpectedDeliveryDateString(
                      deliveryTurnaround.daysCount,
                      order.createdAt
                    );

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#114B5F]">
                                {order.orderNumber}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                                    : order.status === 'packed'
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : order.status === 'confirmed'
                                    ? 'bg-sky-100 text-sky-900 border-sky-300'
                                    : order.status === 'cancelled'
                                    ? 'bg-red-100 text-red-900 border-red-300'
                                    : 'bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                              >
                                {order.status === 'placed' ? 'ORDER PLACED' : order.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'} • Courier: <strong>{order.carrier || deliveryTurnaround.courier}</strong> (Tracking: <strong>{order.trackingNumber || 'BD-' + order.orderNumber.replace(/[^0-9]/g, '').slice(-6) + 'IN'}</strong>)
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-slate-500 block">Total Amount</span>
                            <span className="text-base font-extrabold text-[#114B5F]">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Delivery Turnaround & Arrival Date Banner */}
                        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Truck className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-black block">
                                {order.status === 'delivered'
                                  ? 'Delivered Successfully'
                                  : `Guaranteed Delivery: ${deliveryTurnaround.daysRange}`}
                              </span>
                              <span className="text-[11px] text-[#5C554E]">
                                {order.status === 'delivered'
                                  ? `Delivered within ${deliveryTurnaround.daysRange} of order confirmation.`
                                  : `Arriving by ${expectedDeliveryDate} via ${order.carrier || deliveryTurnaround.courier} (${deliveryTurnaround.tier})`}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-[#5C554E] block">Delivering to:</span>
                            <span className="text-xs font-bold text-black">
                              {order.customer?.city || 'India'} {order.customer?.pincode ? `- ${order.customer.pincode}` : ''}
                            </span>
                          </div>
                        </div>

                        {/* Visual Status Tracker */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          {renderStatusTracker(order.status, deliveryTurnaround.daysRange)}
                        </div>

                        {/* Order Items */}
                        <div className="divide-y divide-slate-100">
                          {order.items.map((item, i) => (
                            <div key={i} className="py-3 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-14 h-16 rounded-lg object-cover bg-slate-100"
                                />
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-800">{item.name}</h4>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-slate-800">
                                {formatPrice((item.unitPrice || item.price || 0) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5DCD3] shadow-xs space-y-6 text-left">
                <div>
                  <h2 className="text-lg font-black text-black">Edit Personal Profile</h2>
                  <p className="text-xs text-[#5C554E] mt-0.5 font-medium">Update your name, contact phone, and account password.</p>
                </div>

                {profileSavedMsg && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your profile changes have been saved successfully!</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-[#FAF6F2]/70 focus:bg-white border border-[#E5DCD3] rounded-xl outline-none focus:border-black transition text-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-black block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F2] border border-[#E5DCD3] rounded-xl text-[#786F66] cursor-not-allowed font-medium"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-black block mb-1">
                      Contact Phone (strictly 10 digits)
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: sanitizePhoneInput(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-[#FAF6F2]/70 focus:bg-white border border-[#E5DCD3] rounded-xl outline-none focus:border-black transition text-black"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-black block mb-1">
                      Change Password (Optional)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#786F66] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="Enter new password (min. 6 characters)"
                        value={profileForm.newPassword}
                        onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium bg-[#FAF6F2]/70 focus:bg-white border border-[#E5DCD3] rounded-xl outline-none focus:border-black transition text-black"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-98"
                  >
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 text-left">
                <div className="bg-white rounded-2xl p-6 border border-[#E5DCD3] shadow-xs flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-black">Saved Delivery Addresses</h2>
                    <p className="text-xs text-[#5C554E] font-medium">Manage delivery addresses for seamless checkout.</p>
                  </div>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Add Address Form Modal / Inline Box */}
                {showAddressForm && (
                  <form
                    onSubmit={handleAddAddressSubmit}
                    className="bg-white rounded-2xl p-6 border-2 border-black/20 shadow-md space-y-4"
                  >
                    <h3 className="text-sm font-bold text-black">Enter New Shipping Address</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Recipient Name *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone (strictly 10 digits) *</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          placeholder="10-digit mobile number"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: sanitizePhoneInput(e.target.value) })}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="House / Flat No., Building, Street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">PIN Code *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition shadow-xs"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-5 py-2.5 border border-[#E5DCD3] text-[#5C554E] text-xs font-semibold rounded-xl hover:bg-[#FAF6F2] transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Address Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`bg-white rounded-2xl p-5 border shadow-xs relative flex flex-col justify-between ${
                          addr.isDefault ? 'border-black ring-2 ring-black/10' : 'border-[#E5DCD3]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-black">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black text-white">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#5C554E] leading-relaxed">
                            {addr.street} {addr.apartment ? `, ${addr.apartment}` : ''}<br />
                            {addr.city}, {addr.state} — <strong>{addr.postalCode}</strong><br />
                            {addr.country}
                          </p>
                          <p className="text-xs text-[#5C554E] mt-2 font-medium">
                            Phone: <strong>{addr.phone}</strong>
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-[#E5DCD3]/60 flex items-center justify-between">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => setDefaultAddress(addr.id!)}
                              className="text-xs font-bold text-black hover:underline"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="text-xs text-[#786F66] font-medium">Default Delivery</span>
                          )}

                          <button
                            onClick={() => removeAddress(addr.id!)}
                            className="text-[#786F66] hover:text-red-500 p-1 transition"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white rounded-2xl p-8 border border-[#E5DCD3] text-center space-y-2">
                      <MapPin className="w-8 h-8 text-[#786F66] mx-auto opacity-40" />
                      <h3 className="text-sm font-bold text-black">No saved addresses yet</h3>
                      <p className="text-xs text-[#5C554E] font-medium">Click "Add New Address" above to save your shipping destination for 1-click checkout.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: NOTIFICATIONS & ORDER STATUS UPDATES */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 text-left">
                <div className="bg-white rounded-2xl p-6 border border-[#E5DCD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-black flex items-center gap-2">
                      <Bell className="w-5 h-5 text-black" />
                      <span>Notifications & Order Updates</span>
                    </h2>
                    <p className="text-xs text-[#5C554E] mt-0.5 font-medium">
                      Live status updates on your orders (Confirmed, Packed, Shipped, Delivered) and delivery tracking.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {unreadCount > 0 ? (
                      <button
                        onClick={markAllAsRead}
                        className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark all as read ({unreadCount} new)</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-[#FAF6F2] border border-[#E5DCD3] rounded-full text-xs font-bold text-[#5C554E] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>0 unread (All caught up)</span>
                      </span>
                    )}
                    <span className="px-2.5 py-1.5 bg-white border border-[#E5DCD3] rounded-full text-xs font-bold text-black">
                      {notifications.length} total
                    </span>
                  </div>
                </div>

                {/* Live Order Status Updates Feed */}
                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map((item) => {
                      const isUnread = !readNotificationIds.includes(item.id);
                      return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl p-5 border transition-all shadow-2xs text-left relative ${
                          isUnread ? 'ring-2 ring-emerald-500/40 border-emerald-400' : ''
                        } ${
                          item.type === 'delivered'
                            ? 'border-emerald-200 bg-emerald-50/20'
                            : item.type === 'shipped'
                            ? 'border-blue-200 bg-blue-50/20'
                            : item.type === 'packed'
                            ? 'border-purple-200 bg-purple-50/20'
                            : item.type === 'confirmed'
                            ? 'border-sky-200 bg-sky-50/20'
                            : 'border-amber-200 bg-amber-50/20'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              item.type === 'delivered'
                                ? 'bg-emerald-100 text-emerald-700'
                                : item.type === 'shipped'
                                ? 'bg-blue-100 text-blue-700'
                                : item.type === 'packed'
                                ? 'bg-purple-100 text-purple-700'
                                : item.type === 'confirmed'
                                ? 'bg-sky-100 text-sky-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {item.type === 'delivered' && <CheckCircle2 className="w-5 h-5" />}
                            {item.type === 'shipped' && <Truck className="w-5 h-5" />}
                            {item.type === 'packed' && <Box className="w-5 h-5" />}
                            {item.type === 'confirmed' && <Check className="w-5 h-5" />}
                            {item.type === 'placed' && <Clock className="w-5 h-5" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-extrabold text-black">
                                  {item.title}
                                </h4>
                                {isUnread && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white animate-pulse">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#786F66] font-medium shrink-0">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-xs text-[#5C554E] leading-relaxed font-medium mb-3">
                              {item.message}
                            </p>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleTabChange('orders')}
                                className="text-xs font-bold text-black underline hover:text-[#AA8222] transition"
                              >
                                View Order Details & Tracking →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                  ) : (
                    <div className="bg-white rounded-2xl p-10 border border-[#E5DCD3] text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF6F2] text-[#786F66] flex items-center justify-center mx-auto border border-[#E5DCD3]">
                        <Bell className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-black">No active order notifications yet</h3>
                      <p className="text-xs text-[#5C554E] max-w-sm mx-auto leading-relaxed font-medium">
                        When you place an order, live shipping milestones (Order Confirmed, Packed, Shipped, Delivered) will update here in real time.
                      </p>
                    </div>
                  )}
                </div>

                {/* Notification Channel Preferences */}
                <div className="bg-white rounded-2xl p-6 border border-[#E5DCD3] shadow-xs space-y-4 text-left">
                  <h3 className="text-xs font-black text-black uppercase tracking-wider">
                    Notification Preferences & Alerts
                  </h3>
                  <div className="divide-y divide-[#E5DCD3]/60">
                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-black block">Order Status Alerts</span>
                        <span className="text-[11px] text-[#5C554E]">Receive instant updates when orders are confirmed & packed.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.orderStatusAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, orderStatusAlerts: e.target.checked })}
                        className="w-4 h-4 accent-black rounded cursor-pointer"
                      />
                    </div>

                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-black block">Dispatch & Courier Live Tracking</span>
                        <span className="text-[11px] text-[#5C554E]">Get courier tracking numbers and out-for-delivery notifications.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.dispatchTracking}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, dispatchTracking: e.target.checked })}
                        className="w-4 h-4 accent-black rounded cursor-pointer"
                      />
                    </div>

                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-black block">WhatsApp & SMS Updates</span>
                        <span className="text-[11px] text-[#5C554E]">Receive automated delivery notifications directly on WhatsApp.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.whatsappAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, whatsappAlerts: e.target.checked })}
                        className="w-4 h-4 accent-black rounded cursor-pointer"
                      />
                    </div>

                    <div className="py-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-black block">Member Exclusive Drops & Offers</span>
                        <span className="text-[11px] text-[#5C554E]">Early access to festive silk sarees and seasonal dry fruit harvests.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.exclusiveOffers}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, exclusiveOffers: e.target.checked })}
                        className="w-4 h-4 accent-black rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HELP & CUSTOMER SUPPORT */}
            {activeTab === 'help' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5DCD3] shadow-xs text-left">
                <CustomerSupportAndFAQ embedded={true} />
              </div>
            )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFEB] text-black">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-24 md:pb-10">
        {/* Page Top Heading */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            My Account
          </h1>
          <p className="text-xs sm:text-sm text-[#5C554E] mt-1 font-medium">
            Welcome back, <strong>{user.fullName}</strong>! Manage your orders, personal details, and addresses.
          </p>
        </div>

        {/* Mobile-First Header & Benefits matching Screenshot 1 */}
        <div className="block lg:hidden space-y-4 mb-6 text-left">
          {/* Member Rewards Banner */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-purple-600 font-black text-sm">✨ Plus Silver</span>
              <span className="text-xs text-neutral-800 font-semibold truncate">
                Extra Coins & Free Express Shipping on ₹999+
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-600 shrink-0" />
          </div>

          {/* Three Action Buttons: Orders, Wishlist & Help (Vertically Stacked for Zero Truncation) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => handleTabChange('orders')}
              className={`py-3 px-2 rounded-2xl border transition-all flex flex-col items-center justify-center text-center bg-white shadow-2xs active:scale-95 cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-[#E44A2D] ring-2 ring-[#E44A2D]/20 bg-orange-50/20'
                  : 'border-[#E5DCD3] hover:border-black'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-1.5 shadow-2xs">
                <Box className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-xs font-black text-black leading-tight">Orders</span>
              <span className="text-[10px] text-[#786F66] leading-tight mt-0.5 whitespace-nowrap">
                {userOrders.length} placed
              </span>
            </button>

            <Link
              to="/wishlist"
              className="py-3 px-2 rounded-2xl border border-[#E5DCD3] hover:border-black bg-white transition-all flex flex-col items-center justify-center text-center shadow-2xs active:scale-95 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mb-1.5 shadow-2xs">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <span className="text-xs font-black text-black leading-tight">Wishlist</span>
              <span className="text-[10px] text-[#786F66] leading-tight mt-0.5 whitespace-nowrap">
                {wishlistCount} items
              </span>
            </Link>

            <button
              type="button"
              onClick={() => handleTabChange('help')}
              className={`py-3 px-2 rounded-2xl border transition-all flex flex-col items-center justify-center text-center bg-white shadow-2xs active:scale-95 cursor-pointer ${
                activeTab === 'help'
                  ? 'border-[#E44A2D] ring-2 ring-[#E44A2D]/20 bg-orange-50/20'
                  : 'border-[#E5DCD3] hover:border-black'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-1.5 shadow-2xs">
                <HelpCircle className="w-5 h-5 text-amber-700" />
              </div>
              <span className="text-xs font-black text-black leading-tight">Help</span>
              <span className="text-[10px] text-[#786F66] leading-tight mt-0.5 whitespace-nowrap">
                Self-Help
              </span>
            </button>
          </div>

          {/* Active Tab View for Mobile (Immediately below the 3 buttons) */}
          <div id="account-tab-content-mobile" className="block lg:hidden mt-4 space-y-6">
            {renderTabContent()}
          </div>

          {/* Finance Options / Lifestyle Privileges */}
          <div className="bg-white rounded-2xl border border-[#E5DCD3] p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-black uppercase tracking-wider">
              Store Privileges & Benefits
            </h3>

            <div className="divide-y divide-[#E5DCD3]/60 text-xs">
              {/* Item 1 */}
              <div className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                    <span className="font-black text-sm">₹</span>
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-black block truncate">
                      Instant Festive Savings upto ₹1,000
                    </span>
                    <span className="text-[10px] text-[#5C554E] block">
                      Use code KAVI10 at checkout • 100% digital
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#786F66] shrink-0" />
              </div>

              {/* Item 2 */}
              <div className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-black block truncate">
                      Kavi's Loyalty Coins & Rewards
                    </span>
                    <span className="text-[10px] text-[#5C554E] block">
                      Earn 5% rewards points on every order
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#786F66] shrink-0" />
              </div>

              {/* Item 3 */}
              <div className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-black block truncate">
                      Express 24-Hour Insured Dispatch
                    </span>
                    <span className="text-[10px] text-[#5C554E] block">
                      Safely delivered across all pin codes in India
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#786F66] shrink-0" />
              </div>
            </div>
          </div>

          {/* Recently Viewed Stores / Collections */}
          <div className="bg-white rounded-2xl border border-[#E5DCD3] p-4 shadow-2xs">
            <h3 className="text-xs font-black text-black uppercase tracking-wider mb-2.5">
              Recently Viewed Stores
            </h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
              {[
                { title: "Women's Fashion", image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80', link: '/shop?dept=womens-fashion' },
                { title: 'Dry Fruits & Nuts', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=150&q=80', link: '/shop?dept=dry-fruits-nuts' },
                { title: 'Perfumes & Attars', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=150&q=80', link: '/shop?dept=perfumes-fragrances' },
                { title: 'Ayurvedic Glow', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80', link: '/shop?dept=cosmetics-beauty' },
              ].map((store) => (
                <Link
                  key={store.title}
                  to={store.link}
                  className="flex flex-col items-center shrink-0 w-18 text-center group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF6F2] border border-[#E5DCD3] mb-1">
                    <img
                      src={store.image}
                      alt={store.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-black line-clamp-1">
                    {store.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Coupons & Offers Banner Card */}
          <Link
            to="/shop"
            className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center font-black shadow-xs">
                %
              </div>
              <div>
                <span className="text-xs font-black text-black block">
                  Coupons & Offers
                </span>
                <span className="text-[11px] text-[#5C554E]">
                  Explore and grab the best festive deals
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </Link>

          {/* Mobile Account Navigation & Settings */}
          <div className="bg-white rounded-2xl border border-[#E5DCD3] p-4 shadow-2xs space-y-1">
            <h3 className="text-xs font-black text-black uppercase tracking-wider mb-2">
              Account Settings & Preferences
            </h3>

            {/* Edit Profile */}
            <button
              type="button"
              onClick={() => handleTabChange('profile')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-black hover:bg-[#FAF6F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'opacity-40'}`} />
            </button>

            {/* Saved Addresses */}
            <button
              type="button"
              onClick={() => handleTabChange('addresses')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-black hover:bg-[#FAF6F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-[#FAF6F2] text-black font-semibold'
              }`}>
                {addresses.length}
              </span>
            </button>

            {/* Notifications & Alerts */}
            <button
              type="button"
              onClick={() => handleTabChange('notifications')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-black hover:bg-[#FAF6F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notifications & Alerts</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                activeTab === 'notifications'
                  ? 'bg-white/20 text-white font-bold'
                  : unreadCount > 0
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-[#FAF6F2] text-[#5C554E]'
              }`}>
                {unreadCount}
              </span>
            </button>

            {/* Sign Out */}
            <div className="pt-2 mt-2 border-t border-[#E5DCD3]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Quick Actions Bar (Orders, Wishlist, Cart) */}
        <div className="hidden lg:grid grid-cols-3 gap-4 mb-8">
          {/* Orders Button */}
          <button
            onClick={() => handleTabChange('orders')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all text-left flex items-center justify-between group shadow-2xs ${
              activeTab === 'orders'
                ? 'bg-[#E44A2D] text-white border-[#E44A2D] ring-2 ring-[#E44A2D]/10'
                : 'bg-white text-black border-[#E5DCD3] hover:border-black'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#FAF6F2] text-[#E44A2D] border border-[#E5DCD3]'
              }`}>
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">Orders</span>
                <span className={`text-[11px] font-semibold ${
                  activeTab === 'orders' ? 'text-white/80' : 'text-[#786F66]'
                }`}>
                  {userOrders.length} placed
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 transition ${
              activeTab === 'orders' ? 'text-white' : 'text-[#786F66] group-hover:translate-x-0.5'
            }`} />
          </button>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5DCD3] hover:border-black transition-all text-left flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF6F2] text-rose-500 border border-[#E5DCD3] flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-50" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-black block">Wishlist</span>
                <span className="text-[11px] font-semibold text-[#786F66]">
                  {wishlistCount} saved items
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#786F66] group-hover:translate-x-0.5 transition" />
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5DCD3] hover:border-black transition-all text-left flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF6F2] text-amber-600 border border-[#E5DCD3] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-black block">Cart</span>
                <span className="text-[11px] font-semibold text-[#786F66]">
                  {cartCount} in bag
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#786F66] group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Menu (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            
            {/* User Info Header */}
            <div className="p-3 mb-3 bg-[#FAF6F2] rounded-xl flex items-center gap-3 border border-[#E5DCD3]">
              <div className="w-12 h-12 rounded-full bg-black text-white font-bold text-lg flex items-center justify-center uppercase">
                {user.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-black truncate">{user.fullName}</h3>
                <p className="text-xs text-[#786F66] truncate">{user.email}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 mt-1">
                  Active Member
                </span>
              </div>
            </div>

            {/* Menu Item 1: Edit Profile */}
            <button
              onClick={() => handleTabChange('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === 'profile'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black hover:bg-[#FAF6F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'opacity-40'}`} />
            </button>

            {/* Menu Item 2: Saved Addresses */}
            <button
              onClick={() => handleTabChange('addresses')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === 'addresses'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black hover:bg-[#FAF6F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-[#E5DCD3] text-black font-semibold'}`}>
                {addresses.length}
              </span>
            </button>

            {/* Menu Item 3: Notifications & Order Status Updates */}
            <button
              onClick={() => handleTabChange('notifications')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === 'notifications'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black hover:bg-[#FAF6F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notifications & Alerts</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                activeTab === 'notifications'
                  ? 'bg-white/20 text-white font-bold'
                  : unreadCount > 0
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-[#E5DCD3] text-[#5C554E] font-semibold'
              }`}>
                {unreadCount}
              </span>
            </button>

            {/* Menu Item 4: Help & FAQs */}
            <button
              onClick={() => handleTabChange('help')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition ${
                activeTab === 'help'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-black hover:bg-[#FAF6F2]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" />
                <span>Help & FAQs</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'help' ? 'text-white' : 'opacity-40'}`} />
            </button>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {renderTabContent()}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
