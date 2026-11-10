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
  HelpCircle,
  Search,
  X,
  ShieldCheck,
  ExternalLink,
  RotateCcw,
  Video,
  AlertCircle,
  UploadCloud,
  Play
} from 'lucide-react';
import { CustomerSupportAndFAQ } from '../../components/CustomerSupportAndFAQ';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useOrders, Order } from '../../context/OrderContext';
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
  const { orders, getUserOrders, submitReturnRequest } = useOrders();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const userOrders = getUserOrders(user?.email, user?.id);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Return & Refund Request State
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Fabric Defect / Damaged Weave');
  const [returnDescription, setReturnDescription] = useState('');
  const [selectedReturnItemIds, setSelectedReturnItemIds] = useState<string[]>([]);
  const [returnVideoUrl, setReturnVideoUrl] = useState('');
  const [returnVideoName, setReturnVideoName] = useState('');
  const [returnVideoSize, setReturnVideoSize] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnSuccessMsg, setReturnSuccessMsg] = useState(false);
  const [returnErrorMsg, setReturnErrorMsg] = useState('');
  const returnVideoInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleReturnVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setReturnErrorMsg('Please select a valid video file (MP4, WebM, MOV, 3GP, etc.).');
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      setReturnErrorMsg('Video file is too large. Please select a clip under 40MB (a 15-30 second clear defect recording is recommended).');
      return;
    }

    setReturnErrorMsg('');
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setReturnVideoName(file.name);
    setReturnVideoSize(`${sizeInMb} MB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setReturnVideoUrl(dataUrl);
      }
    };
    reader.onerror = () => {
      const objUrl = URL.createObjectURL(file);
      setReturnVideoUrl(objUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenReturnModal = (order: Order) => {
    setSelectedOrderForReturn(order);
    setSelectedReturnItemIds(order.items.map((it) => it.id));
    setReturnReason('Fabric Defect / Damaged Weave');
    setReturnDescription('');
    setReturnVideoUrl('');
    setReturnVideoName('');
    setReturnVideoSize('');
    setReturnErrorMsg('');
    setReturnSuccessMsg(false);
    setIsReturnModalOpen(true);
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;

    if (selectedReturnItemIds.length === 0) {
      setReturnErrorMsg('Please select at least one item you wish to return.');
      return;
    }

    if (!returnVideoUrl) {
      setReturnErrorMsg('Mandatory product verification video is required. Please upload or record a defect/unboxing video.');
      return;
    }

    if (!returnDescription.trim()) {
      setReturnErrorMsg('Please provide a short description of the defect or issue.');
      return;
    }

    setReturnSubmitting(true);
    setReturnErrorMsg('');

    const returnedItems = selectedOrderForReturn.items.filter((it) =>
      selectedReturnItemIds.includes(it.id)
    );
    const itemsSummary = returnedItems.map((it) => `${it.name} (Qty: ${it.quantity})`).join(', ');

    const success = submitReturnRequest(selectedOrderForReturn.id, {
      reason: returnReason,
      description: returnDescription.trim(),
      itemIds: selectedReturnItemIds,
      itemsSummary,
      videoUrl: returnVideoUrl,
      videoName: returnVideoName
    });

    if (success) {
      setReturnSuccessMsg(true);
      setTimeout(() => {
        setIsReturnModalOpen(false);
        setReturnSubmitting(false);
      }, 1500);
    } else {
      setReturnErrorMsg('Failed to submit return request. Please try again.');
      setReturnSubmitting(false);
    }
  };

  const displayedOrders = React.useMemo(() => {
    const q = orderSearchQuery.trim().toLowerCase();
    if (!q) return userOrders;

    return userOrders.filter((o) => {
      const matchNum = (o.orderNumber || '').toLowerCase().includes(q);
      const matchTracking = (o.trackingNumber || '').toLowerCase().includes(q);
      const matchProduct = o.items?.some((it) => (it.name || '').toLowerCase().includes(q));
      return matchNum || matchTracking || matchProduct;
    });
  }, [orderSearchQuery, userOrders]);

  // Redirect to login if user is not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth/login', { state: { from: '/account' } });
    }
  }, [user, navigate]);

  const activeTabParam = searchParams.get('tab') as 'orders' | 'profile' | 'addresses' | 'notifications' | 'help' | null;
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'notifications' | 'help'>(
    activeTabParam || 'orders'
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

      // 6. Return Request Notifications
      if (order.returnRequest) {
        if (order.returnRequest.status === 'approved') {
          list.unshift({
            id: `${order.id}-return-approved`,
            title: 'Return Approved & Refund Credited 💰',
            message: `Return request for Order #${order.orderNumber} has been approved. Refund initiated. ${order.returnRequest.adminRemarks || ''}`,
            time: 'Recent',
            type: 'confirmed',
            orderNumber: order.orderNumber,
            isUnread: true
          });
        } else if (order.returnRequest.status === 'rejected') {
          list.unshift({
            id: `${order.id}-return-rejected`,
            title: 'Return Request Update ⚠️',
            message: `Return request for Order #${order.orderNumber} could not be approved upon video verification: ${order.returnRequest.adminRemarks || 'Product does not qualify.'}`,
            time: 'Recent',
            type: 'placed',
            orderNumber: order.orderNumber,
            isUnread: true
          });
        } else {
          list.unshift({
            id: `${order.id}-return-pending`,
            title: 'Return Video Submitted 📹',
            message: `Verification video for Order #${order.orderNumber} was uploaded. Our quality audit team is reviewing it now.`,
            time: 'Recent',
            type: 'packed',
            orderNumber: order.orderNumber,
            isUnread: true
          });
        }
      }
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
                {/* Store Administrator Notice Banner */}
                {(user?.role === 'admin' || user?.email?.toLowerCase().includes('admin')) && (
                  <div className="bg-[#14213D] text-[#F4EDE0] rounded-2xl p-4 sm:p-5 border border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF6B5B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-white">Administrator Account Mode</h4>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                            {orders.length} Customer Orders in Store
                          </span>
                        </div>
                        <p className="text-xs text-[#F4EDE0]/80 mt-1 leading-relaxed">
                          Orders placed by customers are routed to the <strong>Admin Portal</strong> for store management. This customer page shows only personal orders placed directly by this account.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FF6B5B] hover:bg-[#E85545] text-white text-xs font-bold rounded-xl transition shadow-sm active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>Open Admin Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#114B5F] mb-1">Order History & Live Status</h2>
                    <p className="text-xs text-slate-500">Track shipments, estimated delivery turnaround days, and courier details.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-[#FAF6F2] border border-[#E5DCD3] px-3 py-1.5 rounded-xl text-black">
                      {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'} for {user?.email?.split('@')[0]}
                    </span>
                  </div>
                </div>

                {/* Instant Order Search / Cross-Device Order Lookup */}
                <div className="bg-white rounded-2xl p-4 border border-[#E5DCD3] shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#786F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        placeholder="Search by Order ID (e.g. KV-406008), email, or mobile..."
                        className="w-full pl-9 pr-8 py-2.5 bg-[#FAF6F2] border border-[#E5DCD3] rounded-xl text-xs text-black outline-none focus:border-black focus:bg-white transition"
                      />
                      {orderSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setOrderSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {user?.email && (
                      <div className="text-[11px] text-[#786F66] flex items-center justify-between sm:justify-end gap-2">
                        <span>Logged in as: <strong className="text-black">{user.email}</strong></span>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="text-[#E44A2D] font-bold hover:underline cursor-pointer"
                        >
                          Switch Account
                        </button>
                      </div>
                    )}
                  </div>

                  {orderSearchQuery && (
                    <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center justify-between">
                      <span>Showing results matching "{orderSearchQuery}" ({displayedOrders.length} found)</span>
                      <button onClick={() => setOrderSearchQuery('')} className="underline text-emerald-950 font-bold text-[11px] cursor-pointer">
                        Clear Search
                      </button>
                    </div>
                  )}
                </div>

                {displayedOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-black">
                        {orderSearchQuery ? `No orders found matching "${orderSearchQuery}"` : 'No orders placed yet'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        {orderSearchQuery
                          ? 'Please check the Order ID format (e.g. KV-406008) or clear the search to view your account orders.'
                          : 'Your ordered items and live delivery turnaround tracking will appear right here once you checkout.'}
                      </p>
                    </div>
                    {orderSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => setOrderSearchQuery('')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition cursor-pointer"
                      >
                        Clear Search Filter
                      </button>
                    ) : (
                      <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition"
                      >
                        <span>Explore Shop</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                ) : (
                  displayedOrders.map((order) => {
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
                                  {item.customization && item.customization.totalAddonPrice > 0 && (
                                    <div className="mt-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block font-medium">
                                      {item.customization.fallAndPico && <span className="mr-1.5 font-bold">✨ Fall & Pico</span>}
                                      {item.customization.blouseCustomization && (
                                        <span className="font-bold">
                                          ✂️ Blouse: {item.customization.blouseCustomization.stitchingType} ({item.customization.blouseCustomization.bustSize ? `${item.customization.blouseCustomization.bustSize}"` : ''})
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm font-bold text-slate-800">
                                {formatPrice((item.unitPrice || item.price || 0) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Return Request Status Banner or Request Return Action */}
                        {order.returnRequest ? (
                          <div
                            className={`p-4 rounded-xl border text-xs text-left ${
                              order.returnRequest.status === 'approved'
                                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                                : order.returnRequest.status === 'rejected'
                                ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                                : 'bg-amber-50/90 border-amber-300 text-amber-950'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-black/10">
                              <div className="flex items-center gap-2">
                                <RotateCcw className="w-4 h-4 shrink-0 text-[#FF6B5B]" />
                                <span className="font-black uppercase tracking-wider text-[11px]">
                                  {order.returnRequest.status === 'approved' && '✓ Return Approved & Refund Initiated'}
                                  {order.returnRequest.status === 'rejected' && '✕ Return Request Declined'}
                                  {order.returnRequest.status === 'pending' && '⏳ Return Under Video Verification'}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold opacity-75">
                                Submitted {new Date(order.returnRequest.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>

                            <div className="mt-3 space-y-2 text-xs">
                              <div>
                                <span className="text-slate-600 font-bold">Defect / Reason: </span>
                                <span className="font-extrabold text-black">{order.returnRequest.reason}</span>
                              </div>

                              {order.returnRequest.description && (
                                <div>
                                  <span className="text-slate-600 font-bold">Your Explanation: </span>
                                  <span className="text-slate-800">{order.returnRequest.description}</span>
                                </div>
                              )}

                              {order.returnRequest.videoUrl && (
                                <div className="pt-1 flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-black/10 font-bold text-[11px] text-emerald-800 shadow-2xs">
                                    <Video className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Verification Video: {order.returnRequest.videoName || 'Product Defect Video'}</span>
                                  </span>
                                </div>
                              )}

                              {order.returnRequest.adminRemarks && (
                                <div
                                  className={`p-3 rounded-lg mt-2 text-xs border ${
                                    order.returnRequest.status === 'approved'
                                      ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                                      : 'bg-rose-100/70 border-rose-300 text-rose-950'
                                  }`}
                                >
                                  <div className="font-bold text-[11px] uppercase tracking-wider text-black">
                                    Store Administrator Response:
                                  </div>
                                  <div className="mt-1 font-medium">{order.returnRequest.adminRemarks}</div>
                                  {order.returnRequest.status === 'approved' && (
                                    <div className="mt-1.5 pt-1.5 border-t border-emerald-300/60 font-extrabold text-emerald-900 text-xs">
                                      Refund Amount: {formatPrice(order.returnRequest.refundAmount || order.total)} credited to your account.
                                    </div>
                                  )}
                                </div>
                              )}

                              {order.returnRequest.status === 'pending' && (
                                <p className="text-[11px] text-amber-800 italic mt-1 bg-amber-100/60 p-2 rounded-lg border border-amber-200">
                                  Our store administrator is reviewing your inspection video to verify the product defect. Once confirmed, your refund of <strong>{formatPrice(order.total)}</strong> will be approved immediately.
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="text-slate-500">
                              Received a defective weave or incorrect product?
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenReturnModal(order)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF6F2] hover:bg-[#F0E6D8] text-black border border-slate-300 font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-[#FF6B5B]" />
                              <span>Request Return & Refund (Video Verification)</span>
                            </button>
                          </div>
                        )}
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
    <div className="min-h-screen flex flex-col bg-[#F4EDE0] stripe-cream text-[#14213D]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-24 md:pb-10">
        {/* Page Top Heading */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-[#14213D]">
            My Account
          </h1>
          <p className="text-xs sm:text-sm text-[#14213D]/70 mt-1 font-medium">
            Welcome back, <strong>{user.fullName}</strong>! Manage your orders, personal details, and addresses.
          </p>
        </div>

        {/* Mobile-First Header & Benefits */}
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
              className={`py-3 px-2 rounded-2xl border transition-all flex flex-col items-center justify-center text-center bg-[#FAF6EE] shadow-2xs active:scale-95 cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-[#FF6B5B] ring-2 ring-[#FF6B5B]/20 bg-[#FF6B5B]/10'
                  : 'border-[#E5D8C5] hover:border-[#FF6B5B]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-1.5 shadow-2xs">
                <Box className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-xs font-black text-[#14213D] leading-tight">Orders</span>
              <span className="text-[10px] text-[#14213D]/70 leading-tight mt-0.5 whitespace-nowrap">
                {userOrders.length} placed
              </span>
            </button>

            <Link
              to="/wishlist"
              className="py-3 px-2 rounded-2xl border border-[#E5D8C5] hover:border-[#FF6B5B] bg-[#FAF6EE] transition-all flex flex-col items-center justify-center text-center shadow-2xs active:scale-95 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#FF6B5B] border border-rose-100 flex items-center justify-center mb-1.5 shadow-2xs">
                <Heart className="w-5 h-5 text-[#FF6B5B]" />
              </div>
              <span className="text-xs font-black text-[#14213D] leading-tight">Wishlist</span>
              <span className="text-[10px] text-[#14213D]/70 leading-tight mt-0.5 whitespace-nowrap">
                {wishlistCount} items
              </span>
            </Link>

            <button
              type="button"
              onClick={() => handleTabChange('help')}
              className={`py-3 px-2 rounded-2xl border transition-all flex flex-col items-center justify-center text-center bg-[#FAF6EE] shadow-2xs active:scale-95 cursor-pointer ${
                activeTab === 'help'
                  ? 'border-[#FF6B5B] ring-2 ring-[#FF6B5B]/20 bg-[#FF6B5B]/10'
                  : 'border-[#E5D8C5] hover:border-[#FF6B5B]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-1.5 shadow-2xs">
                <HelpCircle className="w-5 h-5 text-amber-700" />
              </div>
              <span className="text-xs font-black text-[#14213D] leading-tight">Help</span>
              <span className="text-[10px] text-[#14213D]/70 leading-tight mt-0.5 whitespace-nowrap">
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
            className={`p-4 sm:p-5 rounded-2xl border transition-all text-left flex items-center justify-between group shadow-2xs cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#FF6B5B] text-white border-[#FF6B5B] ring-2 ring-[#FF6B5B]/20'
                : 'bg-[#FAF6EE] stripe-card text-[#14213D] border-[#E5D8C5] hover:border-[#FF6B5B]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#F4EDE0] text-[#FF6B5B] border border-[#E5D8C5]'
              }`}>
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">Orders</span>
                <span className={`text-[11px] font-semibold ${
                  activeTab === 'orders' ? 'text-white/80' : 'text-[#14213D]/60'
                }`}>
                  {userOrders.length} placed
                </span>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 transition ${
              activeTab === 'orders' ? 'text-white' : 'text-[#14213D]/60 group-hover:translate-x-0.5'
            }`} />
          </button>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="p-4 sm:p-5 rounded-2xl bg-[#FAF6EE] stripe-card border border-[#E5D8C5] hover:border-[#FF6B5B] transition-all text-left flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#F4EDE0] text-[#FF6B5B] border border-[#E5D8C5] flex items-center justify-center">
                <Heart className="w-5 h-5 fill-[#FF6B5B]" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#14213D] block">Wishlist</span>
                <span className="text-[11px] font-semibold text-[#14213D]/60">
                  {wishlistCount} saved items
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#14213D]/60 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="p-4 sm:p-5 rounded-2xl bg-[#FAF6EE] stripe-card border border-[#E5D8C5] hover:border-[#FF6B5B] transition-all text-left flex items-center justify-between group shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#F4EDE0] text-[#FF6B5B] border border-[#E5D8C5] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-[#14213D] block">Cart</span>
                <span className="text-[11px] font-semibold text-[#14213D]/60">
                  {cartCount} in bag
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#14213D]/60 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Menu (4 cols) */}
          <div className="lg:col-span-4 bg-[#FAF6EE] stripe-card rounded-2xl p-5 border border-[#E5D8C5] shadow-sm space-y-1">
            
            {/* User Info Header */}
            <div className="p-3 mb-3 bg-[#F4EDE0] rounded-xl flex items-center gap-3 border border-[#E5D8C5]">
              <div className="w-12 h-12 rounded-full bg-[#14213D] text-[#F4EDE0] font-bold text-lg flex items-center justify-center uppercase">
                {user.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#14213D] truncate">{user.fullName}</h3>
                <p className="text-xs text-[#14213D]/70 truncate">{user.email}</p>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 mt-1">
                  Active Member
                </span>
              </div>
            </div>

            {/* Menu Item 1: Edit Profile */}
            <button
              onClick={() => handleTabChange('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#14213D] text-[#F4EDE0] shadow-sm'
                  : 'text-[#14213D] hover:bg-[#F4EDE0]'
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

        {/* RETURN & REFUND REQUEST MODAL */}
        {isReturnModalOpen && selectedOrderForReturn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 border border-[#E5DCD3] shadow-2xl space-y-4 my-8 text-left animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#E5DCD3]">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FF6B5B] text-white flex items-center justify-center shadow-xs">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#14213D]">Request Return & Refund</h3>
                      <p className="text-xs text-[#14213D]/60">
                        Order #{selectedOrderForReturn.orderNumber} • Placed {selectedOrderForReturn.createdAt ? new Date(selectedOrderForReturn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-black transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {returnSuccessMsg ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-emerald-950">Return Request Submitted!</h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Your return request along with product verification video has been sent to the store administrator for review. Once verified, your refund will be processed.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReturn} className="space-y-4">
                  {/* Mandatory Video Verification Notice */}
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-amber-950">
                      <span className="font-extrabold block">Mandatory Video Verification Policy</span>
                      <span className="text-[11px] text-amber-900 leading-relaxed block mt-0.5">
                        To qualify for return and prompt refund, please attach an <strong>unboxing or defect verification video</strong> showing the product condition. This protects both you and the store, enabling immediate admin approval.
                      </span>
                    </div>
                  </div>

                  {returnErrorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{returnErrorMsg}</span>
                    </div>
                  )}

                  {/* 1. Item Selection */}
                  <div>
                    <label className="text-xs font-extrabold text-[#14213D] block mb-1.5">
                      1. Select Product(s) to Return *
                    </label>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {selectedOrderForReturn.items.map((item) => {
                        const isChecked = selectedReturnItemIds.includes(item.id);
                        return (
                          <label
                            key={item.id}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition ${
                              isChecked
                                ? 'bg-emerald-50/60 border-emerald-300'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedReturnItemIds(selectedReturnItemIds.filter((id) => id !== item.id));
                                } else {
                                  setSelectedReturnItemIds([...selectedReturnItemIds, item.id]);
                                }
                              }}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Qty: {item.quantity} • {formatPrice(item.unitPrice || item.price || 0)}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Return Reason */}
                  <div>
                    <label className="text-xs font-extrabold text-[#14213D] block mb-1">
                      2. Primary Reason for Return *
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold bg-[#FAF6F2] border border-[#E5DCD3] rounded-xl outline-none focus:border-[#FF6B5B] transition cursor-pointer"
                    >
                      <option value="Fabric Defect / Damaged Weave">Fabric Defect / Damaged Weave or Zari</option>
                      <option value="Wrong Product or Color Received">Wrong Product / Variant Received</option>
                      <option value="Physical Damage During Delivery">Physical Damage During Delivery / Torn Package</option>
                      <option value="Blouse Stitching / Customization Discrepancy">Blouse Stitching / Customization Discrepancy</option>
                      <option value="Missing Fall, Pico, or Add-ons">Missing Fall, Pico, or Add-on Accessories</option>
                      <option value="Item Quality Differs from Description">Item Quality Differs from Store Description</option>
                      <option value="Other Defect">Other Product Issue</option>
                    </select>
                  </div>

                  {/* 3. Detailed Explanation */}
                  <div>
                    <label className="text-xs font-extrabold text-[#14213D] block mb-1">
                      3. Describe the Issue / Defect *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={returnDescription}
                      onChange={(e) => setReturnDescription(e.target.value)}
                      placeholder="Provide specific details about where the defect is located (e.g. tear on saree pallu, missing blouse piece, wrong scent notes)..."
                      className="w-full px-3.5 py-2 text-xs bg-[#FAF6F2] border border-[#E5DCD3] rounded-xl outline-none focus:border-[#FF6B5B] transition"
                    />
                  </div>

                  {/* 4. Mandatory Video Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-extrabold text-[#14213D]">
                        4. Attach Verification Video * <span className="text-[#FF6B5B]">(Mandatory)</span>
                      </label>
                      {returnVideoSize && (
                        <span className="text-[10px] font-bold text-slate-500">
                          Size: {returnVideoSize}
                        </span>
                      )}
                    </div>

                    <input
                      ref={returnVideoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleReturnVideoChange}
                      className="hidden"
                    />

                    {returnVideoUrl ? (
                      <div className="space-y-2">
                        <div className="rounded-xl overflow-hidden border border-slate-300 bg-black shadow-inner">
                          <video
                            src={returnVideoUrl}
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full max-h-48 rounded-xl object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 truncate max-w-xs font-medium">
                            📹 {returnVideoName || 'Uploaded Video'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setReturnVideoUrl('');
                              setReturnVideoName('');
                              setReturnVideoSize('');
                              if (returnVideoInputRef.current) returnVideoInputRef.current.value = '';
                            }}
                            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            Change / Remove Video
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => returnVideoInputRef.current?.click()}
                        className="border-2 border-dashed border-[#FF6B5B]/50 hover:border-[#FF6B5B] bg-[#FFF8F6] rounded-2xl p-4 text-center cursor-pointer transition hover:bg-[#FFF0ED]"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#FF6B5B]/15 text-[#FF6B5B] flex items-center justify-center mx-auto mb-2">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-black block">
                          Click to select or record product inspection video
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          MP4, MOV, WebM or phone recording (Max 40MB)
                        </span>
                        <span className="inline-block mt-2 px-3 py-1 bg-[#FF6B5B] text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                          Upload Video (Required)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Submit & Cancel Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E5DCD3]">
                    <button
                      type="button"
                      onClick={() => setIsReturnModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={returnSubmitting || !returnVideoUrl}
                      className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition shadow-sm flex items-center gap-2 ${
                        !returnVideoUrl || returnSubmitting
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-[#FF6B5B] hover:bg-[#e85a4a] cursor-pointer'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{returnSubmitting ? 'Submitting Request...' : 'Submit Return Request'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
