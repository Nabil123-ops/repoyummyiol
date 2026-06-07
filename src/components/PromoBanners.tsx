import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, AlertCircle, Percent } from 'lucide-react';
// @ts-ignore
import pinkBanner from '../assets/images/pink_clearance_sale_banner_1780817249124.png';
// @ts-ignore
import beigeBanner from '../assets/images/beige_face_care_banner_1780817267026.png';

interface PromoBannersProps {
  onSelectCategory: (categoryId: string) => void;
}

export default function PromoBanners({ onSelectCategory }: PromoBannersProps) {
  const handleBannerClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    // Smooth scroll to catalog anchor
    document.getElementById('catalog-start-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="space-y-6 animate-fade-in py-2 text-slate-800">
      
      {/* Dynamic Campaign Banner: Spend $50 Get Free Gift & Spend $100 Get Free Delivery */}
      <motion.div
        whileHover={{ y: -4 }}
        className="relative rounded-3xl overflow-hidden shadow-sm border border-pink-200 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        {/* Abstract luxury ambient decorations */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-pink-200/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-amber-100/40 rounded-full blur-2xl opacity-60" />
        
        <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 bg-pink-500 text-white font-mono text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3 h-3 fill-current" /> Official Lebanon Offer Month
          </span>
          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight leading-none">
            Shop Luxury, Receive Exquisite Rewards
          </h4>
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-light mt-1">
            Receive a <span className="font-bold text-pink-600">complimentary organic wellness gift</span> on purchases of $50 & above. Save more with <span className="font-bold text-pink-605 text-pink-600">free delivery across all of Lebanon</span> on orders of $100 & above!
          </p>
        </div>

        <div className="flex flex-row items-center gap-4 relative z-10 w-full md:w-auto justify-center">
          {/* Milestone 1 Mini-badge */}
          <div className="bg-white/95 backdrop-blur-xs border border-pink-100 rounded-2xl p-3 flex flex-col items-center text-center shadow-xs w-28 sm:w-34">
            <span className="text-xl">🎁</span>
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-pink-600 mt-1">Spend $50</span>
            <span className="text-xs font-serif font-bold text-slate-800 leading-tight">Free Gift</span>
          </div>

          {/* Milestone 2 Mini-badge */}
          <div className="bg-white/95 backdrop-blur-xs border border-pink-100 rounded-2xl p-3 flex flex-col items-center text-center shadow-xs w-28 sm:w-34">
            <span className="text-xl">🚚</span>
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-pink-600 mt-1">Spend $100</span>
            <span className="text-xs font-serif font-bold text-slate-800 leading-tight">Free Delivery</span>
          </div>
        </div>
      </motion.div>

      <div className="text-center md:text-left space-y-1">
        <span className="font-mono text-xs tracking-widest text-pink-500 font-bold uppercase block">Campaign Spotlights</span>
        <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-950">Featured Exclusive Offers</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Banner 1: Lips and Lashes Clearance Sale */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => handleBannerClick('lips-lashes')}
          className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-pink-100 cursor-pointer group bg-gradient-to-br from-pink-50 to-rose-100"
        >
          {/* Main Visual background banner */}
          <div className="relative aspect-[3/1] md:aspect-[3.5/1] overflow-hidden">
            <img
              src={pinkBanner}
              alt="Lips and Lashes Clearance Sale Offer"
              className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Visual smooth shadow vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-900/60 via-pink-900/20 to-transparent flex items-center p-6 sm:p-8" />
            
            {/* Superimposed responsive text and button copy */}
            <div className="absolute inset-0 flex flex-col justify-center text-left p-4 sm:p-6 lg:p-8 z-10 max-w-[65%]">
              <span className="inline-flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-widest font-mono text-pink-600 font-extrabold w-max shadow-sm mb-1">
                <Percent className="w-3 h-3 text-pink-500" /> Clearance Offer
              </span>
              <h4 className="text-white text-base sm:text-xl lg:text-2xl font-serif font-black tracking-tight leading-tight line-clamp-2">
                Lips & Lashes Clearance
              </h4>
              <p className="text-pink-100 text-[10px] sm:text-xs font-light line-clamp-1 mt-0.5">
                Up to 50% Off absolute beauty essentials
              </p>
              
              <div className="mt-2 text-[10px] sm:text-xs font-bold text-white flex items-center gap-1 group-hover:text-pink-200 transition-colors">
                <span>Shop Lipsticks & Serums</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Banner 2: Face Care Sephora Beauty Picks */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => handleBannerClick('face-care')}
          className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-pink-100 cursor-pointer group bg-gradient-to-br from-amber-50 to-amber-100/50"
        >
          {/* Main Visual background banner */}
          <div className="relative aspect-[3/1] md:aspect-[3.5/1] overflow-hidden">
            <img
              src={beigeBanner}
              alt="Face Care Sephora Beauty Picks"
              className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Visual smooth shadow vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 via-stone-900/20 to-transparent flex items-center p-6 sm:p-8" />

            {/* Superimposed responsive text and button copy */}
            <div className="absolute inset-0 flex flex-col justify-center text-left p-4 sm:p-6 lg:p-8 z-10 max-w-[65%]">
              <span className="inline-flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-widest font-mono text-amber-700 font-extrabold w-max shadow-sm mb-1">
                <Sparkles className="w-3 h-3 text-amber-550" /> Premium Picks
              </span>
              <h4 className="text-white text-base sm:text-xl lg:text-2xl font-serif font-black tracking-tight leading-tight line-clamp-2">
                Exclusive Face Care Selection
              </h4>
              <p className="text-stone-200 text-[10px] sm:text-xs font-light line-clamp-1 mt-0.5">
                Nourishing serums, oils & facial hydrators
              </p>

              <div className="mt-2 text-[10px] sm:text-xs font-bold text-white flex items-center gap-1 group-hover:text-amber-200 transition-colors">
                <span>Explore Facial Care Picks</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
