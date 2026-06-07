import React, { useState, useEffect } from 'react';
import { getProducts, getCategories, DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from './lib/supabase';
import { Product, Category, CartItem } from './types';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import PromoBanners from './components/PromoBanners';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';
import CategoriesPromoBanners from './components/CategoriesPromoBanners';
import { Sparkles, ArrowLeft, Search, Phone, ShieldCheck, Heart, Trash2, MapPin, Truck, RefreshCw, AlertCircle, ShoppingBag, HelpCircle, ChevronDown, Check, Star, Menu, MessageSquare, X, ArrowRight } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [flashSaleFilter, setFlashSaleFilter] = useState(false);

  // Cart state with local storage cache
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Modal/Drawer visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  // FAQ accordion tracking
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Custom client route control
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    loadStorefrontData();

    // Recover cart state
    const savedCart = localStorage.getItem('yummy_cart_contents');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Cart retrieval error:", err);
      }
    }

    // Routing popstate sync
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      
      if (path.startsWith('/search') || path === '/search') {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q') || '';
        setSearchQuery(query);
      }
      
      // Automatically scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    
    // Check search params on initial load
    const initPath = window.location.pathname;
    if (initPath.startsWith('/search') || initPath === '/search') {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q') || '';
      setSearchQuery(query);
    }
    
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const loadStorefrontData = async () => {
    setLoading(true);
    try {
      let prods = await getProducts();
      let cats = await getCategories();

      // Check if products and categories can match. If either is empty,
      // fallback to the pre-linked default datasets to guarantee beautiful rendering.
      if ((prods.length === 0 || cats.length === 0) && DEFAULT_PRODUCTS.length > 0) {
        console.warn("Database is empty or failed to load. Aligning with default datasets.");
        prods = DEFAULT_PRODUCTS;
        cats = DEFAULT_CATEGORIES;
      }

      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error("Storefront loading error:", err);
      // Absolute fallback if everything fails
      setProducts(DEFAULT_PRODUCTS);
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  // Cart action pipelines
  const handleUpdateCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem('yummy_cart_contents', JSON.stringify(updated));
  };

  const handleAddToCart = (product: Product) => {
    const existingIdx = cart.findIndex(it => it.product.id === product.id);
    const updated = [...cart];
    
    if (existingIdx >= 0) {
      updated[existingIdx].quantity += 1;
    } else {
      updated.push({ product, quantity: 1 });
    }
    handleUpdateCart(updated);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const updated = cart.map(it => {
      if (it.product.id === productId) {
        return { ...it, quantity };
      }
      return it;
    });
    handleUpdateCart(updated);
  };

  const handleRemoveItem = (productId: string) => {
    const updated = cart.filter(it => it.product.id !== productId);
    handleUpdateCart(updated);
  };

  const handleClearCart = () => {
    handleUpdateCart([]);
  };

  // Filtering computational logic
  const filteredProducts = products.filter(p => {
    // 1. Category search
    if (selectedCategory && p.category !== selectedCategory) {
      // Direct category filter
      return false;
    }
    // 2. Flash Sale countdown click filter
    if (flashSaleFilter && !p.is_flash_sale) {
      return false;
    }
    // 3. Text query searches
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      return matchName || matchDesc || matchCategory;
    }
    return true;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // FAQ mock database
  const faqData = [
    {
      q: "How does the Lebanese Cash on Delivery (COD) system work?",
      a: "Due to localized card variations, we deliver all orders directly to your door anywhere in Lebanon and accept cash payment. You can pay in USD banknotes or Lebanese Lira (LBP) calculated at the fair local parallel market exchange rate of the day."
    },
    {
      q: "Where do you import these premium Yummy products from?",
      a: "Our confectioneries are imported from Belgium, Japan, Germany, and specialty bakeries in Turkey. Our Lebanese Artisanal delights are sourced with hand-selected local honey-makers and historical sweet bakers in Sidon, Tripoli, and Mount Lebanon."
    }
  ];

  // Routing Switchboard
  const isAdminRoute = currentPath === '/admin';
  const isProductDetailRoute = currentPath.startsWith('/p/');
  const isSearchRoute = currentPath.startsWith('/search') || currentPath === '/search';

  // If visiting product page, find the target item
  let productPageSlug = '';
  let activeDetailProduct: Product | undefined = undefined;
  if (isProductDetailRoute) {
    productPageSlug = currentPath.substring(3);
    activeDetailProduct = products.find(p => p.slug === productPageSlug);
  }

  // Related products helper
  const relatedProducts = activeDetailProduct 
    ? products.filter(p => p.category === activeDetailProduct?.category && p.id !== activeDetailProduct?.id).slice(0, 4)
    : [];

  // Helper to trigger navigation
  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  // WhatsApp click triggers
  const triggerWhatsAppSupport = () => {
    const message = encodeURIComponent("Hello Yummy Products LB! I am browsing your premium food store and would like to ask a question.");
    window.open(`https://wa.me/96170123456?text=${message}`, '_blank');
  };

  const triggerWhatsAppProductOrder = (prod: Product) => {
    const finalPrice = prod.discount_price || prod.price;
    const message = encodeURIComponent(`Hello! I'm interested in ordering the premium "${prod.name}" (${prod.weight_or_size || '1 unit'}). Price is $${finalPrice.toFixed(2)}. Could you assist with my delivery?`);
    window.open(`https://wa.me/96170123456?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-pink-50/20 font-sans text-slate-800 selection:bg-pink-100 selection:text-pink-900 flex flex-col">
      
      {/* Decorative localized delivery promotion ticker */}
      <div className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 py-2.5 px-4 text-center text-xs font-bold text-white tracking-wider uppercase shadow-sm select-none">
        🌸 Cash on Delivery in Lebanon | FREE Premium Gift over $50 | FREE Delivery over $100! 🎁🚚
      </div>

      {/* Main Navigation menu wrapper */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={(catId) => {
          setSelectedCategory(catId);
          navigateTo('/');
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          navigateTo('/');
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => {
          navigateTo('/admin');
        }}
        onOpenHamburger={() => setIsHamburgerOpen(true)}
        flashSaleFilter={flashSaleFilter}
        setFlashSaleFilter={(val) => {
          setFlashSaleFilter(val);
          navigateTo('/');
        }}
      />

      {/* Hamburger Drawer Overlay */}
      {isHamburgerOpen && (
        <div className="fixed inset-0 z-55 flex justify-start bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-left p-6 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-pink-100 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pink-500" />
                <span className="font-serif font-black text-lg text-slate-800">Yummy Collections</span>
              </div>
              <button 
                onClick={() => setIsHamburgerOpen(false)}
                className="p-1 rounded-lg bg-pink-50 text-pink-500 hover:bg-pink-100 hover:text-pink-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setFlashSaleFilter(false);
                  setIsHamburgerOpen(false);
                  navigateTo('/');
                }}
                className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                  selectedCategory === null && !flashSaleFilter
                    ? 'bg-pink-100 text-pink-700 font-black'
                    : 'bg-pink-50/60 hover:bg-pink-100 text-pink-700 hover:text-pink-850 border border-pink-100'
                }`}
              >
                <span>Preview All Products</span>
                <Check className={`w-4 h-4 ${selectedCategory === null ? 'opacity-100' : 'opacity-0'}`} />
              </button>

              <button
                onClick={() => {
                  setFlashSaleFilter(true);
                  setSelectedCategory(null);
                  setIsHamburgerOpen(false);
                  navigateTo('/');
                }}
                className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                  flashSaleFilter
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black'
                    : 'bg-pink-50/50 hover:bg-pink-100 text-pink-600 border border-pink-100'
                }`}
              >
                <span className="flex items-center gap-1.5">🔥 Flash Sales (Up to 60% Off)</span>
                <Sparkles className="w-4 h-4 animate-pulse" />
              </button>

              <div className="border-t border-pink-100 pt-4 pb-2 text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">
                Explore Categories
              </div>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setFlashSaleFilter(false);
                    setIsHamburgerOpen(false);
                    navigateTo('/');
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-pink-500 text-white font-black'
                      : 'bg-pink-50/50 hover:bg-pink-100 text-pink-750 hover:text-pink-850 border border-pink-100'
                  }`}
                >
                  <img src={cat.image_url} alt={cat.name} className="w-7 h-7 rounded-full object-cover bg-slate-100 border border-pink-100/50" />
                  <span className="flex-1 text-left">{cat.name}</span>
                  <Check className={`w-4 h-4 ${selectedCategory === cat.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-pink-100 flex flex-col gap-2">
              <button 
                onClick={() => {
                  setIsHamburgerOpen(false);
                  navigateTo('/admin');
                }}
                className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4 text-pink-400" />
                Access Admin Panel
              </button>
              <button 
                onClick={triggerWhatsAppSupport}
                className="w-full py-2.5 bg-emerald-550 text-white hover:bg-emerald-650 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-white" />
                Chat WhatsApp Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN ROUTER CONTROLLER */}
      {isAdminRoute ? (
        <div className="flex-1 bg-slate-900">
          <AdminPanel
            isOpen={true}
            onClose={() => {
              navigateTo('/');
            }}
            products={products}
            categories={categories}
            onRefreshData={loadStorefrontData}
            isFullPage={true}
          />
        </div>
      ) : isSearchRoute ? (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-fade-in text-left">
          {/* Back Navigation Bar */}
          <button 
            onClick={() => {
              setSearchQuery('');
              navigateTo('/');
            }}
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 text-sm font-bold pb-4 uppercase transition-all select-none cursor-pointer text-left"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to storefront catalog</span>
          </button>

          <div className="text-left space-y-2">
            <span className="font-mono text-[10px] tracking-widest text-pink-500 font-bold uppercase block">Real-time Catalog Query</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-slate-900">
              {searchQuery ? `Search Results for: "${searchQuery}"` : 'Product Search Directory'}
            </h1>
            <p className="text-xs text-slate-500 font-light">
              We searched across all categories, names, descriptions, and translation records for synced matches.
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white border border-pink-100 rounded-3xl p-8 max-w-lg mx-auto space-y-5 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mx-auto border border-pink-100">
                <Search className="w-6 h-6 text-pink-400" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-950 text-sm">No matched results</p>
                <p className="text-xs text-slate-400">
                  Try another search query or check alternative categories.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  navigateTo('/');
                }}
                className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl"
              >
                Clear Search & Go Home
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((p) => {
                const currentInCart = cart.find(it => it.product.id === p.id)?.quantity || 0;
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={handleAddToCart}
                    cartQuantity={currentInCart}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : isProductDetailRoute ? (
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Navigation Bar */}
          <button 
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 text-sm font-bold pb-6 uppercase transition-all select-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to storefront catalog</span>
          </button>

          {loading ? (
            <div className="py-24 text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-pink-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-500 font-mono">Loading product information...</p>
            </div>
          ) : !activeDetailProduct ? (
            <div className="py-20 text-center bg-white border border-pink-100 rounded-3xl p-8 max-w-sm mx-auto space-y-4">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="font-bold text-slate-800">Product Not Found</h3>
              <p className="text-xs text-slate-400">The gourmet sweet treat you requested could not be synced or found.</p>
              <button 
                onClick={() => navigateTo('/')}
                className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl"
              >
                Go Back Home
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="bg-white border border-pink-100/70 rounded-3xl overflow-hidden shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
                
                {/* Images side */}
                <div className="md:col-span-5 space-y-4 text-left">
                  <div className="relative pt-[100%] rounded-2xl overflow-hidden border border-pink-50 bg-pink-50/10">
                    <img 
                      src={activeDetailProduct.image_url} 
                      alt={activeDetailProduct.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {activeDetailProduct.discount_price && activeDetailProduct.discount_price < activeDetailProduct.price && (
                      <div className="absolute top-4 left-4 bg-pink-600 text-white font-mono font-bold text-xs px-3 py-1 rounded-full">
                        -{Math.round(((activeDetailProduct.price - activeDetailProduct.discount_price) / activeDetailProduct.price) * 100)}% DISCOUNT
                      </div>
                    )}
                    {activeDetailProduct.is_flash_sale && (
                      <div className="absolute top-4 right-4 bg-pink-500 text-white font-sans font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded">
                        FLASH DEAL
                      </div>
                    )}
                  </div>
                </div>

                {/* Info and Purchase side */}
                <div className="md:col-span-7 text-left flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-pink-50 border border-pink-100 text-pink-700 text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider">
                        {activeDetailProduct.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-705">
                        <Star className="w-4 h-4 text-pink-505 fill-pink-500" />
                        <span>{activeDetailProduct.rating || 4.8} score</span>
                      </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight leading-snug text-slate-950 text-left">
                      {activeDetailProduct.name}
                    </h1>

                    {activeDetailProduct.weight_or_size && (
                      <div className="inline-flex items-center bg-slate-50 border border-slate-200 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
                        Quantity/Size: {activeDetailProduct.weight_or_size}
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200/60 space-y-4">
                      <div>
                        <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">Description</h4>
                        <p className="text-sm text-slate-700 leading-relaxed font-light mt-1 text-left">
                          {activeDetailProduct.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex items-baseline gap-3">
                      {activeDetailProduct.discount_price ? (
                        <>
                          <span className="text-3xl font-mono font-black text-pink-600">
                            ${activeDetailProduct.discount_price.toFixed(2)}
                          </span>
                          <span className="text-sm font-mono text-slate-400 line-through">
                            Original: ${activeDetailProduct.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-mono font-black text-slate-905">
                          ${activeDetailProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buy/Contact columns */}
                  <div className="pt-6 border-t border-pink-50/70 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleAddToCart(activeDetailProduct!)}
                      className="flex-1 py-4 bg-gradient-to-r from-pink-550 to-rose-650 hover:from-pink-500 hover:to-rose-550 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition cursor-pointer select-none"
                    >
                      <ShoppingBag className="w-5 h-5 text-white" />
                      <span>Add to Shop Basket ({cart.find(it => it.product.id === activeDetailProduct?.id)?.quantity || 0} in cart)</span>
                    </button>

                    <button
                      onClick={() => triggerWhatsAppProductOrder(activeDetailProduct!)}
                      className="py-4 px-6 bg-emerald-555 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer select-none"
                      title="Quick Order via WhatsApp chatbot"
                    >
                      <MessageSquare className="w-5 h-5 fill-current text-white" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Related / Recommendations Slider */}
              {relatedProducts.length > 0 && (
                <div className="space-y-6 text-left">
                  <h3 className="text-xl font-serif font-black text-slate-900">Yummy Related Delicacies</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {relatedProducts.map((p) => {
                      const inCart = cart.find(it => p.id === it.product.id)?.quantity || 0;
                      return (
                        <ProductCard 
                          key={p.id}
                          product={p}
                          onAddToCart={handleAddToCart}
                          cartQuantity={inCart}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* STANDARD CUSTOMERS HOME SCREEN */
        <>
          {/* Promotional Countdown banner */}
          <HeroBanner 
            onShopFlashSale={() => {
              setFlashSaleFilter(true);
              setSelectedCategory(null);
              // Scroll to product anchor
              document.getElementById('catalog-start-anchor')?.scrollIntoView({ behavior: 'smooth' });
            }}
            isFlashSaleActive={flashSaleFilter}
          />

          {/* MAIN HOME CONTENTS */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            
            {/* Brand Campaign Spotlight Banners */}
            <PromoBanners 
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setFlashSaleFilter(false);
              }}
            />

            {/* BIG CIRCLE CATEGORIES NAVIGATION LAYOUT */}
            {/* "make each category to be a big circle and 2 per each lines" */}
            <div className="space-y-8">
              <div className="text-center md:text-left">
                <span className="font-mono text-xs tracking-widest text-pink-500 font-bold uppercase block">Premium Care Range</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-950 mt-1">Browse Our Beautiful Skin & Body Collections</h3>
              </div>

              {loading ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-8 h-8 text-pink-400 animate-spin mx-auto" strokeWidth={2.5} />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <div 
                        key={cat.id}
                        id={`category-circle-${cat.id}`}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setFlashSaleFilter(false);
                          document.getElementById('catalog-start-anchor')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group flex flex-col items-center gap-3 cursor-pointer select-none text-center transform transition-transform"
                      >
                        {/* Circular Cropped container with double black/slate border */}
                        <div className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden transition-all duration-300 transform group-hover:scale-105 shadow-md ${
                          isSelected 
                            ? 'ring-4 ring-black ring-offset-4 shadow-xl scale-105' 
                            : 'border-2 border-slate-200 hover:border-black'
                        }`}>
                          <img 
                            src={cat.image_url} 
                            alt={cat.name} 
                            className="absolute inset-0 w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute inset-0 bg-salmon-500/10 transition-opacity ${isSelected ? 'opacity-0' : 'group-hover:opacity-0 opacity-20'}`} />
                        </div>
                        
                        {/* Title text label */}
                        <div className="space-y-1">
                          <p className={`font-sans font-extrabold text-sm tracking-tight transition-colors ${
                            isSelected ? 'text-black font-black font-sans' : 'text-slate-800 group-hover:text-salmon-500 font-sans'
                          }`}>
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-slate-450 line-clamp-1 font-light leading-none px-2">
                            {cat.description || 'Premium Yummy Collection'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Dynamic curated multi promo banners under the categories row */}
              <CategoriesPromoBanners onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setFlashSaleFilter(false);
              }} />
            </div>

            <div id="catalog-start-anchor" className="scroll-mt-24 pb-2 border-b border-salmon-100"></div>

            {/* Catalog Header with current search and select state */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 text-left">
                    {flashSaleFilter && '🔥 Special Flash Sale active!'}
                    {selectedCategory && !flashSaleFilter && `Collection: ${categories.find(c => c.id === selectedCategory)?.name}`}
                    {!selectedCategory && !flashSaleFilter && 'All Hand-Selected Yummy Products'}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed text-left">
                  {selectedCategory ? 'We sync and import fresh batches directly to Lebanon.' : 'Select any circular category above to instantly view its synced delicacies catalogue.'}
                </p>
              </div>

              {/* Clear Filter button */}
              {(selectedCategory || flashSaleFilter || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setFlashSaleFilter(false);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-pink-100/90 hover:bg-pink-200 border border-pink-200 text-xs font-bold rounded-xl text-pink-750 hover:text-pink-900 transition-all self-start sm:self-center cursor-pointer shadow-sm select-none"
                >
                  View All Products (Clear Filters)
                </button>
              )}
            </div>

            {/* PRODUCT SYNCHRONIZATION AND GRID */}
            {loading ? (
              <div className="py-24 text-center space-y-4">
                <RefreshCw className="w-12 h-12 text-pink-500 animate-spin mx-auto" />
                <p className="text-sm text-slate-500 font-mono">Updating database synchronization lines...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white border border-pink-100 rounded-3xl p-8 max-w-lg mx-auto space-y-5 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mx-auto border border-pink-100">
                  <ShoppingBag className="w-6 h-6 text-pink-400" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-950 text-sm">No synchronized products found</p>
                  <p className="text-xs text-slate-500">
                    Feel free to clear filtered categories, or use the search controls above to sync available batches.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setFlashSaleFilter(false);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-pink-550 hover:bg-pink-650 text-white font-bold text-xs rounded-xl"
                >
                  Show Complete Catalogue
                </button>
              </div>
            ) : (
              /* DONT LET ALL PRODUCTS IN HOME PAGE - Sync them per category *or* current filtered list */
              <div className="space-y-12 text-slate-800">
                {!selectedCategory && !searchQuery && !flashSaleFilter ? (
                  /* Beautiful Grouped by Category View */
                  categories.map((cat) => {
                    const categoryProducts = filteredProducts.filter(p => p.category === cat.id);
                    if (categoryProducts.length === 0) return null;

                    // Show up to 4 items from this category as requested by the user
                    const displayedProducts = categoryProducts.slice(0, 4);

                    return (
                      <div key={cat.id} id={`category-section-${cat.id}`} className="space-y-6 scroll-mt-24">
                        {/* Category Row header, beautifully aligned and styled in high contrast black */}
                        <div className="flex items-end justify-between border-b border-slate-200 pb-3">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-left">
                            <h3 className="font-sans font-extrabold text-slate-950 text-lg sm:text-xl md:text-2xl tracking-tight">
                              {cat.name}
                            </h3>
                          </div>
                          
                          {/* "Browse More" trigger */}
                          {categoryProducts.length > 4 && (
                            <button
                              onClick={() => {
                                setSelectedCategory(cat.id);
                                document.getElementById('catalog-start-anchor')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-850 hover:underline transition-all cursor-pointer group"
                            >
                              <span>Browse More</span>
                              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>

                        {/* List of 4 items lined per 2 per row (meaning 2 cols on mobile, 4 on desktop!) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                          {displayedProducts.map((p) => {
                            const currentInCart = cart.find(it => it.product.id === p.id)?.quantity || 0;
                            return (
                              <ProductCard
                                key={p.id}
                                product={p}
                                onAddToCart={handleAddToCart}
                                cartQuantity={currentInCart}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Standard Complete Filtered block for search, flash-sale or selected category */
                  <div className="space-y-4">
                    {/* Nice Breadcrumb header when category filter is active */}
                    {selectedCategory && (
                      <div className="flex items-center gap-2 mb-4 text-left">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-pink-600 font-semibold cursor-pointer select-none"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home Feed
                        </button>
                        <span className="text-slate-300 text-xs">/</span>
                        <span className="text-xs font-mono text-pink-500 font-bold uppercase">{categories.find(c => c.id === selectedCategory)?.name} Collection</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                      {filteredProducts.map((p) => {
                        const currentInCart = cart.find(it => it.product.id === p.id)?.quantity || 0;
                        return (
                          <ProductCard
                            key={p.id}
                            product={p}
                            onAddToCart={handleAddToCart}
                            cartQuantity={currentInCart}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Regional Lebanon Delivery logistics block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-pink-100/80 rounded-3xl p-6 sm:p-8 text-left shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-650">
                  <Truck className="w-5.5 h-5.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">Lebanon-wide CoD</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  We deliver your basket safely across all locations (Beirut, Mount Lebanon, South, North, Bekaa) with reliable Cash on Delivery service.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-650">
                  <Sparkles className="w-5.5 h-5.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">Gourmet freshness guaranteed</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Our imports are kept in temperature-regulated containers to preserve crisp coatings, chocolate textures, and baklava crunchiness.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-400">
                  <RefreshCw className="w-5.5 h-5.5 animate-spin-slow" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">Real-time Supabase Sync</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  We import categories and products seamlessly from all database tables. Customer checkouts write instantly to your cloud database.
                </p>
              </div>
            </div>

            {/* FAQ Area */}
            <section className="space-y-6 max-w-3xl mx-auto text-left">
              <div className="text-center space-y-2">
                <HelpCircle className="w-8 h-8 text-pink-500 mx-auto" />
                <h3 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-slate-900">Frequently Asked Questions</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-light text-center">Get answers on shipping details, payments, and database synchronization.</p>
              </div>

              <div className="space-y-3.5 pt-4">
                {faqData.map((faq, idx) => {
                  const active = activeFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white border border-pink-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                    >
                      <button
                        onClick={() => setActiveFaq(active ? null : idx)}
                        className="w-full p-4.5 flex items-center justify-between text-left hover:bg-pink-50/20 transition-colors cursor-pointer"
                      >
                        <span className="font-semibold text-xs sm:text-sm text-slate-800">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${active ? 'rotate-180' : ''}`} />
                      </button>
                      {active && (
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-pink-50 animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </main>
        </>
      )}

      {/* Pulsing floating WhatsApp support chatbot widget */}
      <button
        onClick={triggerWhatsAppSupport}
        className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95 animate-bounce flex items-center justify-center cursor-pointer"
        title="Chat live with Yummy Products LB administrators"
      >
        <MessageSquare className="w-6 h-6 fill-current text-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-pink-500 border border-white animate-pulse"></span>
      </button>

      {/* Decorative footer */}
      <footer className="bg-slate-50 border-t border-pink-100 py-16 text-slate-605 text-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Key Metrics of Beauty Achievements banner */}
          <div className="bg-white border border-pink-100 rounded-3xl p-8 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div className="md:col-span-2 text-left space-y-2">
              <span className="font-mono text-[10px] tracking-widest text-pink-500 font-bold uppercase block">Our Beauty Milestones</span>
              <h4 className="text-xl font-serif font-black text-slate-900">Key Metrics of Beauty Achievements</h4>
              <p className="text-xs text-slate-500 leading-normal font-light">
                Glowing results that speak for themselves: A story of care, confidence, and beauty.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 md:col-span-2 text-center">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-pink-600 font-mono">3000+</p>
                <p className="text-[10px] sm:text-xs text-slate-550 font-medium">Happy Customers</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-pink-605 font-mono">500+</p>
                <p className="text-[10px] sm:text-xs text-slate-550 font-medium">Skin Care Products</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-pink-605 font-mono">8+</p>
                <p className="text-[10px] sm:text-xs text-slate-550 font-medium">Years of experience</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 text-left">
            {/* Column 1: Brand details */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <img 
                  src="Yummy Products LB.webp" 
                  alt="Yummy Products LB logo" 
                  className="w-10 h-10 object-contain rounded-lg border border-pink-105 shadow-xs"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h4 className="text-lg font-serif font-black tracking-tight text-slate-950">Yummy Products LB</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Not just yummy for food. Our Yummy is for yummy products for your yummy body. We are an online business based in Antelias, offering body and facial care including makhmaria, body oils, bath bombs, and much more.
              </p>
              <div>
                <p className="text-[10px] font-mono tracking-widest text-pink-500 font-bold uppercase">Delivery Promise</p>
                <p className="text-xs text-slate-600 mt-1 font-semibold">Delivery all over Lebanon for 4$ • Free delivery over $35</p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-3 space-y-4">
              <h5 className="text-xs font-mono font-black uppercase text-pink-500 tracking-widest">Our Catalog Categories</h5>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {categories.slice(0, 10).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setFlashSaleFilter(false);
                      document.getElementById('catalog-start-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left text-slate-500 hover:text-pink-600 transition-colors py-0.5 cursor-pointer"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Secondary Categories */}
            <div className="md:col-span-2 space-y-4">
              <h5 className="text-xs font-mono font-black uppercase text-pink-500 tracking-widest">More Selections</h5>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {categories.slice(10).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setFlashSaleFilter(false);
                      document.getElementById('catalog-start-anchor')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left text-slate-500 hover:text-pink-600 transition-colors py-0.5 cursor-pointer"
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setFlashSaleFilter(true);
                    setSelectedCategory(null);
                    document.getElementById('catalog-start-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-left text-pink-605 font-bold hover:text-pink-850 py-0.5 cursor-pointer"
                >
                  Flash Sale Up to 60% Off
                </button>
              </div>
            </div>

            {/* Column 4: Contact info */}
            <div className="md:col-span-3 space-y-4">
              <h5 className="text-xs font-mono font-black uppercase text-pink-500 tracking-widest">Connect With Us</h5>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="text-pink-500 font-semibold font-mono">Email:</span>
                  <a href="mailto:yummyproducts.lb@gmail.com" className="hover:text-pink-600 font-light truncate" title="yummyproducts.lb@gmail.com">
                    yummyproducts.lb@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-500 font-semibold font-mono">Hotline:</span>
                  <a href="tel:+96176477025" className="hover:text-pink-600 font-light">
                    +961 76 477025
                  </a>
                </li>
                <li className="text-[10px] text-slate-400 font-light">
                  Antelias, Lebanon. Online support available 24/7. Cash paid on delivery.
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => {
                    navigateTo('/admin');
                  }}
                  className="px-4 py-2 bg-pink-100/90 hover:bg-pink-200 text-pink-700 hover:text-pink-900 border border-pink-200/80 text-[11px] font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Admin Operations Portal
                </button>
              </div>
            </div>
          </div>

          {/* Copyright mark */}
          <div className="border-t border-pink-100/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-light">
            <p>© {new Date().getFullYear()} Copyright yummyproductslb</p>
            <p className="font-mono text-[10px] uppercase tracking-widest">
              Premium Beauty & Skincare Collections Lebanon
            </p>
          </div>

        </div>
      </footer>

      {/* Modals and Sliding panels */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onClearCart={handleClearCart}
      />

      {/* Modal fallback for backward compatibility when not using /admin path */}
      {!isAdminRoute && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          products={products}
          categories={categories}
          onRefreshData={loadStorefrontData}
        />
      )}

    </div>
  );
}
