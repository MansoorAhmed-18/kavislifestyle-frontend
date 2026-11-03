import React, { useState } from 'react';
import { Camera, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { validateEmail, sanitizeEmailInput } from '../utils/validation';

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
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      alert(emailCheck.message || 'Please enter a lowercase email ending with @gmail.com');
      return;
    }
    setIsSubscribed(true);
  };

  return (
    <section className="bg-[#F5EFEB] py-16 sm:py-20 border-b border-[#E5DCD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
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

        {/* Newsletter Subscription Box */}
        <div className="bg-black rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-md border border-black">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Exclusive Member Privileges</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Join Kavi's Lifestyle Insider
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#E5DCD3]">
              Receive private notifications for new saree weaves, fresh harvest releases, and member-only discounts.
            </p>

            {isSubscribed ? (
              <div className="mt-6 flex items-center justify-center gap-2 p-3 bg-white text-black rounded-xl text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>You are subscribed! Your welcome coupon has been delivered to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))}
                  className="flex-1 px-4 py-3 text-xs bg-white text-black font-medium rounded-xl outline-none focus:ring-2 focus:ring-white lowercase"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white hover:bg-[#FAF6F2] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-xs flex-shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <p className="mt-3 text-[11px] text-[#E5DCD3]">
              Zero spam. Unsubscribe with a single click at any time.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
