import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, FileText } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function PolicyPage() {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Store Policies';
  let icon = FileText;
  let content: React.ReactNode = null;

  if (path.includes('shipping')) {
    title = 'Shipping & Delivery Policy';
    icon = Truck;
    content = (
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-slate-800">1. Domestic Delivery (Pan-India)</h3>
        <p>
          We provide reliable express doorstep delivery to all serviceable pincodes across India via partner couriers including Delivery, BlueDart, and India Post.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Free Shipping:</strong> On all orders totaling ₹999 or above.</li>
          <li><strong>Standard Shipping:</strong> A flat fee of ₹99 applies to orders below ₹999.</li>
          <li><strong>Dispatch Time:</strong> Orders are processed and dispatched within 24 to 48 working hours.</li>
          <li><strong>Estimated Delivery:</strong> 3 to 5 business days for metro cities, 5 to 7 days for regional destinations.</li>
        </ul>

        <h3 className="text-base font-bold text-slate-800 pt-2">2. International Shipping</h3>
        <p>
          Kavi's Lifestyle proudly delivers to international patrons across the United States, United Arab Emirates, United Kingdom, Singapore, and Canada. International shipping rates are calculated at checkout based on weight and destination zone.
        </p>
      </div>
    );
  } else if (path.includes('returns')) {
    title = 'Returns & Exchange Policy';
    icon = RefreshCw;
    content = (
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-slate-800">7-Day Easy Return & Exchange Window</h3>
        <p>
          At Kavi's Lifestyle, customer satisfaction is our top priority. If you receive a damaged, defective, or incorrect product, you may initiate a return or exchange within 7 days of delivery.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Women's Fashion:</strong> Sarees and garments must be unused, unwashed, and in their original packaging with all tags and blouse pieces intact.</li>
          <li><strong>Dry Fruits & Nuts:</strong> Consumable food products are eligible for replacement if the packaging was tampered or damaged in transit.</li>
          <li><strong>Perfumes & Cosmetics:</strong> Must remain sealed in their original cellophane packaging for hygiene reasons.</li>
        </ul>
        <p className="pt-2">
          To initiate a return, email us at <strong className="text-[#114B5F]">care@kavislifestyle.com</strong> with your Order ID and photo proof.
        </p>
      </div>
    );
  } else if (path.includes('privacy')) {
    title = 'Privacy Policy';
    icon = ShieldCheck;
    content = (
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-slate-800">Your Privacy is Protected</h3>
        <p>
          Kavi's Lifestyle values the trust you place in us. We adhere to stringent standards for customer data privacy and secure transaction processing.
        </p>
        <p>
          We never sell, rent, or trade your personal information to third parties. All online payment data is encrypted and processed directly by our RBI-licensed payment gateway partner, <strong>Razorpay</strong>, using 256-bit SSL encryption.
        </p>
      </div>
    );
  } else {
    title = 'Terms & Conditions';
    icon = FileText;
    content = (
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-bold text-slate-800">Website Terms of Service</h3>
        <p>
          Welcome to Kavi's Lifestyle. By browsing and shopping on this platform, you agree to comply with and be bound by the terms, conditions, and store guidelines set forth herein.
        </p>
        <p>
          All content, photographs, product descriptions, and brand logos are the intellectual property of Kavi's Lifestyle and Kavi Boutique.
        </p>
      </div>
    );
  }

  const IconComponent = icon;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFEB] text-black">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 text-left">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DCD3] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#E5DCD3]">
            <div className="p-3 bg-black text-white rounded-xl">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black">{title}</h1>
              <p className="text-xs text-[#5C554E]">Effective Date: January 2026</p>
            </div>
          </div>
          {content}
        </div>
      </main>
      <Footer />
    </div>
  );
}
