import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Plus,
  Check,
  Truck,
  Clock,
  Box,
  Calendar,
  Package,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  X,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnnouncementBar } from '../../components/AnnouncementBar';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders, Order } from '../../context/OrderContext';
import { ShippingAddress } from '../../types';
import { validateEmail, validatePhone, sanitizeEmailInput, sanitizePhoneInput } from '../../utils/validation';
import { initiateRazorpayCheckout, RazorpayOrderResponse } from '../../services/razorpay';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, discount, shippingCharge, total, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { user, addresses, addAddress, updateProfile } = useAuth();
  const { placeOrder } = useOrders();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [saveToAccount, setSaveToAccount] = useState<boolean>(true);

  // Form State: strictly populated from saved address or clean
  const [formData, setFormData] = useState(() => {
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    if (defaultAddr) {
      return {
        fullName: defaultAddr.fullName || user?.fullName || '',
        email: user?.email || '',
        phone: defaultAddr.phone || user?.phone || '',
        address: defaultAddr.street || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        pincode: defaultAddr.postalCode || '',
        country: defaultAddr.country || 'India',
        paymentMethod: 'razorpay'
      };
    }
    return {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      paymentMethod: 'razorpay'
    };
  });

  // Automatically pre-fill contact and shipping details from saved address
  useEffect(() => {
    if (user) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setFormData(prev => ({
          ...prev,
          fullName: defaultAddr.fullName || user.fullName || prev.fullName,
          email: user.email || prev.email,
          phone: defaultAddr.phone || user.phone || prev.phone,
          address: defaultAddr.street || '',
          city: defaultAddr.city || '',
          state: defaultAddr.state || '',
          pincode: defaultAddr.postalCode || '',
          country: defaultAddr.country || 'India',
        }));
      } else {
        setSelectedAddressId('new');
        setFormData(prev => ({
          ...prev,
          fullName: user.fullName || prev.fullName,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
        }));
      }
    }
  }, [user?.email, addresses]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');
  const [simulatorData, setSimulatorData] = useState<RazorpayOrderResponse | null>(null);
  const [simulatingMethod, setSimulatingMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isSimulatingPayment, setIsSimulatingPayment] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('kavis_last_placed_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectAddress = (addr: ShippingAddress) => {
    setSelectedAddressId(addr.id);
    setFormData(prev => ({
      ...prev,
      fullName: addr.fullName || prev.fullName,
      phone: addr.phone || prev.phone,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.postalCode,
      country: addr.country || 'India'
    }));
  };

  const handleSelectNewAddress = () => {
    setSelectedAddressId('new');
    setFormData(prev => ({
      ...prev,
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required contact and shipping details.');
      return;
    }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) {
      alert(emailCheck.message || 'Email must be lowercase and end with @gmail.com.');
      return;
    }

    const phoneCheck = validatePhone(formData.phone, true);
    if (!phoneCheck.isValid) {
      alert(phoneCheck.message || 'Phone number must be strictly 10 digits.');
      return;
    }

    setIsProcessing(true);

    // Save new address to active user account if requested
    if (user && saveToAccount && selectedAddressId === 'new' && formData.address) {
      addAddress({
        fullName: formData.fullName,
        phone: formData.phone,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pincode,
        country: formData.country,
        isDefault: addresses.length === 0
      });
    }

    // If profile didn't have phone, save the phone number entered here
    if (user && !user.phone && formData.phone) {
      updateProfile({ phone: formData.phone });
    }

    if (formData.paymentMethod === 'cod') {
      finalizeOrderPlacement('Cash on Delivery (COD)', 'pending');
      return;
    }

    // Razorpay Online Payment Flow
    const generatedOrderNumber = `KV-${Math.floor(100000 + Math.random() * 900000)}`;
    initiateRazorpayCheckout({
      amount: total,
      orderNumber: generatedOrderNumber,
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      onSuccess: (result) => {
        finalizeOrderPlacement('Prepaid Online (Razorpay 256-Bit SSL)', 'paid', result.paymentId);
      },
      onFailure: (errMsg) => {
        setIsProcessing(false);
        if (!errMsg.includes('cancelled')) {
          alert(`Payment Notice: ${errMsg}`);
        }
      },
      onOpenSimulator: (orderData) => {
        setIsProcessing(false);
        setSimulatorData(orderData);
      }
    });
  };

  const finalizeOrderPlacement = (
    methodLabel: string,
    _paymentStatus: 'paid' | 'pending',
    _paymentId?: string
  ) => {
    const orderItems = cart.map(item => ({
      id: item.id,
      name: item.product.name,
      image: item.product.images[0],
      variant: item.selectedVariant?.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      customization: item.customization
    }));

    const createdOrder = placeOrder({
      userId: user?.id,
      userEmail: user?.email,
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      items: orderItems,
      subtotal,
      discount,
      shipping: shippingCharge,
      total,
      paymentMethod: methodLabel
    });

    setPlacedOrderId(createdOrder.orderNumber);
    setPlacedOrder(createdOrder);
    try {
      localStorage.setItem('kavis_last_placed_order', JSON.stringify(createdOrder));
    } catch (e) {
      console.error(e);
    }

    setIsProcessing(false);
    setIsOrderPlaced(true);
    setSimulatorData(null);
    clearCart();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSimulatedPaymentSuccess = () => {
    setIsSimulatingPayment(true);
    setTimeout(() => {
      setIsSimulatingPayment(false);
      finalizeOrderPlacement(
        'Prepaid Online (Razorpay 256-Bit SSL)',
        'paid',
        `pay_sim_${Date.now()}`
      );
    }, 1100);
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

  const getExpectedDeliveryDateString = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isOrderPlaced) {
    const deliveryInfo = calculateDeliveryTurnaround(formData.city, formData.pincode);
    const expectedDate = getExpectedDeliveryDateString(deliveryInfo.daysCount);

    return (
      <div className="min-h-screen flex flex-col bg-[#F5EFEB] text-black">
        <AnnouncementBar />
        <Navbar />

        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DCD3] shadow-sm space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-black">
                Order Placed Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-[#5C554E] mt-1 font-medium">
                Thank you for shopping with <strong>Kavi's Lifestyle</strong>. Your order is confirmed and our dispatch team has initiated fulfillment.
              </p>
            </div>

            {/* Ordered Products Itemized List */}
            {placedOrder && placedOrder.items && placedOrder.items.length > 0 && (
              <div className="bg-[#FAF6F2] rounded-2xl p-5 border border-[#E5DCD3] text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5DCD3]">
                  <h3 className="text-xs sm:text-sm font-black text-black flex items-center gap-2">
                    <Package className="w-4 h-4 text-black" />
                    <span>Items Ordered ({placedOrder.items.length})</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-black">
                    {placedOrder.orderNumber}
                  </span>
                </div>

                <div className="divide-y divide-[#E5DCD3]/70">
                  {placedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover bg-white border border-[#E5DCD3] shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-white border border-[#E5DCD3] flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 text-[#786F66]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-black truncate">
                            {item.name}
                          </h4>
                          {item.variant && (
                            <span className="text-[11px] text-[#5C554E] block truncate">
                              Variant: {item.variant}
                            </span>
                          )}
                          <span className="text-[11px] text-[#5C554E] block mt-0.5">
                            Qty: <strong>{item.quantity}</strong> × {formatPrice(item.unitPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-black text-black block">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown Footer */}
                <div className="pt-3 border-t border-[#E5DCD3] space-y-1.5 text-xs text-[#5C554E]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">{formatPrice(placedOrder.subtotal)}</span>
                  </div>
                  {placedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span>Festive Savings (KAVI10)</span>
                      <span>-{formatPrice(placedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express 24H Delivery</span>
                    <span className="text-emerald-800 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-[#E5DCD3]">
                    <span>Total Amount Paid</span>
                    <span className="text-base text-[#114B5F]">{formatPrice(placedOrder.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Details Summary */}
            <div className="bg-[#FAF6F2] p-5 rounded-2xl border border-[#E5DCD3] text-left text-xs space-y-2.5">
              <div className="flex justify-between font-bold text-black">
                <span>Order Reference:</span>
                <span className="font-mono text-black font-black text-sm">{placedOrderId}</span>
              </div>
              <div className="flex justify-between text-[#5C554E]">
                <span>Updates Sent To:</span>
                <span className="font-bold text-black">{formData.email}</span>
              </div>
              <div className="flex justify-between text-[#5C554E]">
                <span>Delivery Destination:</span>
                <span className="font-bold text-black truncate max-w-xs">{formData.address}, {formData.city} - {formData.pincode}</span>
              </div>
              <div className="flex justify-between text-[#5C554E]">
                <span>Payment Method:</span>
                <span className="font-bold text-black">{formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid Online (Razorpay 256-Bit SSL)'}</span>
              </div>
              <div className="flex justify-between text-[#5C554E] pt-1 border-t border-[#E5DCD3]">
                <span>Delivery Guarantee:</span>
                <span className="font-bold text-emerald-800">Delivered within {deliveryInfo.daysRange}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/account?tab=orders')}
                className="flex-1 py-3.5 bg-[#FF6B5B] hover:bg-[#E85545] text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track in Order Status</span>
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="flex-1 py-3.5 border border-[#E5D8C5] bg-[#FAF6EE] text-[#14213D] font-bold text-xs rounded-xl hover:bg-[#F4EDE0] transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4EDE0] stripe-cream text-[#14213D]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-left">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14213D]/70 hover:text-[#14213D] mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14213D]">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#14213D]/70 mt-1 font-medium">
            Complete your contact, shipping, and payment details.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E5DCD3] max-w-md mx-auto">
            <h2 className="text-base font-bold text-black">Your bag is currently empty</h2>
            <button
              onClick={() => navigate('/shop')}
              className="mt-4 px-6 py-2.5 bg-black text-white text-xs font-bold rounded-xl"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Contact Information */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5DCD3] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E5DCD3]">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm font-black text-black">Contact Details</h2>
                </div>

                {!user && (
                  <div className="p-3 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-[#5C554E] font-medium">Have an account with us?</span>
                    <Link
                      to="/auth/login"
                      state={{ from: '/checkout' }}
                      className="font-bold text-black hover:underline"
                    >
                      Sign In for Saved Addresses →
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 text-xs border border-[#E5DCD3] rounded-lg outline-none focus:border-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: sanitizeEmailInput(e.target.value) }))}
                      placeholder="yourname@gmail.com"
                      className="w-full px-3 py-2 text-xs border border-[#E5DCD3] rounded-lg outline-none focus:border-black bg-white lowercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-black block mb-1">Phone Number (strictly 10 digits) *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    maxLength={10}
                    inputMode="numeric"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: sanitizePhoneInput(e.target.value) }))}
                    placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
                    className="w-full px-3 py-2 text-xs border border-[#E5DCD3] rounded-lg outline-none focus:border-black bg-white"
                  />
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5DCD3] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E5DCD3]">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm font-black text-black">Shipping Address</h2>
                </div>

                {/* Saved Addresses Selector (if account has saved addresses) */}
                {addresses.length > 0 && (
                  <div className="space-y-3 pb-3 border-b border-[#E5DCD3]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-black flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Select Delivery Address</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleSelectNewAddress}
                        className={`text-xs font-bold flex items-center gap-1 transition ${
                          selectedAddressId === 'new' ? 'text-black underline' : 'text-[#5C554E] hover:text-black'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add / New Address</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-3.5 rounded-xl border text-xs cursor-pointer transition relative ${
                              isSelected
                                ? 'border-black bg-[#FAF6F2] ring-2 ring-black shadow-xs'
                                : 'border-[#E5DCD3] bg-white hover:border-black'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-1.5">
                              <span className="font-bold text-black truncate">{addr.fullName}</span>
                              {addr.isDefault && (
                                <span className="px-1.5 py-0.5 rounded bg-black text-white text-[9px] font-bold">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p className="text-[#5C554E] leading-relaxed line-clamp-2">
                              {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                            <p className="text-[#786F66] text-[11px] mt-1 font-medium">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}


                <div>
                  <label className="text-xs font-bold text-black block mb-1">Street Address / House / Flat *</label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={formData.address}
                    onChange={(e) => {
                      setSelectedAddressId('new');
                      handleChange(e);
                    }}
                    placeholder="House / Flat No., Building Name, Street, Area"
                    className="w-full px-3 py-2 text-xs border border-[#E5DCD3] rounded-lg outline-none focus:border-black bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={(e) => {
                        setSelectedAddressId('new');
                        handleChange(e);
                      }}
                      placeholder="City / District"
                      className="w-full px-3 py-2 text-xs border border-[#E5DCD3] rounded-lg outline-none focus:border-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">State / Region *</label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={(e) => {
                        setSelectedAddressId('new');
                        handleChange(e);
                      }}
                      placeholder="State / Province"
                      className="w-full px-3 py-2 text-xs border border-[#E5DCD3] rounded-lg outline-none focus:border-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">PIN / Postal Code *</label>
                    <input
                      type="text"
                      required
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) => {
                        setSelectedAddressId('new');
                        handleChange(e);
                      }}
                      placeholder="6-digit PIN code"
                      className="w-full px-3 py-2 text-xs border border-[#E5DCD3] rounded-lg outline-none focus:border-black bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-black block mb-1">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-[#E5DCD3] rounded-lg outline-none focus:border-black bg-white font-medium"
                  >
                    <option value="India">India (Pan-India Express)</option>
                    <option value="United Arab Emirates">United Arab Emirates (Dubai / Abu Dhabi)</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>

                {user && selectedAddressId === 'new' && (
                  <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs font-medium text-black">
                    <input
                      type="checkbox"
                      checked={saveToAccount}
                      onChange={(e) => setSaveToAccount(e.target.checked)}
                      className="w-4 h-4 accent-black rounded cursor-pointer"
                    />
                    <span>Save this delivery address to my account for future orders</span>
                  </label>
                )}
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5DCD3] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E5DCD3]">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-black text-black">Payment Option</h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-black bg-[#FAF6F2] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={handleChange}
                      className="accent-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-black">
                          Razorpay Secure (UPI, GPay, PhonePe, Cards, NetBanking)
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white">
                          Instant
                        </span>
                      </div>
                      <p className="text-xs text-[#5C554E] mt-0.5">
                        Encrypted 256-Bit SSL payment processing.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E5DCD3] hover:border-black bg-white cursor-pointer transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="accent-black"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-black">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-xs text-[#5C554E] mt-0.5">
                        Pay upon doorstep arrival in India.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E5DCD3] shadow-xs space-y-5">
              <h2 className="text-sm font-black text-black pb-2 border-b border-[#E5DCD3]">
                Order Review ({cart.length} items)
              </h2>

              <div className="max-h-64 overflow-y-auto divide-y divide-[#E5DCD3] pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-10 h-12 rounded object-cover flex-shrink-0 bg-slate-100"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-black truncate">{item.product.name}</p>
                        <p className="text-[11px] text-[#5C554E]">Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}</p>
                        {item.customization && item.customization.totalAddonPrice > 0 && (
                          <div className="mt-1 text-[10px] text-emerald-800 font-medium">
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
                    <span className="font-black text-black flex-shrink-0">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs text-[#5C554E] pt-3 border-t border-[#E5DCD3]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-black">
                    {shippingCharge === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(shippingCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-black pt-3 border-t border-[#E5DCD3]">
                  <span>Total Payable</span>
                  <span className="text-xl font-black text-black">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit CTA (10% Coral Hero Button) */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-[#FF6B5B] hover:bg-[#E85545] disabled:bg-neutral-400 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md active:scale-98 transition cursor-pointer"
              >
                {isProcessing ? (
                  <span>Securing Order & Verifying...</span>
                ) : (
                  <>
                    <span>Complete & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Razorpay Gateway Interactive Payment Simulator Modal */}
        {simulatorData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5DCD3] overflow-hidden">
              {/* Header */}
              <div className="bg-[#14213D] text-white p-4.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Lock className="w-4.5 h-4.5 text-[#FF6B5B]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight">Razorpay Secure Checkout</h3>
                    <p className="text-[11px] text-white/70">256-Bit SSL Encrypted Payment</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSimulatorData(null)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Amount Banner */}
              <div className="p-4 bg-[#FAF6F2] border-b border-[#E5DCD3] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#5C554E] uppercase tracking-wider block">Total Amount</span>
                  <span className="text-xl font-black text-black">{formatPrice(total)}</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Sandbox Test Mode</span>
                  </span>
                  <span className="text-[10px] text-[#5C554E] block mt-0.5">Order #{simulatorData.orderId.slice(-8)}</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3]">
                  <button
                    type="button"
                    onClick={() => setSimulatingMethod('upi')}
                    className={`py-2 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      simulatingMethod === 'upi' ? 'bg-[#14213D] text-white shadow-xs' : 'text-[#5C554E] hover:text-black'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatingMethod('card')}
                    className={`py-2 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      simulatingMethod === 'card' ? 'bg-[#14213D] text-white shadow-xs' : 'text-[#5C554E] hover:text-black'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatingMethod('netbanking')}
                    className={`py-2 px-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      simulatingMethod === 'netbanking' ? 'bg-[#14213D] text-white shadow-xs' : 'text-[#5C554E] hover:text-black'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>NetBanking</span>
                  </button>
                </div>

                {/* Tab 1: UPI */}
                {simulatingMethod === 'upi' && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3 text-center">
                    <p className="text-xs font-bold text-emerald-950">Scan UPI QR or approve in Google Pay / PhonePe / Paytm</p>
                    <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-emerald-300 shadow-xs flex items-center justify-center">
                      <div className="w-full h-full border-2 border-dashed border-emerald-400 rounded-lg flex flex-col items-center justify-center text-[10px] font-black text-emerald-800">
                        <span>UPI QR</span>
                        <span className="text-[9px] font-normal text-emerald-600">Scan & Pay</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#5C554E]">VPA: <strong>kavislifestyle@razorpay</strong></p>
                  </div>
                )}

                {/* Tab 2: Card */}
                {simulatingMethod === 'card' && (
                  <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[11px] font-bold text-blue-900 pb-1 border-b border-blue-200/60">
                      <span>Test Card Simulated</span>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-200 text-blue-900 rounded-md">Visa / RuPay</span>
                    </div>
                    <div className="font-mono text-sm tracking-wider font-bold text-slate-800 pt-1">
                      4111 •••• •••• 1111
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Exp: 12/28</span>
                      <span>CVV: 123</span>
                    </div>
                  </div>
                )}

                {/* Tab 3: NetBanking */}
                {simulatingMethod === 'netbanking' && (
                  <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl text-xs space-y-2">
                    <p className="text-[11px] font-bold text-purple-950">Select Bank for Direct Debit</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((b, idx) => (
                        <div key={b} className={`p-2 rounded-lg border text-center font-bold text-[11px] cursor-pointer ${idx === 0 ? 'border-purple-600 bg-white text-purple-900 shadow-2xs' : 'border-purple-200 bg-purple-100/50 text-purple-800'}`}>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-[#5C554E] flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>RBI Licensed Payment Gateway Partner</span>
                </div>

                {/* Authorize Payment Button */}
                <button
                  type="button"
                  disabled={isSimulatingPayment}
                  onClick={handleSimulatedPaymentSuccess}
                  className="w-full py-3.5 px-4 bg-[#14213D] hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-98 cursor-pointer disabled:bg-neutral-500"
                >
                  {isSimulatingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing Bank Transaction...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#FF6B5B]" />
                      <span>Authorize & Pay {formatPrice(total)}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSimulatorData(null)}
                  className="w-full text-center text-xs text-[#5C554E] hover:text-black font-semibold pt-1 cursor-pointer"
                >
                  Cancel and Return
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
