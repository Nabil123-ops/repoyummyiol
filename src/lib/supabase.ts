import { createClient } from '@supabase/supabase-js';
import { Product, Category, Order } from '../types';

// Provided Supabase credentials
const DEFAULT_SUPABASE_URL = "https://abvuqnuinvuyrruiluww.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidnVxbnVpbnZ1eXJydWlsdXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTU4MjAsImV4cCI6MjA5NjEzMTgyMH0.lLL24QrozB_ItGC6O6WNVRdAZGVx3j_pZ7zPeueY2Hk";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL script template for the user to initialize tables on Supabase if not done already.
export const SUPABASE_SQL_CREATION_SCHEMA = `
-- Run this in your Supabase SQL Editor to verify or create the table structure:

CREATE TABLE IF NOT EXISTS yummy_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS yummy_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  image_url TEXT,
  is_flash_sale BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 50,
  rating NUMERIC DEFAULT 4.5,
  weight_or_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS yummy_orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_raw NUMERIC NOT NULL,
  total_discounted NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS yummy_configs (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);
`;

// Standard sample dataset representing premium cosmetics, skincare, and authentic beauty products ("Yummy Products LB")
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "body-care",
    name: "Body Care",
    description: "Yummy moisturizers and treats for your body",
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "face-care",
    name: "Face Care",
    description: "Glowing and rejuvenating facial serums and washes",
    image_url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "intimate-care",
    name: "Intimate Care",
    description: "Gentle, soothing care solutions",
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "hair-care",
    name: "Hair Care",
    description: "Silky and strong hair nourishing oils",
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "essential-oils",
    name: "Essential oils",
    description: "Pure natural scents and aromatherapy blends",
    image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "lips-lashes",
    name: "Lips & Lashes",
    description: "Plumping gloss and length booster serums",
    image_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "makhmariya",
    name: "Makhmariya",
    description: "Traditional long-lasting scented premium paste",
    image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "musk-al-tahara",
    name: "Musk Al Tahara",
    description: "Pure white musk fragrance of purity",
    image_url: "https://images.unsplash.com/photo-1547887537-6158d64c35e3?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "bath-bombs-soaps",
    name: "Bath Bombs & Soaps",
    description: "Fizzy bath bombs and organic artisanal bars",
    image_url: "https://images.unsplash.com/photo-1607006342411-1a2b3eba36b7?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "imported",
    name: "Imported",
    description: "World-famous handpicked beauty cosmetics",
    image_url: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "gentlemen",
    name: "Gentlemen",
    description: "Premium grooming, beard and facial oils for men",
    image_url: "https://images.unsplash.com/photo-1626015276681-2844c7754584?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "younger-products",
    name: "Younger Products",
    description: "Gentle sensitive solutions for youth skin",
    image_url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "candles",
    name: "Candles",
    description: "Soy wax scented luxury atmosphere candles",
    image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Premium cosmetic rollers, bags, and tools",
    image_url: "https://images.unsplash.com/photo-1576426863848-c2df407fbab3?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "sets",
    name: "Sets",
    description: "Premium self-care gift baskets and bundles",
    image_url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=500&q=80"
  }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Musk Al Tahara Pure White",
    name_ar: "مسك الطهارة الأبيض الفاخر الاصلي",
    description: "Natural organic pure white musk paste, elegant and fresh. Long-lasting scent for absolute purity and body refreshment.",
    description_ar: "مسك الطهارة الأبيض الملكي الفاخر الطبيعي لتعطير الجسم بنقاء فريد يدوم طويلاً ومثالي للاستخدام اليومي بعد الاستحمام",
    category: "musk-al-tahara",
    price: 15.00,
    discount_price: 10.00,
    image_url: "https://images.unsplash.com/photo-1547887537-6158d64c35e3?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: true,
    stock: 45,
    rating: 4.9,
    weight_or_size: "100g",
    slug: "premium-musk-al-tahara-pure-white"
  },
  {
    id: "2",
    name: "Royal Makhmariya Oud & Saffron Gold Balm",
    name_ar: "مخمرية العود والزعفران الملكية",
    description: "Silky smooth scented body balm with deep premium agarwood, rosewater, and luxury saffron extracts.",
    description_ar: "مخمرية العود والزعفران الملكية المعطرة لترطيب وتعطير الشعر والجسم بلمسة مخملية ونعومة فائقة مع روائح شرقية مذهلة",
    category: "makhmariya",
    price: 20.00,
    discount_price: 14.00,
    image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: true,
    stock: 30,
    rating: 4.8,
    weight_or_size: "50ml",
    slug: "royal-makhmariya-oud-saffron-gold"
  },
  {
    id: "3",
    name: "Glow Rosewater Hyaluronic Facial Serum",
    name_ar: "سيروم الورد والهيالورونيك لنضارة الوجه",
    description: "Lightweight collagen-boosting hydrating treatment infused with organic Lebanese white rose petal spray.",
    description_ar: "سيروم الورد الطبيعي الفائق الغني بحمض الهيالورونيك لترطيب عميق ونضارة وتوهج فوري ينعش خلايا البشرة ويعيد شبابها",
    category: "face-care",
    price: 18.05,
    discount_price: 12.00,
    image_url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: true,
    stock: 25,
    rating: 4.7,
    weight_or_size: "30ml",
    slug: "glow-rosewater-hyaluronic-facial-serum"
  },
  {
    id: "4",
    name: "Sweet Pomegranate Organic Body Butter",
    name_ar: "زبدة الجسم العضوية بنكهة الرمان",
    description: "Artisanal whipped shea and cocoa butter with pomegranate extracts for 48 hour extreme moisture hydration.",
    description_ar: "زبده الشيا والكاكاو المخفوقة العضوية بخلاصة الرمان الطبيعي لترطيب مكثف يدوم 48 ساعة يعطي نعومة خالية من الجفاف برائحة منعشة",
    category: "body-care",
    price: 22.05,
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: false,
    stock: 50,
    rating: 4.9,
    weight_or_size: "200ml",
    slug: "sweet-pomegranate-organic-body-butter"
  },
  {
    id: "5",
    name: "100% Pure Steam-Distilled Lavender Oil",
    name_ar: "زيت اللافندر الطبيعي النقي العطري",
    description: "Premium therapeutic grade lavender essential oil ideal for calming relaxation, sleep aid, and skincare drops.",
    description_ar: "زيت الخزامى (اللافندر) العطري الأساسي العضوي النقي مئة بالمئة المستخلص بالبخار ومثالي للاسترخاء والعناية بالبشرة وبصيلات الشعر",
    category: "essential-oils",
    price: 12.00,
    discount_price: 8.00,
    image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: true,
    stock: 40,
    rating: 4.6,
    weight_or_size: "15ml",
    slug: "steam-distilled-lavender-essential-oil"
  },
  {
    id: "6",
    name: "Strawberry Plumping Lip Glow Balm",
    name_ar: "مرطب الفراولة لتلميع الشفاه",
    description: "Nourishing strawberry elixir formulated to maximize hydration, adding a glossy finish and a gorgeous plump outline.",
    description_ar: "مرطب شفاه فاخر بنكهة الفراولة الطبيعية لترطيب مكثف يمنح الشفاه لمعاناً مذهلاً ومظهراً ممتلئاً وجذاباً طوال اليوم",
    category: "lips-lashes",
    price: 9.99,
    discount_price: 6.50,
    image_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: true,
    stock: 75,
    rating: 4.8,
    weight_or_size: "10ml",
    slug: "strawberry-plumping-lip-glow-balm"
  },
  {
    id: "7",
    name: "Golden Silk Organic Argan Hair Treatment",
    name_ar: "سيروم زيت الأرجان الذهبي للشعر",
    description: "Cold-pressed authentic Moroccan argan hair serum fortified with keratin, rebuilding dry splits, and providing soft shine.",
    description_ar: "علاج الشعر بزيت الأرجان المغربي العضوي المعزز بالكيراتين لتغذية الجذور وإصلاح الشعر التالف ليمنحه اللمعان والنعومة الفائقة",
    category: "hair-care",
    price: 19.50,
    discount_price: 14.00,
    image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: false,
    stock: 35,
    rating: 4.9,
    weight_or_size: "80ml",
    slug: "golden-silk-organic-argan-hair-treatment"
  },
  {
    id: "8",
    name: "Lavender Lavender Dream Scented Soy Candle",
    name_ar: "شمعة جاسمين الصويا الفاخرة لتعطير المنزل",
    description: "Premium soy wax container candle loaded with high-grade organic calming lavender extracts and french essences.",
    description_ar: "شمعة الصويا الطبيعية الفاخرة بخلاصة اللافندر والزيوت الفرنسية لإضفاء لمسة جمالية وهدوء واسترخاء في أرجاء المنزل",
    category: "candles",
    price: 16.00,
    discount_price: 11.50,
    image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: true,
    stock: 20,
    rating: 4.7,
    weight_or_size: "250g",
    slug: "lavender-dream-scented-soy-candle"
  },
  {
    id: "9",
    name: "Amethyst Double Facial Stone Roller",
    name_ar: "دبل رولر الجمشت الطبيعي لتدليك الوجه",
    description: "Handcrafted real amethyst gemstone facial roller, soothing skin fatigue, promoting micro-circulation, and calming puffiness.",
    description_ar: "أداة تدليك البشرة المزدوجة المصنوعة من حجر الجمشت الأرجواني الطبيعي لتخفيف تعب الوجه وتنشيط الخلايا وتقليل التجاعيد",
    category: "accessories",
    price: 24.00,
    discount_price: 18.00,
    image_url: "https://images.unsplash.com/photo-1576426863848-c2df407fbab3?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: false,
    stock: 12,
    rating: 4.9,
    weight_or_size: "1 Pcs",
    slug: "amethyst-double-facial-stone-roller"
  },
  {
    id: "10",
    name: "Luxury Rosehip Sensual Intimate Gentle Wash",
    name_ar: "غسول الورد اللطيف للمناطق الحساسة",
    description: "Natural organic intimate soap infused with chamomile extracts and wild rose oil, supporting proper daily skin harmony.",
    description_ar: "غسول الورد الطبيعي الآمن والمصمم للعناية اليومية المهدئة وتوفير نظافة ممتازة ورائحة ناعمة لا تسبب الحساسية",
    category: "intimate-care",
    price: 14.50,
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: false,
    stock: 28,
    rating: 4.6,
    weight_or_size: "200ml",
    slug: "luxury-rosehip-sensual-intimate-gentle-wash"
  },
  {
    id: "11",
    name: "Sandalwood Gentlemen Premium Beard Conditioning Oil",
    name_ar: "زيت صندل لتنعيم لحية الرجال",
    description: "Conditioning organic elixir loaded with rich vitamin E and cold-pressed sandalwood scent for elegant facial care.",
    description_ar: "زيت فاخر ومغذي غني بفيتامين هـ وخلاصة خشب الصندل العطري لترطيب وتنعيم لحية الرجال وإعطائها لمعاناً كلاسيكياً",
    category: "gentlemen",
    price: 15.50,
    discount_price: 11.00,
    image_url: "https://images.unsplash.com/photo-1626015276681-2844c7754584?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: true,
    stock: 40,
    rating: 4.8,
    weight_or_size: "30ml",
    slug: "sandalwood-gentlemen-beard-oil"
  },
  {
    id: "12",
    name: "Organic Belgian Cocoa Scented Body Scrub",
    name_ar: "مقشر الكاكاو البلجيكي الفاخر للجسم",
    description: "Luxurious exfoliating scrub with imported Belgian cocoa bean grounds and sweet almond oil, removing dry skin layers.",
    description_ar: "مقشر للجسم غني بحبيبات الكاكاو البلجيكية الفاخرة وزيت اللوز الحلو لمنح بشرتك تقشيراً لطيفاً وترطيباً حريرياً فائقاً",
    category: "imported",
    price: 17.00,
    discount_price: 13.00,
    image_url: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: false,
    stock: 30,
    rating: 4.5,
    weight_or_size: "150g",
    slug: "organic-belgian-cocoa-body-scrub"
  },
  {
    id: "13",
    name: "Royal Rosewood & Gold Gift Basket Set",
    name_ar: "صندوق الهدايا الفاخر بالورد والذهب",
    description: "Curated premium aromatherapy collection with body oil, bath bombs, white musk, and luxury scented candle bundle.",
    description_ar: "صندوق هدايا ملكي أنيق يحتوي على زيت المساج الفاخر، صابون الورد الطبيعي، مسك الطهارة، وشمعة معطرة لتقديمها كهدية مذهلة",
    category: "sets",
    price: 49.00,
    discount_price: 39.00,
    image_url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: false,
    stock: 15,
    rating: 5.0,
    weight_or_size: "Large Bundle",
    slug: "royal-rosewood-gold-gift-basket-set"
  },
  {
    id: "14",
    name: "Lavender Fizzy Botanical Bath Soap Bomb",
    name_ar: "فوارة حوض الاستحمام باللافندر المعطر",
    description: "Premium effervescent organic bath bomb with lavender flower petals, releasing soothing coconut oil and essential extracts.",
    description_ar: "فوارة الاستحمام العضوية باللافندر لتجربة استرخاء ملوكية غنية بزيت جوز الهند العضوي وبتلات الزهور المهدئة للأعصاب",
    category: "bath-bombs-soaps",
    price: 6.50,
    discount_price: 4.50,
    image_url: "https://images.unsplash.com/photo-1607006342411-1a2b3eba36b7?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: true,
    stock: 120,
    rating: 4.8,
    weight_or_size: "120g",
    slug: "lavender-fizzy-botanical-bath-bomb"
  },
  {
    id: "15",
    name: "Baby Soft Sweet Almond Gentle Cream",
    name_ar: "كريم اللوز الطبيعي لبشرة الأطفال الحساسة",
    description: "Hypoallergenic sensitive skin formula blended with chamomile spray and cold-pressed pure sweet almond oil.",
    description_ar: "كريم اللوز الطبيعي اللطيف والمصمم لحماية وترطيب بشرة الأطفال والرضع الحساسة وحمايتها من الجفاف والاحمرار",
    category: "younger-products",
    price: 13.00,
    image_url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80",
    is_flash_sale: false,
    stock: 50,
    rating: 4.7,
    weight_or_size: "100ml",
    slug: "baby-soft-sweet-almond-gentle-cream"
  }
];

// Helper functions with dynamic schema mapping to import and synchronize ALL tables shown in image.png:
// 'all_products', 'products', 'online_store_products', 'categories', 'subcategories', 'profiles'

function mapDBRowToProduct(row: any): Product {
  const id = String(row.id || row.product_id || row.id_key || row.uid || Math.random().toString());
  const name = String(row.product_name || row.name || row.title || row.label || "Premium Product");
  
  let rawDescription = String(row.description || row.desc || row.details || row.summary || "");
  let description = rawDescription;
  let description_ar = row.description_ar || row.arabic_description || row.desc_ar || row.arabic_desc || row.descriptionAr || undefined;
  let name_ar = row.name_ar || row.arabic_name || row.title_ar || row.arabic_title || row.nameAr || undefined;
  
  // Align categories with slug/subcategory matching
  const category = String(row.subcategory || row.slug || row.category || row.category_id || row.cat || "body-care").toLowerCase().trim();

  // Smart splitting for description strings containing both English and Arabic separated by newlines
  if (rawDescription.includes('\n')) {
    const parts = rawDescription.split('\n').map(p => p.trim()).filter(Boolean);
    // Find first non-empty part that starts with "Yummy" or is primarily English
    const englishPart = parts.find(p => !/[\u0600-\u06FF]/.test(p) && !p.includes('??'));
    if (englishPart) {
      description = englishPart;
    } else if (parts[0]) {
      description = parts[0];
    }
    
    // Find any line that has Arabic characters or has question marks that indicate corrupted Arabic text
    if (!description_ar) {
      const arabicPart = parts.find(p => /[\u0600-\u06FF]/.test(p) || (p.includes('??') && p !== englishPart));
      if (arabicPart) {
        description_ar = arabicPart;
      }
    }
  }

  // Parse price: look for price_before first (which in online_store_products is the base price), otherwise price/cost
  let price = Number(row.price_before !== undefined && row.price_before !== null ? row.price_before : (row.price !== undefined ? row.price : (row.cost || 10.00)));
  if (isNaN(price)) price = 10.00;

  // Parse discount_price (in online_store_products, price_after is the promotional/active price)
  let discount_price = undefined;
  const priceAfter = row.price_after !== undefined && row.price_after !== null ? Number(row.price_after) : undefined;
  if (priceAfter !== undefined && !isNaN(priceAfter) && priceAfter > 0 && priceAfter < price) {
    discount_price = priceAfter;
  } else {
    const dVal = row.discount_price !== undefined ? row.discount_price : (row.discounted_price || row.discount || row.sale_price);
    if (dVal !== undefined && dVal !== null) {
      const val = Number(dVal);
      if (!isNaN(val) && val > 0 && val < price) {
        discount_price = val;
      }
    }
  }

  // Parse image_url
  const image_url = String(row.image_url || row.image || row.image_path || row.img || row.img_url || "https://images.unsplash.com/photo-1599490659213-e2b9527ec087?q=80&w=600&auto=format&fit=crop");

  // Parse other attributes
  // In the real products table, if name/category is Flash Sale or discount exists, it defaults to flash sale
  const is_flash_sale = Boolean(row.is_flash_sale !== undefined ? row.is_flash_sale : (row.flash || row.on_sale || category === 'flash-sale' || discount_price !== undefined));
  const stock = Number(row.stock !== undefined ? row.stock : (row.quantity || row.inventory || row.stock_quantity || 50));
  const rating = Number(row.rating !== undefined ? row.rating : (row.stars || row.rate || 4.5));
  const weight_or_size = String(row.weight_or_size || row.size || row.weight || row.unit || "");
  const slug = row.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  // Generate a beautiful, clean localized Arabic subtitle and description fallback based on the category if missing/corrupted
  if (!name_ar || name_ar.includes("??") || name_ar.includes("؟؟")) {
    const slugKey = category.toLowerCase();
    const catArMapping: Record<string, string> = {
      "accessories": "إكسسوارات العناية الفاخرة",
      "makhmaria": "مخمرية العطور الشرقية الفاخرة",
      "bath-bombs-soaps": "كرات الاستحمام والصابون الطبيعي",
      "body-care": "منتجات العناية الفائقة بالجسم",
      "candles": "شموع الصويا الفاخرة المعطرة",
      "face-care": "مستحضرات العناية والترطيب للوجه",
      "flash-sale": "تخفيضات العروض الحصرية الكبرى",
      "gentlemen": "مستحضرات العناية الرجالية الفاخرة",
      "hair-care": "زيوت مغذية للعناية بالشعر",
      "lips-eyebrows-and-lashes": "سيروم تكثيف الشفاه والرموش",
      "intimate-care": "منتجات العناية الشخصية اللطيفة",
      "misk-el-tahara": "مسك الطهارة الأصلي الفاخر",
      "oils-serums-essences": "زيوت وسيروم النضارة الطبيعي",
      "younger": "منتجات لطيفة للبشرة الشابة الحساسة"
    };
    name_ar = catArMapping[slugKey] || "منتج تجميل طبيعي فاخر";
  }

  if (!description_ar || description_ar.includes("??") || description_ar.includes("؟؟")) {
    const slugKey = category.toLowerCase();
    const descArMapping: Record<string, string> = {
      "accessories": "أدوات وإكسسوارات تجميلية طبيعية مخصصة للمحافظة على نضارة ونعومة البشرة يومياً.",
      "makhmaria": "مخمرية مغذية ومعطرة للجسم والشعر بتركيبة زيتية طبيعية تدوم لساعات طويلة بنفحات شرقية ساحرة.",
      "bath-bombs-soaps": "صابون عضوي طبيعي وكرات استحمام فوارة غنية بالزيوت العطرية والترطيب العميق لتجربة استحمام مريحة.",
      "body-care": "لوشن كريمي غني بالعناصر الطبيعية لتغذية بشرة الجسم وحمايتها من الجفاف بعبق عطري فاخر.",
      "candles": "شمعة صويا طبيعية 100% معطرة بزيوت أساسية مهدئة ومصممة لخلق أجواء دافئة ومميزة وراحة مطلقة في المنزل.",
      "face-care": "سيروم مغذي وكريم مرطب مصمم لتوحيد لون البشرة ومكافحة التجاعيد وإظهار توهج الوجه الطبيعي.",
      "flash-sale": "عروض وتخفيضات حصرية مذهلة ولفترة محدودة للغاية على أرقى مستحضرات التجميل والعناية بالجسم والبشرة.",
      "gentlemen": "زيوت ومستحضرات خاصة للعناية الكاملة باللحية وبشرة الوجه للرجال بتركيبة ممتازة وسريعة الامتصاص.",
      "hair-care": "علاج مكثف لتغذية بصيلات الشعر وتنعيمه وحمايته من التلف والتساقط باستخدام مستخلصات زيوت طبيعية 100%.",
      "lips-eyebrows-and-lashes": "تركيبة مغذية بزيوت الفيتامينات الأساسية لتكثيف وتقوية الرموش وترطيب الشفاه ومضاعفة جاذبيتها.",
      "intimate-care": "غسول ناعم مهدئ ولطيف تم اختباره طبياً ومصمم خصيصاً للمناطق الحساسة لتأمين الحماية والانتعاش.",
      "misk-el-tahara": "مسك الطهارة الأبيض الفاخر الأصلي لتعطير الجسم بنقاء مميز ورائحة عطرة وجاذبية تدوم طوال اليوم.",
      "oils-serums-essences": "مستخلصات زيوت وسيروم نقية مئة بالمئة لتفتيح خلايا الجلد وحمايتها بلمعان طبيعي لا يضاهى.",
      "younger": "منتجات فائقة اللطف ومصممة خصيصاً لتناسب البشرة الحساسة لليافعين والأطفال وتعمل على ترطيبها وحمايتها."
    };
    description_ar = descArMapping[slugKey] || "مستحضرات تجميلية فاخرة وطبيعية للعناية المتكاملة بجمالك وتألقك يومياً بأعلى جودة.";
  }

  return {
    id,
    name,
    name_ar: name_ar ? String(name_ar) : undefined,
    description,
    description_ar: description_ar ? String(description_ar) : undefined,
    category,
    price,
    discount_price,
    image_url,
    is_flash_sale,
    stock: isNaN(stock) ? 50 : stock,
    rating: isNaN(rating) ? 4.5 : rating,
    weight_or_size,
    slug
  };
}

function mapDBRowToCategory(row: any): Category {
  // Use slug as primary key slug mapping for seamless join with subcategories
  const id = String(row.slug || row.id || row.category_id || row.cat || row.name?.toLowerCase().replace(/\s+/g, '-') || "category-id").toLowerCase().trim();
  const name = String(row.name || row.title || row.category_name || row.label || "Gourmet Selection");
  
  // Find matching default category to merge premium Unsplash photographs and descriptions
  const defaultMatch = DEFAULT_CATEGORIES.find(dc => dc.id === id || dc.id === row.slug || dc.name?.toLowerCase() === name.toLowerCase());

  const description = String(row.description || row.desc || defaultMatch?.description || "");
  const image_url = String(row.image_url || row.image || row.img || defaultMatch?.image_url || "https://images.unsplash.com/photo-1599490659213-e2b9527ec087?q=80&w=600&auto=format&fit=crop");

  return {
    id,
    name,
    description,
    image_url
  };
}

export async function getProducts(): Promise<Product[]> {
  const allFoundProducts: Map<string, Product> = new Map();
  const tableNames = ['online_store_products', 'all_products', 'products', 'yummy_products'];

  const queryTable = async (tableName: string) => {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn(`Querying table "${tableName}" failed:`, e);
    }
    return [];
  };

  try {
    // Race database queries with a 12-second hard timeout to avoid page loading freezes
    const results = await Promise.race([
      Promise.all(tableNames.map(name => queryTable(name))),
      new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("Supabase select timeout")), 12000))
    ]);

    results.forEach(data => {
      if (data && data.length > 0) {
        data.forEach(row => {
          const p = mapDBRowToProduct(row);
          // Deduplicate by lowercased name or slug to avoid doubling rows with and without encoding defects
          const duplicateKey = (p.slug || p.name).toLowerCase().trim();
          if (!allFoundProducts.has(duplicateKey)) {
            allFoundProducts.set(duplicateKey, p);
          }
        });
      }
    });
  } catch (err) {
    console.warn("Supabase products query timed out or failed, falling back to local defaults:", err);
  }

  // If we collected any products from Supabase, return them
  if (allFoundProducts.size > 0) {
    return Array.from(allFoundProducts.values());
  }

  // Otherwise, fallback to local storage / default set
  const local = localStorage.getItem('yummy_products');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      // Ignore parse failure and fall through
    }
  }
  localStorage.setItem('yummy_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

export async function getCategories(): Promise<Category[]> {
  const allFoundCategories: Map<string, Category> = new Map();
  const tableNames = ['categories', 'subcategories', 'yummy_categories'];

  const queryTable = async (tableName: string) => {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn(`Querying table "${tableName}" failed:`, e);
    }
    return [];
  };

  try {
    // Race database queries with a 12-second hard timeout
    const results = await Promise.race([
      Promise.all(tableNames.map(name => queryTable(name))),
      new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("Supabase categories select timeout")), 12000))
    ]);

    results.forEach((data, index) => {
      const tableName = tableNames[index];
      if (data && data.length > 0) {
        data.forEach(row => {
          const c = mapDBRowToCategory(row);
          if (tableName === 'subcategories') {
            if (!allFoundCategories.has(c.id)) {
              allFoundCategories.set(c.id, c);
            }
          } else {
            allFoundCategories.set(c.id, c);
          }
        });
      }
    });
  } catch (err) {
    console.warn("Supabase categories query timed out or failed, falling back to local defaults:", err);
  }

  if (allFoundCategories.size > 0) {
    return Array.from(allFoundCategories.values());
  }

  const local = localStorage.getItem('yummy_categories');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      // Ignore parse failure and fall through
    }
  }
  localStorage.setItem('yummy_categories', JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
}

export async function getOrders(): Promise<Order[]> {
  // Query yummy_orders or local storage
  try {
    const { data, error } = await supabase
      .from('yummy_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      return data as Order[];
    }
  } catch (err) {
    console.warn("Using local orders fallback:", err);
  }

  const local = localStorage.getItem('yummy_orders');
  return local ? JSON.parse(local) : [];
}

function formatProductForTable(product: Product, tableName: string): any {
  if (tableName === 'online_store_products' || tableName === 'all_products') {
    const capitalizedCategory = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    return {
      id: isNaN(Number(product.id)) ? Math.floor(Math.random() * 100000) : Number(product.id),
      product_name: product.name,
      price_before: product.price,
      price_after: product.discount_price || null,
      category: capitalizedCategory,
      subcategory: product.category,
      description: product.description,
      image_url: product.image_url
    };
  }
  
  if (tableName === 'products') {
    return {
      id: isNaN(Number(product.id)) ? product.id : Number(product.id),
      name: product.name,
      price: product.price,
      discount_price: product.discount_price || null,
      category: product.category,
      description: product.description,
      image_url: product.image_url,
      is_flash_sale: product.is_flash_sale || false,
      stock: product.stock !== undefined ? product.stock : 50,
      rating: product.rating !== undefined ? product.rating : 4.5,
      weight_or_size: product.weight_or_size || ""
    };
  }

  return product;
}

function formatCategoryForTable(category: Category, tableName: string): any {
  if (tableName === 'categories') {
    return {
      id: isNaN(Number(category.id)) ? Math.floor(Math.random() * 100000) : Number(category.id),
      name: category.name,
      slug: category.id
    };
  }
  return category;
}

export async function saveProduct(product: Product): Promise<boolean> {
  let success = false;
  
  // Attempt to save to all products tables in Supabase to keep them in sync
  const targetTables = ['online_store_products', 'all_products', 'products', 'yummy_products'];
  for (const table of targetTables) {
    try {
      const dbRow = formatProductForTable(product, table);
      const { error } = await supabase.from(table).upsert(dbRow);
      if (!error) {
        success = true;
      } else {
        console.warn(`Error writing to table "${table}":`, error);
      }
    } catch (e) {
      console.warn(`Query to table "${table}" caught error:`, e);
    }
  }

  // Always update local storage
  const current = await getProducts();
  const index = current.findIndex(p => String(p.id) === String(product.id));
  if (index >= 0) {
    current[index] = product;
  } else {
    current.push(product);
  }
  localStorage.setItem('yummy_products', JSON.stringify(current));
  return success;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  let success = false;
  const targetTables = ['online_store_products', 'all_products', 'products', 'yummy_products'];
  const filterIdNum = isNaN(Number(productId)) ? null : Number(productId);
  
  for (const table of targetTables) {
    try {
      // Use numeric id for online_store_products / all_products, or string id where appropriate
      const idToFilter = (table === 'online_store_products' || table === 'all_products') && filterIdNum !== null 
        ? filterIdNum 
        : productId;

      const { error } = await supabase.from(table).delete().eq('id', idToFilter);
      if (!error) {
        success = true;
      }
    } catch {
      // Quietly continue
    }
  }

  const current = await getProducts();
  const updated = current.filter(p => String(p.id) !== String(productId));
  localStorage.setItem('yummy_products', JSON.stringify(updated));
  return success;
}

export async function saveCategory(category: Category): Promise<boolean> {
  let success = false;
  const targetTables = ['categories', 'subcategories', 'yummy_categories'];
  for (const table of targetTables) {
    try {
      const dbRow = formatCategoryForTable(category, table);
      const { error } = await supabase.from(table).upsert(dbRow);
      if (!error) {
        success = true;
      }
    } catch {
      // Quietly continue
    }
  }

  const current = await getCategories();
  const index = current.findIndex(c => String(c.id) === String(category.id));
  if (index >= 0) {
    current[index] = category;
  } else {
    current.push(category);
  }
  localStorage.setItem('yummy_categories', JSON.stringify(current));
  return success;
}

export async function deleteCategory(categoryId: string): Promise<boolean> {
  let success = false;
  const targetTables = ['categories', 'subcategories', 'yummy_categories'];
  const filterIdNum = isNaN(Number(categoryId)) ? null : Number(categoryId);

  for (const table of targetTables) {
    try {
      const idToFilter = table === 'categories' && filterIdNum !== null 
        ? filterIdNum 
        : categoryId;

      const { error } = await supabase.from(table).delete().eq('id', idToFilter);
      if (!error) {
        success = true;
      }
    } catch {
      // Quietly continue
    }
  }

  const current = await getCategories();
  const updated = current.filter(c => String(c.id) !== String(categoryId));
  localStorage.setItem('yummy_categories', JSON.stringify(updated));
  return success;
}

export async function createOrder(order: Order): Promise<boolean> {
  let success = false;
  try {
    const { error } = await supabase.from('yummy_orders').insert(order);
    if (!error) success = true;
  } catch (err) {
    console.error("Supabase insert order error:", err);
  }

  const current = await getOrders();
  current.unshift(order);
  localStorage.setItem('yummy_orders', JSON.stringify(current));
  return success;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  let success = false;
  try {
    const { error } = await supabase.from('yummy_orders').update({ status }).eq('id', orderId);
    if (!error) success = true;
  } catch (err) {
    console.error("Supabase order status update error:", err);
  }

  const current = await getOrders();
  const index = current.findIndex(o => o.id === orderId);
  if (index >= 0) {
    current[index].status = status;
    localStorage.setItem('yummy_orders', JSON.stringify(current));
  }
  return success;
}

// Force a full synchronization: upload local data to Supabase if Supabase is alive
export async function syncLocalToSupabase(): Promise<{ productsSynced: number, categoriesSynced: number, error?: string }> {
  try {
    const localProducts = JSON.parse(localStorage.getItem('yummy_products') || '[]');
    const localCategories = JSON.parse(localStorage.getItem('yummy_categories') || '[]');

    let prodCount = 0;
    let catCount = 0;

    // Push categories to all categories tables that are accessible
    const catTables = ['categories', 'yummy_categories'];
    for (const table of catTables) {
      if (localCategories.length > 0) {
        try {
          const { error } = await supabase.from(table).upsert(localCategories);
          if (!error) catCount = localCategories.length;
        } catch (e) {
          // Continue to next
        }
      }
    }

    // Push products to all products tables that are accessible
    const prodTables = ['online_store_products', 'all_products', 'products', 'yummy_products'];
    for (const table of prodTables) {
      if (localProducts.length > 0) {
        try {
          const { error } = await supabase.from(table).upsert(localProducts);
          if (!error) prodCount = localProducts.length;
        } catch (e) {
          // Continue to next
        }
      }
    }

    return { productsSynced: prodCount, categoriesSynced: catCount };
  } catch (err: any) {
    console.error("Full Sync failed:", err);
    return { productsSynced: 0, categoriesSynced: 0, error: err.message || "Failed to sync tables in Supabase." };
  }
}
