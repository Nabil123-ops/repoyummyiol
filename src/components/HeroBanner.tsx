import React, { useState, useEffect } from 'react';
import { Timer, Heart, ShoppingBag, ArrowRight, ShieldCheck, Award, Zap } from 'lucide-react';

interface HeroBannerProps {
  onShopFlashSale: () => void;
  isFlashSaleActive: boolean;
}

export default function HeroBanner({ onShopFlashSale, isFlashSaleActive }: HeroBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 2, // 5 days, 6 mins, 60 seconds translates to approx hours depending on conversion, but let's calculate exact remaining time
    minutes: 6,
    seconds: 0
  });

  useEffect(() => {
    // Persistent target end time calculation
    const TARGET_KEY = 'yummy_flash_sale_target_time';
    let storedTarget = localStorage.getItem(TARGET_KEY);

    if (!storedTarget) {
      const now = new Date();
      // User request: "countdown like 5 days and 6 minutes and 60 second"
      const target = new Date(now.getTime());
      target.setDate(target.getDate() + 5);
      target.setMinutes(target.getMinutes() + 6);
      target.setSeconds(target.getSeconds() + 60);
      storedTarget = target.toISOString();
      localStorage.setItem(TARGET_KEY, storedTarget);
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = new Date(storedTarget!).getTime() - now;

      if (difference <= 0) {
        // Reset countdown to a new 5-day cycle if expirations occur to keep the sale active
        const newTarget = new Date();
        newTarget.setDate(newTarget.getDate() + 5);
        newTarget.setMinutes(newTarget.getMinutes() + 6);
        newTarget.setSeconds(newTarget.getSeconds() + 60);
        localStorage.setItem(TARGET_KEY, newTarget.toISOString());
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="hero-banner" className="relative bg-white overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-pink-100 shadow-xs">
      
      {/* Visual background gradient blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Main Copywriting block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 border border-pink-100 rounded-full">
              <Zap className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
                Exclusive Flash Promo Active
              </span>
            </div>
 
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-slate-900">
              Savor Gourmet <br />
              <span className="bg-gradient-to-r from-pink-600 via-pink-400 to-rose-600 bg-clip-text text-transparent">
                Yummy Delights
              </span> <br />
              In Every Single Bite.
            </h1>
 
            <p className="text-slate-650 text-base sm:text-lg max-w-2xl font-light">
              We sync and import fresh batches of delicious artisanal sweets, international candies, 
              crispy hand-crafted chips, and premium wellness drinks from top-tier confectioneries directly to Lebanon.
            </p>
 
            {/* Flash Sale Discount Badge & Timer section */}
            <div className="p-5 sm:p-6 bg-pink-50/60 border border-pink-100 rounded-2xl shadow-sm space-y-4 max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="block text-[11px] uppercase tracking-widest font-mono text-pink-600 font-bold">
                    Special Flash Sale Offer
                  </span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    Up to <span className="text-pink-600">60% OFF</span> Store-wide
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs bg-pink-600 px-3 py-1.5 rounded-lg text-white font-bold tracking-wider uppercase">
                  Limited Offer
                </div>
              </div>
 
              {/* Grid Countdown Clock */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 sm:p-3 rounded-xl border border-pink-150 shadow-xs">
                  <span className="block text-2xl sm:text-3xl font-black text-pink-600 font-mono">{timeLeft.days}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Days</span>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-xl border border-pink-150 shadow-xs">
                  <span className="block text-2xl sm:text-3xl font-black text-pink-600 font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Hours</span>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-xl border border-pink-150 shadow-xs">
                  <span className="block text-2xl sm:text-3xl font-black text-pink-600 font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Minutes</span>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-xl border border-pink-150 shadow-xs">
                  <span className="block text-2xl sm:text-3xl font-black text-rose-500 font-mono animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-rose-450 font-bold">Seconds</span>
                </div>
              </div>
            </div>
 
            {/* Action Shop Now button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="shop-now-btn"
                onClick={onShopFlashSale}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                <span>Shop Now (60% Off Specials)</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex gap-4 items-center text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-pink-500" />
                  <span>Lebanon COD Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-pink-500" />
                  <span>100% Authentic Imports</span>
                </div>
              </div>
            </div>
 
          </div>
 
          {/* Right Showcase image */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-sm">
              {/* Gold rotating halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl blur opacity-30 animate-pulse"></div>
              
              <div className="relative bg-white rounded-2xl p-4 border border-pink-100 shadow-md animate-scale-up">
                <img
                  src="https://images.unsplash.com/photo-1548907040-4d42b5212510?q=80&w=600&auto=format&fit=crop"
                  alt="Delicious snacks collection"
                  className="w-full h-80 object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating promo card */}
                <div className="absolute bottom-8 -right-6 bg-white border border-pink-100 rounded-xl p-3 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="text-left select-none">
                    <span className="block text-[9px] uppercase tracking-wide font-mono text-slate-400">Yummy Bakeries</span>
                    <span className="font-bold text-xs text-slate-800">Baklava & Sweets Synced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}
