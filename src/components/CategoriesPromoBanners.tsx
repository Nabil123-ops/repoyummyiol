import React from 'react';
import { Sparkles, Gift, Heart, ArrowRight } from 'lucide-react';

interface CategoriesPromoBannersProps {
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoriesPromoBanners({ onSelectCategory }: CategoriesPromoBannersProps) {
  const promos = [
    {
      id: 1,
      title: "100% Organic & Local",
      badge: "Pure Nature",
      description: "Carefully sourced native Lebanese olive oil blends, rosemary extracts & facial mists.",
      bg: "bg-gradient-to-br from-white to-salmon-50",
      border: "border-salmon-100",
      icon: <Heart className="w-5 h-5 text-salmon-500 fill-salmon-50" />,
      actionId: "face-care",
      actionText: "Shop Organic Care"
    },
    {
      id: 2,
      title: "Handpicked Sephora Picks",
      badge: "World Class",
      description: "Direct premium imports. Hydrating lotions and lip serums loved by millions globally.",
      bg: "bg-white",
      border: "border-salmon-200",
      icon: <Sparkles className="w-5 h-5 text-salmon-500" />,
      actionId: "lips-lashes",
      actionText: "Browse Imports"
    },
    {
      id: 3,
      title: "Luxury Gift Wrapping",
      badge: "Delivered With Love",
      description: "Handcrafted parcels beautifully wrapped in custom paper. Perfect for showing gratitude.",
      bg: "bg-gradient-to-br from-salmon-50/20 to-white",
      border: "border-salmon-100",
      icon: <Gift className="w-5 h-5 text-salmon-500" />,
      actionId: "hair-care",
      actionText: "Send as Gift"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-8 border-b border-salmon-100/60 text-slate-800">
      {promos.map((promo) => (
        <div
          key={promo.id}
          className={`group relative p-6 rounded-3xl border ${promo.border} ${promo.bg} transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-left flex flex-col justify-between`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-salmon-600 bg-salmon-100/50 px-2.5 py-1 rounded-full">
                {promo.badge}
              </span>
              <div className="p-2 rounded-xl bg-white border border-salmon-100 shadow-3xs">
                {promo.icon}
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-base font-serif font-black text-slate-900 tracking-tight">
                {promo.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                {promo.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectCategory(promo.actionId);
              document.getElementById('catalog-start-anchor')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-5 w-max flex items-center gap-1 text-xs font-bold text-salmon-600 hover:text-salmon-800 cursor-pointer select-none"
          >
            <span>{promo.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ))}
    </div>
  );
}
