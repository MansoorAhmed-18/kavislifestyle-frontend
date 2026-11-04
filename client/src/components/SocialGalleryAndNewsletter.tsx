import React from 'react';
import { Camera } from 'lucide-react';

const INSTA_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    title: 'Bridal silks woven with pure heritage',
    handle: '@kavislifestyle'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    title: 'Gourmet harvest from Kashmir & California',
    handle: '@kavislifestyle'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    title: 'Pure Kannauj rose and Cambodian oudh',
    handle: '@kavislifestyle'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    title: 'Authentic Kumkumadi Ayurvedic radiance',
    handle: '@kavislifestyle'
  }
];

export const SocialGalleryAndNewsletter: React.FC = () => {
  return (
    <section className="bg-[#F5EFEB] py-14 sm:py-16 border-b border-[#E5DCD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black">
            <Camera className="w-4 h-4" />
            <span>#KavisLifestyle</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black mt-1 tracking-tight">
            Customer Lookbook
          </h2>
          <p className="text-xs sm:text-sm text-[#5C554E] mt-1">
            Real moments from our patrons across fashion, gourmet, and beauty.
          </p>
        </div>

        {/* 4-Column Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTA_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-xs cursor-pointer bg-[#FAF6F2] border border-[#E5DCD3]"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-center text-white backdrop-blur-xs">
                <Camera className="w-6 h-6 text-white mb-1.5" />
                <p className="text-xs font-bold line-clamp-2">{post.title}</p>
                <span className="text-[11px] text-[#E5DCD3] mt-1 font-mono">{post.handle}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
