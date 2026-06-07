import React, { useState, useEffect } from 'react';
import { 
  X, Database, ListOrdered, Sparkles, LogOut, Plus, Edit3, Trash2, CheckCircle2, 
  RefreshCw, AlertCircle, ShieldAlert, KeyRound, Copy, Check, Eye
} from 'lucide-react';
import { Product, Category, Order } from '../types';
import { 
  getOrders, saveProduct, deleteProduct, saveCategory, deleteCategory, 
  updateOrderStatus, syncLocalToSupabase, SUPABASE_SQL_CREATION_SCHEMA, supabase,
  DEFAULT_CATEGORIES, DEFAULT_PRODUCTS
} from '../lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onRefreshData: () => void;
  isFullPage?: boolean;
}

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  categories,
  onRefreshData,
  isFullPage = false
}: AdminPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Tab control
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'sync'>('products');

  // Form states
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '', name: '', name_ar: '', description: '', description_ar: '', category: '', price: 0, discount_price: undefined,
    image_url: '', is_flash_sale: false, stock: 50, rating: 4.5, weight_or_size: ''
  });
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    id: '', name: '', description: '', image_url: ''
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ success?: boolean; msg?: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // File uploading to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'category') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'product') {
        setProductForm(prev => ({ ...prev, image_url: base64String }));
      } else {
        setCategoryForm(prev => ({ ...prev, image_url: base64String }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Load orders only when logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadAdminOrders();
    }
  }, [isLoggedIn]);

  const loadAdminOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen && !isFullPage) return null;

  // Handle Authentication submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "yummyproductslb@gmail.com" && password === "yummy123") {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError("Invalid Administrator credentials. Please verify.");
    }
  };

  // Create or update item
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category || !productForm.price || !productForm.image_url) {
      alert("Please fill in Name, Category, Base Price, and Image URL.");
      return;
    }

    const payload: Product = {
      id: productForm.id || "PROD-" + Math.floor(1000 + Math.random() * 9000),
      name: productForm.name,
      name_ar: productForm.name_ar || undefined,
      description: productForm.description || '',
      description_ar: productForm.description_ar || undefined,
      category: productForm.category,
      price: Number(productForm.price),
      discount_price: productForm.discount_price ? Number(productForm.discount_price) : undefined,
      image_url: productForm.image_url,
      is_flash_sale: Boolean(productForm.is_flash_sale),
      stock: productForm.stock ? Number(productForm.stock) : 50,
      rating: productForm.rating ? Number(productForm.rating) : 4.5,
      weight_or_size: productForm.weight_or_size || '',
      created_at: new Date().toISOString()
    };

    const ok = await saveProduct(payload);
    alert(ok ? "Saved successfully & Synced to Supabase!" : "Saved locally (Supabase write failed. If this is a new setup, run the schema script in your Supabase SQL Editor!)");
    
    // Clear
    setIsEditingProduct(false);
    setProductForm({
      id: '', name: '', name_ar: '', description: '', description_ar: '', category: '', price: 0, discount_price: undefined,
      image_url: '', is_flash_sale: false, stock: 50, rating: 4.5, weight_or_size: ''
    });
    onRefreshData();
  };

  const handleProductEdit = (p: Product) => {
    setProductForm(p);
    setIsEditingProduct(true);
  };

  const handleProductDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const ok = await deleteProduct(id);
      alert(ok ? "Deleted from Supabase!" : "Deleted locally.");
      onRefreshData();
    }
  };

  // Categories handle (add and edit)
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.id) {
      alert("Name and Unique ID are required.");
      return;
    }

    const payload: Category = {
      id: categoryForm.id.toLowerCase().replace(/\s+/g, '-'),
      name: categoryForm.name,
      description: categoryForm.description || '',
      image_url: categoryForm.image_url || 'https://images.unsplash.com/photo-1599490659213-e2b9527ec087?q=80&w=600&auto=format&fit=crop',
      created_at: categoryForm.created_at || new Date().toISOString()
    };

    const ok = await saveCategory(payload);
    alert(ok ? "Category saved & synced successfully!" : "Category saved locally.");
    setCategoryForm({ id: '', name: '', description: '', image_url: '' });
    setIsEditingCategory(false);
    onRefreshData();
  };

  const handleCategoryEdit = (cat: Category) => {
    setCategoryForm(cat);
    setIsEditingCategory(true);
  };

  const handleCategoryDelete = async (id: string) => {
    if (confirm("Are you sure? Products assigned to this category won't be deleted, but they may lose filter bindings.")) {
      const ok = await deleteCategory(id);
      alert(ok ? "Category deleted from Supabase!" : "Deleted locally.");
      onRefreshData();
    }
  };

  // Change Order status
  const handleOrderStatusToggle = async (orderId: string, currentStatus: Order['status']) => {
    const statuses: Order['status'][] = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    const ok = await updateOrderStatus(orderId, nextStatus);
    if (ok) {
      loadAdminOrders();
    } else {
      alert("Order status updated locally.");
      loadAdminOrders(); // Reload to show local edits
    }
  };

  // Sync state
  const handleForceSync = async () => {
    setSyncLoading(true);
    setSyncStatus(null);
    const res = await syncLocalToSupabase();
    setSyncLoading(false);
    if (res.error) {
      setSyncStatus({ success: false, msg: res.error });
    } else {
      setSyncStatus({ success: true, msg: `Synced ${res.productsSynced} products and ${res.categoriesSynced} categories successfully!` });
      onRefreshData();
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_CREATION_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const overlayClass = isFullPage 
    ? "min-h-screen w-full bg-slate-950 text-white flex flex-col" 
    : "fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-white";

  const boxClass = isFullPage
    ? "relative w-full min-h-screen bg-slate-900 flex flex-col"
    : "relative w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up";

  return (
    <div id="admin-panel-overlay" className={overlayClass}>
      <div id="admin-panel-box" className={boxClass}>
        
        {/* Header section */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[10px] tracking-widest text-[#FFE082] uppercase">Admin Controls</span>
            <span className="text-sm font-bold text-slate-400">/</span>
            <h2 className="text-base font-bold text-white font-serif tracking-wide">Yummy Products LB Registry</h2>
          </div>
          {isFullPage ? (
            <button 
              onClick={() => {
                window.history.pushState(null, '', '/');
                window.dispatchEvent(new Event('popstate'));
              }} 
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Back to Home Store
            </button>
          ) : (
            <button 
              id="close-admin-panel"
              onClick={onClose} 
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Login Gate */}
        {!isLoggedIn ? (
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-850 p-6 sm:p-8 rounded-2xl border border-slate-850 space-y-6 text-center shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6 animate-bounce" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-slate-100">Administrator Credentials</h3>
                <p className="text-xs text-slate-400 mt-1.5 font-light">Enter authorized administrative details to access the management panel.</p>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 bg-rose-500/15 border border-rose-500/20 text-rose-300 text-xs text-left rounded-lg">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold font-mono">AUTHORIZED EMAIL</label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-semibold font-mono">SECURITY ASSIGNED PASSWORD</label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold rounded-xl transition-all shadow-md mt-2 cursor-pointer"
                >
                  Decrypt and Log In
                </button>
              </form>

            </div>
          </div>
        ) : (
          /* Main Admin Area */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar navigation */}
            <div className="w-full md:w-56 bg-slate-950 border-r border-slate-850 p-4 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
              <button
                _id="tab-products"
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'products' ? 'bg-amber-500 text-slate-950' : 'text-slate-450 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Manage Products</span>
              </button>

              <button
                _id="tab-categories"
                onClick={() => setActiveTab('categories')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'categories' ? 'bg-amber-500 text-slate-950' : 'text-slate-450 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Product Categories</span>
              </button>

              <button
                _id="tab-orders"
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'orders' ? 'bg-amber-500 text-slate-950' : 'text-slate-450 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>Customer Orders ({orders.length})</span>
              </button>

              <button
                _id="tab-sync"
                onClick={() => setActiveTab('sync')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === 'sync' ? 'bg-amber-500 text-slate-950' : 'text-slate-450 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>Supabase Sync</span>
              </button>

              <div className="flex-1 hidden md:block"></div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-3 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-2 hover:bg-slate-900 rounded-xl cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Sub-tab view body */}
            <div className="flex-1 p-6 overflow-y-auto text-left">
              
              {/* TAB 1: PRODUCTS MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-white">Yummy Products Database</h3>
                      <p className="text-xs text-slate-400">Add, adjust, or retire yummy items</p>
                    </div>
                    {isEditingProduct && (
                      <button
                        onClick={() => {
                          setIsEditingProduct(false);
                          setProductForm({
                            id: '', name: '', name_ar: '', description: '', description_ar: '', category: '', price: 0, discount_price: undefined,
                            image_url: '', is_flash_sale: false, stock: 50, rating: 4.5, weight_or_size: ''
                          });
                        }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  {/* Product addition form */}
                  <form onSubmit={handleProductSubmit} className="p-4 bg-slate-850 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <h4 className="md:col-span-3 text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                      {isEditingProduct ? `EDIT PRODUCT: ${productForm.id}` : 'ADD NEW PREMIUM PRODUCT'}
                    </h4>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono">Product Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lemon Mint Drops"
                        value={productForm.name || ''}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="space-y-1" dir="rtl">
                      <label className="text-[11px] text-slate-400 font-sans font-bold block text-right text-amber-300">اسم المنتج باللغة العربية (اختياري)</label>
                      <input
                        type="text"
                        placeholder="مثال: رول اللافندر المهدئ"
                        value={productForm.name_ar || ''}
                        onChange={(e) => setProductForm({ ...productForm, name_ar: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 text-right font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono">Category</label>
                      <select
                        required
                        value={productForm.category || ''}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="">Choose category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono">Weight / Volume Indicator</label>
                      <input
                        type="text"
                        placeholder="e.g. 250g, 330ml, 12 pieces"
                        value={productForm.weight_or_size || ''}
                        onChange={(e) => setProductForm({ ...productForm, weight_or_size: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono">Original Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 15.00"
                        value={productForm.price || ''}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono">Discount Price ($) - Option</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 9.00 (leave blank for no discount)"
                        value={productForm.discount_price || ''}
                        onChange={(e) => setProductForm({ ...productForm, discount_price: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono">Stock Count</label>
                      <input
                        type="number"
                        placeholder="e.g. 50"
                        value={productForm.stock || ''}
                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono flex items-center justify-between">
                        <span>Product Image URL or Local Uploader</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={productForm.image_url || ''}
                          onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500"
                        />
                        <label className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1 select-none rounded-lg text-xs cursor-pointer flex items-center justify-center font-bold text-slate-300">
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'product')}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {productForm.image_url && productForm.image_url.startsWith('data:') && (
                        <p className="text-[10px] text-emerald-400 font-mono">Local image loaded (Base64 ready)</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 md:pt-4">
                      <label className="relative flex items-center gap-2 cursor-pointer select-none text-xs text-slate-350">
                        <input
                          type="checkbox"
                          checked={productForm.is_flash_sale || false}
                          onChange={(e) => setProductForm({ ...productForm, is_flash_sale: e.target.checked })}
                          className="w-4.5 h-4.5 text-amber-500 bg-slate-900 border-slate-700 rounded focus:ring-amber-500"
                        />
                        <span>Featured Flash Sale Item?</span>
                      </label>
                    </div>

                    <div className="md:col-span-3 space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 text-left">
                        <label className="text-[11px] text-slate-400 font-semibold font-mono">Product Description (English)</label>
                        <textarea
                          rows={2.5}
                          placeholder="Detail skincare benefits, essential extracts, and volume directions..."
                          value={productForm.description || ''}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 resize-none"
                        ></textarea>
                      </div>

                      <div className="space-y-1 text-right" dir="rtl">
                        <label className="text-[11px] text-slate-400 font-sans font-bold block text-amber-300">وصف المنتج (باللغة العربية)</label>
                        <textarea
                          rows={2.5}
                          placeholder="اكتب فوائد ومميزات ومكونات هذا المنتج للعناية بالجسم..."
                          value={productForm.description_ar || ''}
                          onChange={(e) => setProductForm({ ...productForm, description_ar: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 resize-none text-right font-sans"
                        ></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="md:col-span-3 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {isEditingProduct ? 'Update Product Information' : 'Store and Publish Product'}
                    </button>
                  </form>

                  {/* List of current products in mini list */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Current Catalog items</h4>
                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950">
                      {products.map(p => (
                        <div key={p.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-900">
                          <div className="flex items-center gap-3">
                            <img src={p.image_url} alt={p.name} className="w-9 h-9 object-cover rounded bg-slate-900 border border-slate-800" />
                            <div>
                              <p className="font-bold text-slate-200">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{p.category} | ${p.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleProductEdit(p)}
                              className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded cursor-pointer"
                              title="Edit product info"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleProductDelete(p.id)}
                              className="p-1 px-2.5 bg-slate-800/80 hover:bg-rose-950 text-rose-450 rounded cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: CATEGORIES MANAGEMENT */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">Yummy Categories Control</h3>
                    <p className="text-xs text-slate-400 font-light">Structure the store categories layout</p>
                  </div>

                  <form onSubmit={handleCategorySubmit} className="p-4 bg-slate-850 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h4 className="md:col-span-2 text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                      {isEditingCategory ? 'EDIT ACTIVE CATEGORY' : 'CREATE CUSTOM CATEGORY'}
                    </h4>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono">Unique Identifier Slug (no spaces)</label>
                      <input
                        type="text"
                        required
                        disabled={isEditingCategory}
                        placeholder="e.g. crispy-chips"
                        value={categoryForm.id || ''}
                        onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 font-mono disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono">Display Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Crispy Crisps"
                        value={categoryForm.name || ''}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono flex items-center justify-between">
                        <span>Image Illustration URL or Local Uploader</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={categoryForm.image_url || ''}
                          onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500"
                        />
                        <label className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1 select-none rounded-lg text-xs cursor-pointer flex items-center justify-center font-bold text-slate-300">
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'category')}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {categoryForm.image_url && categoryForm.image_url.startsWith('data:') && (
                        <p className="text-[10px] text-emerald-400 font-mono">Local image loaded (Base64 ready)</p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold font-mono">Brief Description of items</label>
                      <input
                        type="text"
                        placeholder="Fine specialty candies or premium hand made delicacies..."
                        value={categoryForm.description || ''}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="md:col-span-2 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {isEditingCategory ? 'Update Category Information' : 'Publish Category'}
                    </button>
                  </form>

                  {/* List of categories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Current Store Categories</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map(c => (
                        <div key={c.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-200">{c.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {c.id}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCategoryEdit(c)}
                              className="p-1 px-2.5 bg-slate-905 hover:bg-slate-800 text-amber-350 border border-slate-800 rounded text-[11px] font-bold cursor-pointer transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCategoryDelete(c.id)}
                              className="p-1 px-2.5 bg-slate-900 hover:bg-rose-950 text-rose-450 border border-slate-800 rounded cursor-pointer transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: CUSTOMER ORDERS VIEW */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-white">Recipient Orders Log</h3>
                      <p className="text-xs text-slate-400">Review receipts and manage Cash on Delivery dispatches</p>
                    </div>
                    <button
                      onClick={loadAdminOrders}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reload Orders
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
                      <div className="text-slate-600 font-bold">No orders placed yet.</div>
                      <p className="text-[10px]">When customers place a checkout basket, orders log here instantly!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((o) => (
                        <div key={o.id} className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <div>
                              <span className="font-mono text-xs font-bold text-amber-400">{o.id}</span>
                              <span className="text-[10px] text-slate-400 ml-2">Synced {new Date(o.created_at).toLocaleString()}</span>
                            </div>
                            
                            {/* Toggle Order Status button */}
                            <button
                              onClick={() => handleOrderStatusToggle(o.id, o.status)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase cursor-pointer ${
                                o.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                o.status === 'Shipped' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse' :
                                o.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                'bg-rose-400/20 text-rose-300 border border-rose-400/30'
                              }`}
                            >
                              Status: {o.status} (Change)
                            </button>
                          </div>

                          {/* Recipient Coordinates */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                            <div>
                              <span className="text-slate-400 block font-mono">Recipient:</span>
                              <span className="font-bold text-slate-100">{o.customer_name}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-mono">Contact Call:</span>
                              <a href={`tel:${o.customer_phone}`} className="font-mono hover:underline text-amber-300">{o.customer_phone}</a>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-mono">Full Lebanon Address:</span>
                              <span className="text-slate-100">{o.customer_address}</span>
                            </div>
                          </div>

                          {/* Items included */}
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-xs">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Basket Contents</span>
                            <div className="divide-y divide-slate-900 max-h-32 overflow-y-auto">
                              {o.items && o.items.map((it, idx) => (
                                <div key={idx} className="py-1 flex justify-between">
                                  <span>{it.product?.name || 'Unnamed product'} <span className="text-slate-400">({it.weight_or_size || it.product?.weight_or_size || 'pk'})</span> x {it.quantity}</span>
                                  <span className="font-mono text-slate-300">${((it.product?.discount_price || it.product?.price || 0) * it.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-slate-900 mt-2 pt-2 text-right font-bold text-amber-400">
                              Total COD Collect: ${(o.total_discounted + (o.total_discounted > 0 ? 3.00 : 0.00)).toFixed(2)}
                            </div>
                          </div>

                          {o.notes && (
                            <div className="text-[11px] text-amber-300 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                              <span className="font-bold mr-1">Customer Note:</span> {o.notes}
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 4: SUPABASE SYNC AND CONFIGS */}
              {activeTab === 'sync' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-white">Supabase Cloud Database Sync</h3>
                    <p className="text-xs text-slate-400 font-light">Force backup your local database state directly to Supabase</p>
                  </div>

                  {/* Connection Details box */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 font-mono tracking-wider uppercase">Active Connection parameters</h4>
                    <div className="text-xs space-y-2 text-slate-350">
                      <p className="flex justify-between">
                        <span>Connected Project URL:</span>
                        <span className="font-mono text-slate-200 truncate max-w-sm selection:bg-amber-500 select-all">https://abvuqnuinvuyrruiluww.supabase.co</span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span>Database Status:</span>
                        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Ready & Active
                        </span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex justify-end gap-3">
                      <button
                        onClick={handleForceSync}
                        disabled={syncLoading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
                        {syncLoading ? 'Uploading state...' : 'Force Sync State to Supabase'}
                      </button>
                    </div>

                    {syncStatus && (
                      <div className={`p-3 rounded-lg flex items-center gap-2 text-xs ${
                        syncStatus.success 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                          : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                      }`}>
                        {syncStatus.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                        <span className="leading-relaxed">{syncStatus.msg}</span>
                      </div>
                    )}
                  </div>

                  {/* Copy SQL Schema section for first users */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400">Database Tables Instantiation SQL Script</h4>
                      <button
                        onClick={copySqlToClipboard}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] font-semibold text-amber-300 cursor-pointer"
                      >
                        {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSql ? 'Copied script!' : 'Copy SQL Schema'}
                      </button>
                    </div>
                    
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      If you haven't created the `yummy_` tables in your Supabase project yet, click the copy button above, 
                      head to your <a href="https://supabase.com" target="_blank" className="text-amber-400 hover:underline">Supabase Dashboard SQL Editor</a>, 
                      paste the schema script, and click "Run". This creates everything instantly with no 404/API errors.
                    </p>

                    <pre className="bg-slate-950 text-[10px] font-mono text-slate-300 p-4 border border-slate-850 rounded-xl overflow-x-auto max-h-52">
                      {SUPABASE_SQL_CREATION_SCHEMA.trim()}
                    </pre>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
