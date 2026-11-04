import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'shipping' | 'sarees' | 'gourmet' | 'payments';
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'shipping',
    categoryLabel: 'Orders & Shipping',
    question: 'How long does delivery take to my PIN code?',
    answer:
      'We dispatch all confirmed orders within 24 hours. Metro cities (Chennai, Bengaluru, Mumbai, Delhi, Hyderabad) typically receive delivery in 24 to 48 hours. For the rest of India, standard delivery takes 2 to 4 business days via Bluedart and Delhivery with real-time SMS tracking updates.',
  },
  {
    id: 'faq-2',
    category: 'shipping',
    categoryLabel: 'Orders & Shipping',
    question: 'How can I track my order status?',
    answer:
      'As soon as your order is dispatched, you will receive an SMS and email with your airway bill (AWB) tracking link. You can also view live delivery progress anytime by visiting the "Customer Support" or "My Account > Orders" section on our storefront.',
  },
  {
    id: 'faq-3',
    category: 'sarees',
    categoryLabel: 'Sarees & Authenticity',
    question: 'Are Kavi’s silk sarees certified by Silk Mark India?',
    answer:
      'Yes, 100%! Every pure silk saree in our collection carries the authorized government Silk Mark Organization of India tag with a unique serial barcode that you can scan and verify directly on the official Silk Mark portal.',
  },
  {
    id: 'faq-4',
    category: 'sarees',
    categoryLabel: 'Sarees & Authenticity',
    question: 'Can I request complimentary fall, pico, or custom blouse stitching?',
    answer:
      'Yes! We provide complimentary fall and edging (pico) service on all sarees upon request. After completing your order, simply message our boutique WhatsApp care team (+91 98400 12345) with your Order ID, and our in-house master tailors will prepare your saree prior to dispatch.',
  },
  {
    id: 'faq-5',
    category: 'gourmet',
    categoryLabel: 'Gourmet & Fragrances',
    question: 'How do you guarantee freshness and shelf-life for dry fruits and nuts?',
    answer:
      'Our nuts and dried fruits are harvested freshly from certified orchards in Kashmir and California, triple-sorted for size, and nitrogen-flushed in food-grade airtight pouches with oxygen absorbers. This preserves crunch, essential oils, and natural sweetness for up to 9 months.',
  },
  {
    id: 'faq-6',
    category: 'gourmet',
    categoryLabel: 'Gourmet & Fragrances',
    question: 'Are your traditional Kannauj attars 100% alcohol-free?',
    answer:
      'Yes. Our attars are extracted using ancient Deg-Bhapka hydro-distillation in copper stills in Kannauj, Uttar Pradesh. They are 100% pure botanical concentrates aged on pure sandalwood or organic carrier bases, free from alcohol, synthetic stabilizers, and harsh chemicals.',
  },
  {
    id: 'faq-7',
    category: 'payments',
    categoryLabel: 'Payments & Returns',
    question: 'What payment methods do you support? Is online payment secure?',
    answer:
      'We accept all major Indian and international payment methods through 256-bit SSL encrypted Razorpay checkout: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit cards (Visa, MasterCard, RuPay), and Net Banking across 50+ banks.',
  },
  {
    id: 'faq-8',
    category: 'payments',
    categoryLabel: 'Payments & Returns',
    question: 'What is your return and exchange policy?',
    answer:
      'We provide a straightforward 7-day return and exchange policy. If an item arrives damaged, defective, or does not meet your expectations, we will arrange a doorstep courier pickup at zero cost to you and process a replacement or full refund to your original payment method.',
  },
];

export const CustomerSupportAndFAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="customer-support-faq"
      className="bg-[#F5EFEB] py-14 sm:py-20 border-b border-[#E5DCD3] text-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#FFE169]" />
            <span>Customer Care & Help Center</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
            Customer Support & Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5C554E]">
            Have a question about pan-India shipping, Silk Mark purity, or your order? We’re always here to assist.
          </p>
        </div>

        {/* Quick Contact Support Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <a
            href="https://wa.me/919840012345?text=Hello%20Kavi's%20Lifestyle%20Support,%20I%20need%20help%20with%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white rounded-2xl border border-[#E5DCD3] shadow-2xs hover:shadow-md transition group flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-black uppercase tracking-wider">
                WhatsApp Live Help
              </h4>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">+91 98400 12345</p>
              <p className="text-[11px] text-[#5C554E] mt-0.5">Instant chat for saree videos & sizing</p>
            </div>
          </a>

          <a
            href="tel:+919840012345"
            className="p-5 bg-white rounded-2xl border border-[#E5DCD3] shadow-2xs hover:shadow-md transition group flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F2] text-black border border-[#E5DCD3] flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-black uppercase tracking-wider">
                Phone Support
              </h4>
              <p className="text-xs font-bold text-black mt-0.5">+91 98400 12345</p>
              <p className="text-[11px] text-[#5C554E] mt-0.5">Mon–Sat, 10 AM – 7 PM IST</p>
            </div>
          </a>

          <a
            href="mailto:care@kavislifestyle.com"
            className="p-5 bg-white rounded-2xl border border-[#E5DCD3] shadow-2xs hover:shadow-md transition group flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F2] text-black border border-[#E5DCD3] flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-black uppercase tracking-wider">
                Email Desk
              </h4>
              <p className="text-xs font-bold text-black mt-0.5">care@kavislifestyle.com</p>
              <p className="text-[11px] text-[#5C554E] mt-0.5">Replies within 2 to 4 hours</p>
            </div>
          </a>

          <div className="p-5 bg-white rounded-2xl border border-[#E5DCD3] shadow-2xs hover:shadow-md transition group flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F2] text-black border border-[#E5DCD3] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-black uppercase tracking-wider">
                Pan-India Express
              </h4>
              <p className="text-xs font-bold text-black mt-0.5">19,000+ PIN Codes</p>
              <p className="text-[11px] text-[#5C554E] mt-0.5">Bluedart & Delhivery with SMS tracking</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E5DCD3] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#5C554E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs (e.g. delivery time, silk mark, returns, zari)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F2] text-xs font-medium border border-[#E5DCD3] rounded-xl outline-none focus:border-black"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all', label: 'All FAQs' },
                { id: 'shipping', label: 'Shipping & Delivery' },
                { id: 'sarees', label: 'Sarees & Purity' },
                { id: 'gourmet', label: 'Gourmet & Attars' },
                { id: 'payments', label: 'Payments & Returns' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-black text-white shadow-2xs'
                      : 'bg-[#FAF6F2] text-[#5C554E] hover:bg-[#EFE8E0] hover:text-black border border-[#E5DCD3]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-2.5 pt-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? 'bg-[#FAF6F2] border-black shadow-2xs'
                        : 'bg-white border-[#E5DCD3] hover:border-neutral-400'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="text-xs sm:text-sm font-bold text-black flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-black shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-[#5C554E] leading-relaxed border-t border-[#E5DCD3]/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#5C554E]">
                No answers found matching "{searchQuery}". Contact our team directly on WhatsApp (+91 98400 12345).
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CustomerSupportAndFAQ;

