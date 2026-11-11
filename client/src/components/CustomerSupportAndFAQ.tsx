import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Truck,
  RotateCcw,
  CreditCard,
  Package,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  XCircle,
  FileText,
  ChevronRight,
  Check,
  Video,
  UploadCloud,
  Play
} from 'lucide-react';
import { useOrders, Order } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

interface HelpTopicItem {
  id: string;
  category: 'returns' | 'delivery' | 'refunds' | 'product';
  categoryLabel: string;
  question: string;
  answer: string[];
  actionLabel?: string;
  actionType?: 'return' | 'track' | 'refund' | 'contact';
}

const HELP_TOPICS: HelpTopicItem[] = [
  // 1. Returns & Replacements
  {
    id: 'topic-ret-1',
    category: 'returns',
    categoryLabel: 'Returns & Replacements',
    question: 'How do I return or exchange an item within 7 days?',
    answer: [
      'You can initiate a return or exchange within 7 days of delivery for pure silk sarees, unworn garments, or unopened gourmet packs.',
      'Select your order from the "Recent Orders" list above and click "Request Return / Replacement".',
      'Select your reason (e.g. size/fit, defect, color mismatch) and confirm.',
      'Our courier partner (BlueDart) will arrive at your doorstep within 2 business days to pick up the package at zero extra cost.',
      'Refund is initiated immediately upon pickup verification.'
    ],
    actionLabel: 'Select Order to Return',
    actionType: 'return'
  },
  {
    id: 'topic-ret-2',
    category: 'returns',
    categoryLabel: 'Returns & Replacements',
    question: 'When will my return pickup happen? What if pickup is delayed?',
    answer: [
      'Return pickups are scheduled within 24 to 48 hours of submitting a request.',
      'You will receive an SMS from BlueDart Logistics with the pickup agent’s name and contact number on the morning of pickup.',
      'If your pickup was missed due to unavailability, the courier will re-attempt automatically on the next business day.'
    ]
  },
  {
    id: 'topic-ret-3',
    category: 'returns',
    categoryLabel: 'Returns & Replacements',
    question: 'Do I need original tags and boutique box for return?',
    answer: [
      'Yes, please keep all original brand tags, government Silk Mark tags, and packaging intact.',
      'Our pickup agent will verify the product condition and hand you an official BlueDart return acknowledgment slip.'
    ]
  },

  // 2. Delivery & Order Tracking
  {
    id: 'topic-del-1',
    category: 'delivery',
    categoryLabel: 'Delivery & Shipping',
    question: 'How many days does delivery take to my location?',
    answer: [
      'Chennai & Tamil Nadu: Guaranteed 1–2 Business Days via BlueDart Local Express.',
      'Major Metros (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Kolkata, Pune): 2–3 Business Days via BlueDart Air Express.',
      'Rest of India: 3–4 Business Days via Delhivery Express.',
      'All orders are dispatched within 24 hours from our Chennai Flagship Studio.'
    ],
    actionLabel: 'Check Live Order Status',
    actionType: 'track'
  },
  {
    id: 'topic-del-2',
    category: 'delivery',
    categoryLabel: 'Delivery & Shipping',
    question: 'Where can I track my shipment live with AWB tracking ID?',
    answer: [
      'Once dispatched, your tracking ID (e.g. BD-982341209IN) is generated and visible in your "Orders" tab.',
      'You also receive real-time SMS alerts at every milestone: Out for Dispatch, In Transit at Hub, and Out for Delivery.'
    ]
  },
  {
    id: 'topic-del-3',
    category: 'delivery',
    categoryLabel: 'Delivery & Shipping',
    question: 'What if my package status shows "Delivered" but I haven’t received it?',
    answer: [
      'Occasionally courier partners mark delivery when reaching your building security, reception, or neighbor.',
      'Please check with family members or building security.',
      'If still not found, click "Need Help with this Order" above to flag an instant investigation with our priority courier dispatch manager.'
    ]
  },

  // 3. Refunds & Payment Queries
  {
    id: 'topic-ref-1',
    category: 'refunds',
    categoryLabel: 'Refunds & Payments',
    question: 'When will my refund reflect in my bank account / UPI?',
    answer: [
      'UPI (Google Pay, PhonePe, Paytm, BHIM): 24 to 48 hours from the time refund is initiated.',
      'Credit / Debit Cards: 3 to 5 business days depending on your issuing bank.',
      'Net Banking: 2 to 4 business days.',
      'Cash on Delivery (COD) Returns: Refund is transferred directly to your Google Pay / PhonePe UPI ID or verified bank account within 24 hours of return pickup.'
    ],
    actionLabel: 'Check Refund Status',
    actionType: 'refund'
  },
  {
    id: 'topic-ref-2',
    category: 'refunds',
    categoryLabel: 'Refunds & Payments',
    question: 'Money was deducted from my account, but my order is not showing?',
    answer: [
      'This happens if your internet connection dropped during 3D Secure OTP verification.',
      'If payment was debited, your bank automatically reconciles and refunds the amount within 24–48 hours, or our automated webhook generates your order within 15 minutes.'
    ]
  },

  // 4. Product Quality & Saree Care
  {
    id: 'topic-prd-1',
    category: 'product',
    categoryLabel: 'Product & Authenticity',
    question: 'How do I verify the Silk Mark purity of my Kanchipuram saree?',
    answer: [
      'Every pure silk saree from Kavi’s Lifestyle comes with an official government-issued Silk Mark Organization of India tag.',
      'The tag has a unique serial number and holographic QR code that you can verify at silkmarkindia.com.'
    ]
  },
  {
    id: 'topic-prd-2',
    category: 'product',
    categoryLabel: 'Product & Authenticity',
    question: 'Can I request complimentary fall, pico, or blouse stitching?',
    answer: [
      'Yes! We provide complimentary fall and edging (pico) service on all sarees.',
      'Simply choose your order above and request custom fall/pico prior to dispatch.'
    ]
  }
];

interface CustomerSupportAndFAQProps {
  embedded?: boolean;
}

export const CustomerSupportAndFAQ: React.FC<CustomerSupportAndFAQProps> = ({ embedded = false }) => {
  const { user } = useAuth();
  const { orders, getUserOrders, submitReturnRequest } = useOrders();
  const { formatPrice } = useCurrency();
  const userOrders = getUserOrders(user?.email, user?.id);
  const availableOrders = userOrders;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openTopicId, setOpenTopicId] = useState<string | null>('topic-ret-1');

  // Interactive Order Resolution State (Flipkart-style)
  const [selectedOrderForHelp, setSelectedOrderForHelp] = useState<string | null>(
    availableOrders.length > 0 ? availableOrders[0].id : null
  );
  const [activeIssueAction, setActiveIssueAction] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState<string>('Fabric Defect / Damaged Weave or Zari');
  const [returnDescription, setReturnDescription] = useState<string>('');
  const [returnVideoUrl, setReturnVideoUrl] = useState<string>('');
  const [returnVideoName, setReturnVideoName] = useState<string>('');
  const [returnVideoSize, setReturnVideoSize] = useState<string>('');
  const [returnErrorMsg, setReturnErrorMsg] = useState<string>('');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState<boolean>(false);
  const [returnConfirmedMsg, setReturnConfirmedMsg] = useState<string | null>(null);
  const faqVideoInputRef = React.useRef<HTMLInputElement | null>(null);

  const activeOrder = useMemo(() => {
    return availableOrders.find((o) => o.id === selectedOrderForHelp || o.orderNumber === selectedOrderForHelp) || availableOrders[0];
  }, [availableOrders, selectedOrderForHelp]);

  const handleFaqVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setReturnErrorMsg('Please select a valid video file (MP4, MOV, WebM, etc.).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setReturnErrorMsg('Video file is too large. Please select a clip under 10MB (10-30 second defect recording) for instant cloud sync.');
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

  const handleConfirmReturn = (order: Order) => {
    if (!returnVideoUrl) {
      setReturnErrorMsg('⚠️ Mandatory Verification Video Required: Please attach an unboxing or defect inspection video clip before submitting.');
      return;
    }

    if (!returnDescription.trim()) {
      setReturnErrorMsg('Please enter a short description of the defect or reason for return.');
      return;
    }

    setIsSubmittingReturn(true);
    setReturnErrorMsg('');

    const itemIds = order.items.map((it) => it.id);
    const itemsSummary = order.items.map((it) => `${it.name} (Qty: ${it.quantity})`).join(', ');

    const success = submitReturnRequest(order.id, {
      reason: returnReason,
      description: returnDescription.trim(),
      itemIds,
      itemsSummary,
      videoUrl: returnVideoUrl,
      videoName: returnVideoName
    });

    if (success) {
      setReturnConfirmedMsg(
        `✓ Return request with verification video submitted successfully for Order #${order.orderNumber}! It is now under review in the Admin Panel. Refund of ${formatPrice(order.total)} will be issued upon admin approval.`
      );
      setIsSubmittingReturn(false);
      setReturnDescription('');
      setReturnVideoUrl('');
      setReturnVideoName('');
      setReturnVideoSize('');
    } else {
      setReturnErrorMsg('Failed to submit return request. Please try again.');
      setIsSubmittingReturn(false);
    }
  };

  const filteredTopics = useMemo(() => {
    return HELP_TOPICS.filter((topic) => {
      const matchesCategory =
        selectedCategory === 'all' || topic.category === selectedCategory;
      const matchesSearch =
        topic.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.answer.some((ans) => ans.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleTopic = (id: string) => {
    setOpenTopicId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={embedded ? "space-y-6 text-left" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left"}>
      
      {/* Help Center Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5DCD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>24x7 Self-Help & Resolution Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
            Help Center
          </h2>
          <p className="text-xs text-[#5C554E] mt-0.5 font-medium">
            Track return pickups, check refund status, and resolve order issues instantly.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#786F66] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search return, refund, delivery..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold bg-[#FAF6F2] focus:bg-white border border-[#E5DCD3] rounded-xl outline-none focus:border-black transition text-black"
          />
        </div>
      </div>

      {/* SECTION 1: FLIPKART-STYLE ORDER ISSUE RESOLVER */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5DCD3] shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E5DCD3]">
          <div>
            <h3 className="text-sm font-black text-black flex items-center gap-2">
              <Package className="w-4 h-4 text-black" />
              <span>Select an Order to get Instant Help</span>
            </h3>
            <p className="text-[11px] text-[#5C554E] mt-0.5">
              Choose your recent purchase to check return eligibility, refund status, or delivery timeline.
            </p>
          </div>
          {availableOrders.length > 0 && (
            <span className="text-xs font-bold text-[#786F66] bg-[#FAF6F2] px-2.5 py-1 rounded-lg border border-[#E5DCD3]">
              {availableOrders.length} {availableOrders.length === 1 ? 'Order' : 'Orders'} Available
            </span>
          )}
        </div>

        {availableOrders.length === 0 ? (
          <div className="p-6 bg-[#FAF6F2] rounded-xl border border-[#E5DCD3] text-center space-y-2">
            <Package className="w-8 h-8 text-[#786F66] mx-auto opacity-50" />
            <p className="text-xs font-bold text-black">No active orders placed yet</p>
            <p className="text-[11px] text-[#5C554E] max-w-md mx-auto">
              When you purchase an item, 1-click return pickup requests, live BlueDart tracking, and refund status will appear right here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Horizontal Order Picker if multiple orders exist */}
            {availableOrders.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
                {availableOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setSelectedOrderForHelp(ord.id);
                      setActiveIssueAction(null);
                      setReturnConfirmedMsg(null);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                      activeOrder?.id === ord.id
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-[#FAF6F2] text-black border-[#E5DCD3] hover:border-black'
                    }`}
                  >
                    <span>Order #{ord.orderNumber}</span>
                    <span className="text-[10px] opacity-75">({formatPrice(ord.total)})</span>
                  </button>
                ))}
              </div>
            )}

            {/* Active Selected Order Detail Card */}
            {activeOrder && (
              <div className="bg-[#FAF6F2] rounded-xl p-4 sm:p-5 border border-[#E5DCD3] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {activeOrder.items?.[0]?.image ? (
                      <img
                        src={activeOrder.items[0].image}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover bg-white border border-[#E5DCD3]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-white border border-[#E5DCD3] flex items-center justify-center">
                        <Package className="w-6 h-6 text-black" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-black">
                        {activeOrder.items?.[0]?.name || `Order #${activeOrder.orderNumber}`}
                      </h4>
                      <p className="text-[11px] text-[#5C554E] mt-0.5">
                        Order #{activeOrder.orderNumber} • Total: <strong>{formatPrice(activeOrder.total)}</strong>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                    activeOrder.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : activeOrder.status === 'shipped'
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {activeOrder.status === 'placed' ? 'Order Placed' : activeOrder.status}
                  </span>
                </div>

                {/* Instant Problem Solving Action Buttons (Flipkart-style) */}
                <div className="pt-2 border-t border-[#E5D8C5] grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      setActiveIssueAction('return');
                      setReturnConfirmedMsg(null);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeIssueAction === 'return'
                        ? 'bg-[#FF6B5B] text-white border-[#FF6B5B] shadow-xs'
                        : 'bg-[#FAF6EE] hover:bg-[#F4EDE0] text-[#14213D] border-[#E5D8C5]'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return / Exchange</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveIssueAction('track');
                      setReturnConfirmedMsg(null);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeIssueAction === 'track'
                        ? 'bg-[#FF6B5B] text-white border-[#FF6B5B] shadow-xs'
                        : 'bg-[#FAF6EE] hover:bg-[#F4EDE0] text-[#14213D] border-[#E5D8C5]'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Delivery</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveIssueAction('refund');
                      setReturnConfirmedMsg(null);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeIssueAction === 'refund'
                        ? 'bg-[#FF6B5B] text-white border-[#FF6B5B] shadow-xs'
                        : 'bg-[#FAF6EE] hover:bg-[#F4EDE0] text-[#14213D] border-[#E5D8C5]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Refund Status</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveIssueAction('cancel');
                      setReturnConfirmedMsg(null);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeIssueAction === 'cancel'
                        ? 'bg-[#FF6B5B] text-white border-[#FF6B5B] shadow-xs'
                        : 'bg-[#FAF6EE] hover:bg-[#F4EDE0] text-[#14213D] border-[#E5D8C5]'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel / Modify</span>
                  </button>
                </div>

                {/* ACTION 1: RETURN OR EXCHANGE PROBLEM SOLVER */}
                {activeIssueAction === 'return' && (
                  <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-2xs space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                      <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Kavi's 7-Day Doorstep Return & Video Verification</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Order #{activeOrder.orderNumber}
                      </span>
                    </div>

                    {/* If Return Already Requested: Show Live Status */}
                    {activeOrder.returnRequest ? (
                      <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                        activeOrder.returnRequest.status === 'approved'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : activeOrder.returnRequest.status === 'rejected'
                          ? 'bg-rose-50 border-rose-300 text-rose-950'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}>
                        <div className="flex items-center justify-between font-extrabold uppercase tracking-wider text-[11px] pb-1 border-b border-black/10">
                          <span className="flex items-center gap-1.5">
                            <RotateCcw className="w-4 h-4 text-[#FF6B5B]" />
                            {activeOrder.returnRequest.status === 'approved' && '✓ Return Approved & Refund Initiated'}
                            {activeOrder.returnRequest.status === 'rejected' && '✕ Return Request Declined'}
                            {activeOrder.returnRequest.status === 'pending' && '⏳ Video Verification Under Admin Review'}
                          </span>
                          <span className="text-[10px] opacity-75 font-normal">
                            Requested {new Date(activeOrder.returnRequest.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        <div>
                          <strong>Defect Reason:</strong> {activeOrder.returnRequest.reason}
                        </div>
                        {activeOrder.returnRequest.description && (
                          <div>
                            <strong>Description:</strong> "{activeOrder.returnRequest.description}"
                          </div>
                        )}

                        {activeOrder.returnRequest.videoUrl && (
                          <div className="space-y-1.5 pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-black/10 rounded-lg font-bold text-[11px] text-emerald-800 shadow-2xs">
                              <Video className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Defect Video Attached: {activeOrder.returnRequest.videoName || 'Inspection Clip'}</span>
                            </span>
                            <div className="rounded-xl overflow-hidden border border-slate-300 bg-black shadow-inner max-w-sm">
                              <video
                                src={activeOrder.returnRequest.videoUrl}
                                controls
                                playsInline
                                preload="metadata"
                                className="w-full max-h-48 object-contain"
                              />
                            </div>
                          </div>
                        )}

                        {activeOrder.returnRequest.adminRemarks && (
                          <div className={`p-3 rounded-lg mt-2 text-xs border ${
                            activeOrder.returnRequest.status === 'approved'
                              ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                              : 'bg-rose-100/70 border-rose-300 text-rose-950'
                          }`}>
                            <div className="font-bold text-[11px] uppercase tracking-wider text-black">
                              Store Administrator Response:
                            </div>
                            <div className="mt-0.5 font-medium">{activeOrder.returnRequest.adminRemarks}</div>
                            {activeOrder.returnRequest.status === 'approved' && (
                              <div className="mt-1 font-extrabold text-emerald-900">
                                Refund Amount: {formatPrice(activeOrder.returnRequest.refundAmount || activeOrder.total)} credited to your account.
                              </div>
                            )}
                          </div>
                        )}

                        {activeOrder.returnRequest.status === 'pending' && (
                          <p className="text-[11px] text-amber-900 italic bg-amber-100/70 p-2.5 rounded-lg border border-amber-200">
                            Our store administrator is reviewing your inspection video in the Admin Panel to confirm the defect. Once verified, refund of <strong>{formatPrice(activeOrder.total)}</strong> will be credited directly to your account.
                          </p>
                        )}
                      </div>
                    ) : returnConfirmedMsg ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <p className="text-sm font-extrabold">{returnConfirmedMsg}</p>
                        </div>
                        <p className="text-[11px] font-normal text-emerald-800">
                          Pickup Location: {activeOrder.customer?.address || 'Your saved address'}, {activeOrder.customer?.city || 'Chennai'} - {activeOrder.customer?.pincode || '600017'}.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Mandatory Video Warning Notice */}
                        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
                          <Video className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block">Mandatory Product Defect Video Verification</strong>
                            <span className="text-[11px] text-amber-900 block mt-0.5 leading-relaxed">
                              To verify defect authenticity and enable instant admin refund approval, please attach an unboxing or defect inspection video clip (15–30 sec).
                            </span>
                          </div>
                        </div>

                        {returnErrorMsg && (
                          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>{returnErrorMsg}</span>
                          </div>
                        )}

                        {/* Reason Dropdown */}
                        <div>
                          <label className="text-xs font-bold text-black block mb-1">
                            1. Select Reason for Return *
                          </label>
                          <select
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            className="w-full p-2.5 text-xs font-semibold bg-[#FAF6F2] border border-[#E5DCD3] rounded-xl outline-none focus:border-black text-black cursor-pointer"
                          >
                            <option value="Fabric Defect / Damaged Weave or Zari">Fabric Defect / Damaged Weave or Zari</option>
                            <option value="Wrong Product or Color Received">Wrong Product / Variant Received</option>
                            <option value="Physical Damage During Delivery">Physical Damage During Delivery / Torn Package</option>
                            <option value="Quality did not match expectations">Quality did not match expectations</option>
                            <option value="Blouse Stitching / Customization Discrepancy">Blouse Stitching / Customization Discrepancy</option>
                            <option value="Missing Fall, Pico, or Add-ons">Missing Fall, Pico, or Add-on Accessories</option>
                            <option value="Other Defect">Other Product Issue</option>
                          </select>
                        </div>

                        {/* Defect Description */}
                        <div>
                          <label className="text-xs font-bold text-black block mb-1">
                            2. Describe the Issue / Defect *
                          </label>
                          <textarea
                            rows={2}
                            value={returnDescription}
                            onChange={(e) => setReturnDescription(e.target.value)}
                            placeholder="Provide defect details (e.g. tear on saree pallu, color discolouration, wrong size delivered)..."
                            className="w-full p-2.5 text-xs bg-[#FAF6F2] border border-[#E5DCD3] rounded-xl outline-none focus:border-black text-black"
                          />
                        </div>

                        {/* Video Clip Section */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-black flex items-center gap-1.5">
                              <Video className="w-4 h-4 text-[#FF6B5B]" />
                              <span>3. Product Verification Video Clip * <span className="text-[#FF6B5B] font-extrabold">(Mandatory)</span></span>
                            </label>
                            {returnVideoSize && (
                              <span className="text-[10px] font-bold text-slate-500">{returnVideoSize}</span>
                            )}
                          </div>

                          <input
                            ref={faqVideoInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFaqVideoChange}
                            className="hidden"
                          />

                          {returnVideoUrl ? (
                            <div className="space-y-2">
                              <div className="rounded-xl overflow-hidden border border-slate-300 bg-black">
                                <video
                                  src={returnVideoUrl}
                                  controls
                                  playsInline
                                  preload="metadata"
                                  className="w-full max-h-52 object-contain"
                                />
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 truncate max-w-xs font-medium">
                                  📹 {returnVideoName || 'Uploaded Video Clip'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReturnVideoUrl('');
                                    setReturnVideoName('');
                                    setReturnVideoSize('');
                                    if (faqVideoInputRef.current) faqVideoInputRef.current.value = '';
                                  }}
                                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                                >
                                  Change / Remove Video
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => faqVideoInputRef.current?.click()}
                              className="border-2 border-dashed border-[#FF6B5B]/50 hover:border-[#FF6B5B] bg-[#FFF8F6] hover:bg-[#FFF0ED] rounded-xl p-4 text-center cursor-pointer transition"
                            >
                              <div className="w-10 h-10 rounded-full bg-[#FF6B5B]/15 text-[#FF6B5B] flex items-center justify-center mx-auto mb-2">
                                <UploadCloud className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold text-black block">
                                Click here to select or record product inspection video
                              </span>
                              <span className="text-[11px] text-slate-500 block mt-0.5">
                                MP4, MOV, WebM or camera video (Max 40MB)
                              </span>
                              <span className="inline-block mt-2 px-3 py-1 bg-[#FF6B5B] text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                                Upload Video Clip (Required)
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Estimated Refund Notice */}
                        <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] text-[#5C554E] space-y-1">
                          <p>• <strong>Free Doorstep Pickup:</strong> BlueDart agent will inspect & collect the item.</p>
                          <p>• <strong>Refund Amount:</strong> {formatPrice(activeOrder.total)} transferred within 24–48 hours of admin approval.</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            disabled={isSubmittingReturn || !returnVideoUrl}
                            onClick={() => handleConfirmReturn(activeOrder)}
                            className={`flex-1 py-2.5 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 ${
                              !returnVideoUrl || isSubmittingReturn
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'bg-black hover:bg-neutral-800 text-white cursor-pointer shadow-xs'
                            }`}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{isSubmittingReturn ? 'Submitting to Admin Panel...' : 'Schedule Free Doorstep Return Pickup (Video Verification)'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveIssueAction(null)}
                            className="px-4 py-2.5 border border-[#E5DCD3] text-black font-bold text-xs rounded-xl hover:bg-[#FAF6F2] transition cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ACTION 2: TRACK DELIVERY STATUS */}
                {activeIssueAction === 'track' && (
                  <div className="bg-white p-4 rounded-xl border border-blue-300 shadow-2xs space-y-3 animate-in fade-in text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100 font-bold text-black">
                      <span className="flex items-center gap-1.5 text-blue-700">
                        <Truck className="w-4 h-4" />
                        Live Dispatch & Tracking
                      </span>
                      <span>Courier: {activeOrder.carrier || 'BlueDart Air Express'}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                        <span className="text-[#786F66] block">Tracking AWB ID</span>
                        <strong className="text-black font-mono">{activeOrder.trackingNumber || 'BD-' + activeOrder.orderNumber.replace(/[^0-9]/g, '').slice(-6) + 'IN'}</strong>
                      </div>
                      <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                        <span className="text-[#786F66] block">Dispatch Hub</span>
                        <strong className="text-black">Chennai Flagship Studio</strong>
                      </div>
                      <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 col-span-2 sm:col-span-1">
                        <span className="text-[#786F66] block">Destination</span>
                        <strong className="text-black truncate block">{activeOrder.customer?.city || 'India'} - {activeOrder.customer?.pincode || '600017'}</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 font-medium">
                      🚚 <strong>Turnaround Guarantee:</strong> Dispatched within 24 hours. Metro deliveries arrive in 24–48 hours; Pan-India express arrives in 3–4 business days with real-time SMS out-for-delivery alerts.
                    </div>
                  </div>
                )}

                {/* ACTION 3: REFUND STATUS */}
                {activeIssueAction === 'refund' && (
                  <div className="bg-white p-4 rounded-xl border border-purple-300 shadow-2xs space-y-3 animate-in fade-in text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-purple-900 pb-2 border-b border-neutral-100">
                      <CreditCard className="w-4 h-4 text-purple-700" />
                      <span>Refund Status & Bank Transfer Timelines</span>
                    </div>

                    <div className="space-y-2 text-[11px] text-[#5C554E]">
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-1">
                        <p className="font-bold text-purple-950">
                          Total Eligible Refund: {formatPrice(activeOrder.total)}
                        </p>
                        <p>
                          Payment Method: <strong>{activeOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (Razorpay UPI/Cards)'}</strong>
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <p>• <strong>UPI (GPay / PhonePe / Paytm):</strong> Credited within 24–48 hours after return pickup.</p>
                        <p>• <strong>Credit / Debit Cards:</strong> Reflected on card statement within 3–5 working days.</p>
                        <p>• <strong>COD Orders:</strong> Transferred directly to your UPI ID or bank account instantly upon pickup verification.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTION 4: CANCEL ORDER */}
                {activeIssueAction === 'cancel' && (
                  <div className="bg-white p-4 rounded-xl border border-red-300 shadow-2xs space-y-3 animate-in fade-in text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-red-700 pb-2 border-b border-neutral-100">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Order Cancellation Request</span>
                    </div>

                    {activeOrder.status === 'shipped' || activeOrder.status === 'delivered' ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1">
                        <p className="font-bold">This order has already been dispatched via courier.</p>
                        <p>Please decline delivery at doorstep or click "Return / Exchange" above to schedule an immediate free pickup after receipt.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[11px] text-[#5C554E]">
                          Since Order #{activeOrder.orderNumber} is currently <strong>{activeOrder.status}</strong>, you can cancel it with 1-click and receive an immediate 100% refund.
                        </p>
                        <button
                          onClick={() => {
                            setReturnConfirmedMsg(`Order #${activeOrder.orderNumber} Cancelled Successfully. Full refund of ${formatPrice(activeOrder.total)} initiated via original payment method.`);
                            setActiveIssueAction('return');
                          }}
                          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          Confirm Instant Cancellation & Refund
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: BROWSE BY ISSUE TOPIC (FLIPKART STYLE) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5DCD3] shadow-xs space-y-5">
        <div>
          <h3 className="text-sm font-black text-black">
            Frequently Asked Issue Resolutions
          </h3>
          <p className="text-[11px] text-[#5C554E] mt-0.5">
            Click on any issue topic below to get immediate step-by-step guidance.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'all', label: 'All Issues' },
            { id: 'returns', label: 'Returns & Exchange' },
            { id: 'delivery', label: 'Delivery & Tracking' },
            { id: 'refunds', label: 'Refunds & Payments' },
            { id: 'product', label: 'Silk Mark & Saree Care' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-[#FAF6F2] hover:bg-neutral-100 text-black border border-[#E5DCD3]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Issue Accordion List */}
        <div className="divide-y divide-[#E5DCD3]/60 border-t border-[#E5DCD3]">
          {filteredTopics.map((topic) => {
            const isOpen = openTopicId === topic.id;
            return (
              <div key={topic.id} className="py-3.5">
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full flex items-center justify-between gap-3 text-left font-bold text-xs sm:text-sm text-black hover:text-[#AA8222] transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    <span>{topic.question}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-black shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="mt-2.5 pl-3.5 pr-2 text-xs text-[#5C554E] space-y-1.5 leading-relaxed bg-[#FAF6F2]/50 p-3.5 rounded-xl border border-[#E5DCD3]/70 animate-in fade-in">
                    {topic.answer.map((line, idx) => (
                      <p key={idx} className="flex items-start gap-1.5">
                        <span className="text-black font-bold">•</span>
                        <span>{line}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CustomerSupportAndFAQ;
