import React from 'react';
import { AnnouncementBar } from '../../components/AnnouncementBar';
import { Navbar } from '../../components/Navbar';
import { TopStoreUpdateBanner } from '../../components/TopStoreUpdateBanner';
import { Hero } from '../../components/Hero';
import { DepartmentCards } from '../../components/DepartmentCards';
import { FeaturedProducts } from '../../components/FeaturedProducts';
import { TestimonialsSection } from '../../components/TestimonialsSection';
import { SocialGalleryAndNewsletter } from '../../components/SocialGalleryAndNewsletter';
import { StoreLocatorAndAboutUs } from '../../components/StoreLocatorAndAboutUs';
import { CustomerSupportAndFAQ } from '../../components/CustomerSupportAndFAQ';
import { Footer } from '../../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFEB] pb-16 md:pb-0">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation with Delivery Location */}
      <Navbar />

      {/* Top Store Update & Festive Promotional Banner Carousel */}
      <TopStoreUpdateBanner />

      {/* Hero Section with 3D Emblem Showcase */}
      <main className="flex-1">
        <Hero />

        {/* 4 Brand Departments Showcase */}
        <DepartmentCards />

        {/* Featured Products with Department Tabs */}
        <FeaturedProducts />

        {/* Real Customer Stories & Reviews */}
        <TestimonialsSection />

        {/* Social Instagram Lookbook */}
        <SocialGalleryAndNewsletter />

        {/* Flagship Store Locator & Brand Heritage (About Us) */}
        <StoreLocatorAndAboutUs />

        {/* Customer Support & Frequently Asked Questions (FAQ) */}
        <CustomerSupportAndFAQ />
      </main>

      {/* Complete Footer */}
      <Footer />
    </div>
  );
}
