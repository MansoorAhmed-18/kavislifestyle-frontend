import React, { useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { CustomerSupportAndFAQ } from '../../components/CustomerSupportAndFAQ';
import { Footer } from '../../components/Footer';

export default function SupportPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFEB] pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <CustomerSupportAndFAQ />
      </main>
      <Footer />
    </div>
  );
}

