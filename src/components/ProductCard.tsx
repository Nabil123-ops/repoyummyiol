import React from 'react';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product) => void;
  cartQuantity: number;
}

// Encapsulated text cleaner to prevent ???? on compromised database entries
const cleanText = (val: string | undefined | null): string => {
  if (!val) return "";
  if (val.includes("??") || val.includes("؟؟") || /^[?\s\d]+$/.test(val)) {
    return "Luxury natural cosmetics designed to deeply hydrate, nourish, and protect your skin with beautiful long lasting elegance.";
  }
  return val;
};

export default function ProductCard({ product, onAddToCart, cartQuantity }: ProductCardProps) {
  // Compute percentage discount if available
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  return (
    <div 
      key={product.id}
      id={`product-card-${product.id}`}
      onClick={() => {
        window.history.pushState(null, '', `/p/${product.slug}`);
        window.dispatchEvent(new Event('popstate'));
      }}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-black transition-all duration-300 flex flex-col hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Image and Badge container */}
      <div className="relative pt-[80%] bg-slate-50 overflow-hidden">
        <img
          src={product.image_url || "https://images.unsplash.com/photo-1548907040-4d42b5212510?q=80&w=600&auto=format&fit=crop"}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback image if unsplash link breaks
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599490659213-e2b9527ec087?q=80&w=600&auto=format&fit=crop";
          }}
        />

        {/* Discount Indicator badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-black text-white font-mono font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
            -{discountPercentage}%
          </div>
        )}

        {/* Flash Sale indicator */}
        {product.is_flash_sale && (
          <div className="absolute top-3 right-3 bg-salmon-500 text-white font-sans font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
            Flash Sale
          </div>
        )}

        {/* Physical Size parameter */}
        {product.weight_or_size && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200 shadow-xs">
            {product.weight_or_size}
          </div>
        )}
      </div>

      {/* Description Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-2 text-left">
        
        {/* Rating Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-salmon-500 fill-salmon-500" />
            <span className="text-xs font-semibold text-slate-800">{product.rating || 4.5}</span>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
            Verified Premium
          </span>
        </div>

        {/* Product Title */}
        <div className="flex flex-col">
          <h3 className="font-sans font-bold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-salmon-600 transition-colors">
            {cleanText(product.name)}
          </h3>
        </div>

        {/* Product Description */}
        <div className="space-y-1 my-1">
          <p className="text-xs text-slate-550 line-clamp-2 leading-relaxed font-light">
            {cleanText(product.description)}
          </p>
        </div>

        {/* Price layout */}
        <div className="flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-xs text-slate-400 line-through font-mono">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-salmon-500">
                  ${product.discount_price!.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg sm:text-xl font-bold font-mono text-slate-950">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Dynamic Interactive Add button: White with Black/Salmon details */}
          <button
            id={`add-to-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold select-none transition-all cursor-pointer shadow-xs border ${
              cartQuantity > 0
                ? 'bg-black text-white border-black px-3.5 hover:bg-slate-905'
                : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-350 hover:border-black'
            }`}
          >
            {cartQuantity > 0 ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Added ({cartQuantity})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-slate-800" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
