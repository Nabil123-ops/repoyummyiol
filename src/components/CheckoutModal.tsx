import React, { useState } from 'react';
import { X, CheckCircle, Package, MapPin, Phone, User, Notebook, Landmark } from 'lucide-react';
import { CartItem, Order } from '../types';
import { createOrder } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onClearCart: () => void;
}

export default function CheckoutModal({ isOpen, onClose, cart, onClearCart }: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Calculators
  const totalRaw = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalDiscounted = cart.reduce((sum, item) => {
    const finalPrice = item.product.discount_price && item.product.discount_price < item.product.price
      ? item.product.discount_price
      : item.product.price;
    return sum + (finalPrice * item.quantity);
  }, 0);
  
  // $4 delivery fee, free delivery over $100
  const deliveryFee = totalDiscounted >= 100 || totalDiscounted === 0 ? 0.00 : 4.00;
  const grandTotal = totalDiscounted + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Please check that Name, Lebanon Phone Number, and Address are entered.");
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: "YUMMY-" + Math.floor(100000 + Math.random() * 900000),
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      items: cart,
      total_raw: totalRaw,
      total_discounted: totalDiscounted,
      status: 'Pending',
      notes: notes,
      created_at: new Date().toISOString()
    };

    try {
      await createOrder(newOrder);
      setOrderSuccess(newOrder);
      onClearCart();
    } catch (err) {
      console.error(err);
      alert("Error processing order. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in text-slate-800">
      <div id="checkout-modal-panel" className="relative w-full max-w-lg bg-white border border-pink-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        
        {/* Header section */}
        <div className="p-5 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-bold font-serif text-slate-800">Lebanon Cash On Delivery</h2>
          </div>
          <button 
            id="close-checkout-btn"
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-500 hover:text-pink-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success state */}
        {orderSuccess ? (
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto border border-pink-100">
              <CheckCircle className="w-9 h-9" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-serif text-slate-800">Order Placed Successfully!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for shopping with Yummy Products Lebanon. Your order ID is <span className="font-mono text-pink-605 font-bold">{orderSuccess.id}</span>.
              </p>
            </div>

            {/* Recipient breakdown receipt */}
            <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100/60 text-left text-xs space-y-2 max-w-md mx-auto">
              <div>
                <span className="text-slate-400 font-mono">Recipient:</span>
                <span className="float-right font-semibold text-slate-800">{orderSuccess.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Phone call backup:</span>
                <span className="float-right font-semibold text-slate-800">{orderSuccess.customer_phone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Destination:</span>
                <span className="float-right font-semibold text-slate-800 truncate max-w-[200px]" title={orderSuccess.customer_address}>{orderSuccess.customer_address}</span>
              </div>
              <div className="border-t border-pink-100 my-1.5 pt-1.5 flex justify-between font-bold text-sm text-pink-600">
                <span>COD total to pay:</span>
                <span>${(orderSuccess.total_discounted + deliveryFee).toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-relaxed">
              Our regional delivery driver will call your phone soon to verify before delivery. Fast 2-3 days dispatch.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4 text-slate-850">
            
            {/* Short review of summary */}
            <div className="p-3 bg-pink-50/50 border border-pink-100/50 rounded-xl flex items-center justify-between text-xs text-slate-700">
              <span>Basket Subtotal ({cart.length} unique items)</span>
              <span className="font-mono font-bold text-pink-600">
                ${totalDiscounted.toFixed(2)} + {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`} delivery = <span className="text-pink-650 h-5 inline-block font-black">${grandTotal.toFixed(2)}</span>
              </span>
            </div>

            {/* Customer Name */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-500" /> Recipient Name
              </label>
              <input
                id="recipient-name"
                type="text"
                required
                placeholder="e.g. Nabil Dahdouh"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-pink-50/20 border border-pink-100 rounded-xl px-4.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-300"
              />
            </div>

            {/* Customer Lebanon Phone */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-pink-500" /> Lebanese Phone Number
              </label>
              <input
                id="recipient-phone"
                type="tel"
                required
                placeholder="e.g. +961 71 234 567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-pink-50/20 border border-pink-100 rounded-xl px-4.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-300 font-mono"
              />
              <span className="text-[10px] text-slate-400 block font-light">
                Our support team logs this number for quick verification before shipping.
              </span>
            </div>

            {/* Address */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-500" /> Delivery Address (Lebanon)
              </label>
              <textarea
                id="recipient-address"
                required
                rows={3}
                placeholder="e.g. Beirut, Hamra Street, Al-Safeer Building, 4th Floor"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full bg-pink-50/20 border border-pink-100 rounded-xl px-4.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-300 resize-none"
              ></textarea>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Notebook className="w-3.5 h-3.5 text-pink-550" /> Delivery Notes (Optional)
              </label>
              <input
                id="recipient-notes"
                type="text"
                placeholder="e.g. Leave with security, or ring bell."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-pink-50/20 border border-pink-100 rounded-xl px-4.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-300"
              />
            </div>

            {/* COD badge */}
            <div className="flex items-center gap-3 p-3 bg-pink-50 border border-pink-100 rounded-xl">
              <Landmark className="w-6 h-6 text-pink-600" />
              <div className="text-left text-xs">
                <p className="font-bold text-slate-800">Payment Method: Cash On Delivery</p>
                <p className="text-slate-500 font-light text-[11px]">Pay the delivery courier in USD or LBP at the daily market rate upon receipt.</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-pink-50 hover:bg-pink-100 rounded-xl font-bold text-pink-600 text-sm cursor-pointer border border-pink-100"
              >
                Go Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 font-bold text-white rounded-xl text-sm transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Sending Order...' : `Confirm Order ($${grandTotal.toFixed(2)})`}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
