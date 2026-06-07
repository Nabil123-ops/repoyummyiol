export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
  category: string;
  price: number;
  discount_price?: number;
  image_url: string;
  is_flash_sale?: boolean;
  stock?: number;
  created_at?: string;
  rating?: number;
  weight_or_size?: string;
  slug?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: CartItem[];
  total_raw: number;
  total_discounted: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FlashSaleConfig {
  id: string;
  title: string;
  discount_target_percentage: number;
  end_time: string; // ISO string or specific future date
  is_active: boolean;
}
