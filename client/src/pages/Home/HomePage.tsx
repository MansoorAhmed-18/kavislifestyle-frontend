import React from 'react';
import { AnnouncementBar } from '../../components/AnnouncementBar';
import { Navbar } from '../../components/Navbar';
import { TopStoreUpdateBanner } from '../../components/TopStoreUpdateBanner';
import { DepartmentCards } from '../../components/DepartmentCards';
import { FeaturedProducts } from '../../components/FeaturedProducts';
import { TestimonialsSection } from '../../components/TestimonialsSection';
import { StoreLocatorAndAboutUs } from '../../components/StoreLocatorAndAboutUs';
import { Footer } from '../../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4EDE0] stripe-cream pb-16 md:pb-0">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation */}
      <Navbar />

      {/* Top Store Update & Festive Promotional Banner Carousel */}
      <TopStoreUpdateBanner />

      <main className="flex-1">
        {/* 4 Brand Departments Showcase */}
        <DepartmentCards />

        {/* Featured Products with Department Tabs */}
        <FeaturedProducts />

        {/* Real Customer Stories & Reviews */}
        <TestimonialsSection />

        {/* Flagship Store Locator & Brand Heritage (About Us) */}
        <StoreLocatorAndAboutUs />
      </main>

      {/* Complete Footer */}
      <Footer />
    </div>
  );
}
