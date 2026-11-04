import React, { useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { StoreLocatorAndAboutUs } from '../../components/StoreLocatorAndAboutUs';
import { Footer } from '../../components/Footer';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFEB] pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <StoreLocatorAndAboutUs />
      </main>
      <Footer />
    </div>
  );
}
