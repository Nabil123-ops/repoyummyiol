import React from 'react';
import { ShoppingBag, Search, ShieldCheck, Sparkles, Menu } from 'lucide-react';
import { Category } from '../types';

interface NavbarProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenHamburger: () => void;
  flashSaleFilter: boolean;
  setFlashSaleFilter: (val: boolean) => void;
}

export default function Navbar({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenHamburger,
  flashSaleFilter,
  setFlashSaleFilter
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-pink-100 text-slate-850 shadow-md backdrop-blur-md bg-opacity-95">
      <div id="nav-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo brand and Hamburger alignment */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Hamburger linked to categories */}
            <button
              id="hamburger-trigger"
              onClick={onOpenHamburger}
              className="p-2.5 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors focus:outline-none cursor-pointer"
              title="Shop Categories Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Logo Brand section */}
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => {
              setSelectedCategory(null);
              setFlashSaleFilter(false);
              setSearchQuery('');
              window.history.pushState(null, '', '/');
              window.dispatchEvent(new Event('popstate'));
            }}>
              <div className="relative w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden border border-pink-100/60 p-0.5">
                <img 
                  src="https://i.ibb.co/8J3WdDd/Yummy-Products-LB-1.webp" 
                  alt="Yummy Products LB Signature" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Failover to local placeholder if offline, but keep image display high priority
                    e.currentTarget.src = "/Yummy Products LB.webp";
                  }}
                />
              </div>
              <div className="hidden sm:block text-left">
                <span className="font-sans font-bold tracking-tight text-lg bg-gradient-to-r from-pink-650 via-pink-500 to-rose-600 bg-clip-text text-transparent">
                  Yummy Products LB
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-pink-500 uppercase font-extrabold leading-none mt-0.5">
                  Lebanon Imports Premium
                </span>
              </div>
            </div>
          </div>

          {/* Search bar wrapper */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                id="search-input"
                type="text"
                placeholder="Search beauty, musk, body care, facial oils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.history.pushState(null, '', `/search?q=${encodeURIComponent(searchQuery)}`);
                    window.dispatchEvent(new Event('popstate'));
                  }
                }}
                className="w-full bg-pink-50/50 border border-pink-100 rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 transition-all font-light"
              />
              <Search 
                className="absolute left-3.5 top-3 w-4 h-4 text-pink-400 cursor-pointer hover:text-pink-600 transition-colors" 
                onClick={() => {
                  window.history.pushState(null, '', `/search?q=${encodeURIComponent(searchQuery)}`);
                  window.dispatchEvent(new Event('popstate'));
                }}
              />
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Flash Sale Toggle button */}
            <button
              id="flash-sale-btn"
              onClick={() => {
                setFlashSaleFilter(!flashSaleFilter);
                setSelectedCategory(null);
              }}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer ${
                flashSaleFilter 
                  ? 'bg-pink-605 text-white shadow-lg' 
                  : 'bg-pink-50 hover:bg-pink-150 text-pink-600 border border-pink-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" />
              Flash Sale
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-white animate-pulse"></span>
            </button>

            {/* Admin trigger button with verified shield */}
            <button
              id="admin-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-pink-550 hover:bg-pink-600 text-white transition-all uppercase cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </button>

            {/* Shopping Cart widget */}
            <button
              id="cart-trigger"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-100 text-pink-600 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-tr from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile secondary bar: search box */}
        <div className="flex md:hidden pb-3.5 px-1 pt-1 border-t border-pink-50/40">
          <div className="relative w-full">
            <input
              id="search-mobile-input"
              type="text"
              placeholder="Search beauty, musk, body care..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.history.pushState(null, '', `/search?q=${encodeURIComponent(searchQuery)}`);
                  window.dispatchEvent(new Event('popstate'));
                }
              }}
              className="w-full bg-pink-50/50 border border-pink-100 rounded-full py-2.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            <Search 
              className="absolute left-3 top-3.5 w-4 h-4 text-pink-400 cursor-pointer" 
              onClick={() => {
                window.history.pushState(null, '', `/search?q=${encodeURIComponent(searchQuery)}`);
                window.dispatchEvent(new Event('popstate'));
              }}
            />
          </div>
        </div>

        {/* Category filters bar */}
        <div id="category-scroller" className="flex items-center gap-2 overflow-x-auto pb-3 pt-2.5 scrollbar-none border-t border-pink-50">
          <button
            id="cat-all"
            onClick={() => {
              setSelectedCategory(null);
              setFlashSaleFilter(false);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm ${
              selectedCategory === null && !flashSaleFilter
                ? 'bg-pink-600 text-white font-semibold'
                : 'bg-pink-50/60 hover:bg-pink-100 text-pink-700 hover:text-pink-850 border border-pink-100/80'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setFlashSaleFilter(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-pink-500 text-white font-semibold'
                  : 'bg-pink-50/60 hover:bg-pink-100 text-pink-700 hover:text-pink-850 border border-pink-100/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>
    </nav>
  );
}
