import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, MapPin, Plus, Check, Truck, Clock, Box, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnnouncementBar } from '../../components/AnnouncementBar';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useLocation } from '../../context/LocationContext';
import { ShippingAddress } from '../../types';
import { validateEmail, validatePhone, sanitizeEmailInput, sanitizePhoneInput } from '../../utils/validation';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, discount, shippingCharge, total, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { user, addresses, addAddress, updateProfile } = useAuth();
  const { placeOrder } = useOrders();
  const { location } = useLocation();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [saveToAccount, setSaveToAccount] = useState<boolean>(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: location.isSet ? location.city : '',
    state: location.isSet ? location.state : '',
    pincode: location.isSet ? location.pincode : '',
    country: 'India',
    paymentMethod: 'razorpay'
  });

  // Automatically pre-fill contact and shipping details from active account, saved addresses & delivery location
  useEffect(() => {
    if (user) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setFormData({
          fullName: defaultAddr.fullName || user.fullName || '',
          email: user.email || '',
          phone: defaultAddr.phone || user.phone || '',
          address: defaultAddr.street || '',
          city: defaultAddr.city || (location.isSet ? location.city : ''),
          state: defaultAddr.state || (location.isSet ? location.state : ''),
          pincode: defaultAddr.postalCode || (location.isSet ? location.pincode : ''),
          country: defaultAddr.country || 'India',
          paymentMethod: 'razorpay'
        });
      } else {
        setSelectedAddressId('new');
        setFormData(prev => ({
          ...prev,
          fullName: user.fullName || prev.fullName,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
          city: location.isSet ? location.city : prev.city,
          state: location.isSet ? location.state : prev.state,
          pincode: location.isSet ? location.pincode : prev.pincode,
        }));
      }
    } else if (location.isSet) {
      setFormData(prev => ({
        ...prev,
        city: prev.city || location.city,
        state: prev.state || location.state,
        pincode: prev.pincode || location.pincode,
      }));
    }
  }, [user?.email, addresses, location]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

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
      city: location.isSet ? location.city : '',
      state: location.isSet ? location.state : '',
      pincode: location.isSet ? location.pincode : '',
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

    const orderItems = cart.map(item => ({
      id: item.id,
      name: item.product.name,
      image: item.product.images[0],
      variant: item.selectedVariant?.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    }));

    const createdOrder = placeOrder({
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
      paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay Secure (UPI / Cards)'
    });

    setPlacedOrderId(createdOrder.orderNumber);

    setTimeout(() => {
      setIsProcessing(false);
      setIsOrderPlaced(true);
      clearCart();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1000);
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

            {/* Delivery Turnaround Highlight Card */}
            <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-5 text-left space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                      Guaranteed Delivery Timeline
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-emerald-950">
                      Delivering in {deliveryInfo.daysRange}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#5C554E] block">Expected Arrival:</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-900 block">
                    {expectedDate}
                  </span>
                </div>
              </div>

              {/* 4-Step Milestone Progress Bar */}
              <div className="pt-1">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-emerald-600 rounded-full shadow-2xs" />
                    <span className="text-[10px] font-bold text-black block">Day 1</span>
                    <span className="text-[9px] text-[#5C554E] block leading-tight">Order Placed</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-emerald-600 rounded-full shadow-2xs" />
                    <span className="text-[10px] font-bold text-black block">Day 1–2</span>
                    <span className="text-[9px] text-[#5C554E] block leading-tight">Boutique Packed</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-bold text-black block">Day 2–3</span>
                    <span className="text-[9px] text-[#5C554E] block leading-tight">Air Dispatch</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-emerald-300 rounded-full" />
                    <span className="text-[10px] font-bold text-black block">{deliveryInfo.daysRange}</span>
                    <span className="text-[9px] text-emerald-900 font-bold block leading-tight">Doorstep Delivery</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-emerald-900 font-medium flex items-center justify-between flex-wrap gap-2">
                <span>Courier: <strong>{deliveryInfo.courier}</strong> (Airway Bill Generated)</span>
                <span>Dispatch Hub: <strong>Chennai Flagship Studio</strong></span>
              </div>
            </div>

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
                className="flex-1 py-3.5 bg-black text-white font-bold text-xs rounded-xl hover:bg-[#2A2A2A] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track in Order Status</span>
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="flex-1 py-3.5 border border-[#E5DCD3] text-black font-bold text-xs rounded-xl hover:bg-[#FAF6F2] transition cursor-pointer"
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
    <div className="min-h-screen flex flex-col bg-[#F5EFEB] text-black">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-left">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C554E] hover:text-black mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#5C554E] mt-1 font-medium">
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
                    <label className="text-xs font-bold text-black block mb-1">Email Address (must end in @gmail.com) *</label>
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

                {location.isSet && selectedAddressId === 'new' && (
                  <div className="p-3 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-black shrink-0" />
                      <span className="text-[#5C554E]">
                        Delivering to: <strong className="text-black">{location.city} - {location.pincode}</strong> (Auto-filled from your delivery location)
                      </span>
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

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-black hover:bg-[#2A2A2A] disabled:bg-gray-400 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-98 transition"
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
      </main>

      <Footer />
    </div>
  );
}
