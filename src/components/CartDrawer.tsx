import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Tag, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  // Real-world calculations
  const totalRaw = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalDiscounted = cart.reduce((sum, item) => {
    const finalPrice = item.product.discount_price && item.product.discount_price < item.product.price
      ? item.product.discount_price
      : item.product.price;
    return sum + (finalPrice * item.quantity);
  }, 0);

  const totalSaved = totalRaw - totalDiscounted;
  
  // $4 delivery fee, free delivery over $100
  const deliveryFee = totalDiscounted >= 100 || totalDiscounted === 0 ? 0.00 : 4.00;
  const grandTotal = totalDiscounted + deliveryFee;

  // Milestone triggers
  const giftThreshold = 50.00;
  const deliveryThreshold = 100.00;

  const hasUnlockedGift = totalDiscounted >= giftThreshold;
  const hasUnlockedDelivery = totalDiscounted >= deliveryThreshold;

  const giftPercentage = Math.min((totalDiscounted / giftThreshold) * 100, 100);
  const deliveryPercentage = Math.min((totalDiscounted / deliveryThreshold) * 100, 100);

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-55 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-out block */}
      <div id="cart-drawer-panel" className="relative w-full max-w-md h-full bg-white border-l border-pink-100 shadow-2xl flex flex-col animate-slide-left text-slate-800">
        
        {/* Header section */}
        <div className="p-5 border-b border-salmon-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5.5 h-5.5 text-salmon-500" />
            <h2 className="text-lg font-bold font-serif tracking-tight text-slate-800">Your Gourmet Basket</h2>
            <span className="bg-salmon-50 text-salmon-600 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button 
            id="close-cart-btn"
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-white hover:bg-salmon-50 text-salmon-500 border border-salmon-200 transition-all cursor-pointer shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length > 0 && (
            <div className="bg-salmon-50/40 border border-salmon-100/60 rounded-2xl p-4 space-y-3.5 mb-2 text-left">
              <h4 className="text-[11px] font-sans font-black uppercase text-salmon-600 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-current text-salmon-500" /> Yummy Campaign Milestones
              </h4>
              
              {/* Free Gift progress: Spend 50$ */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">🎁 Premium Free Gift</span>
                  <span className="font-mono text-[10px] font-bold text-salmon-700">
                    {hasUnlockedGift ? "UNLOCKED!" : `Add $${(giftThreshold - totalDiscounted).toFixed(2)}`}
                  </span>
                </div>
                <div className="w-full h-2 bg-salmon-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-salmon-500 to-salmon-600 rounded-full transition-all duration-500" 
                    style={{ width: `${giftPercentage}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-450 leading-none">
                  Spend <strong>${giftThreshold}</strong> or more to receive a complimentary luxury wellness gift!
                </p>
              </div>

              {/* Free delivery progress: Spend 100$ */}
              <div className="space-y-1 pt-2 border-t border-salmon-100/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">🚚 Free Lebanon Delivery</span>
                  <span className="font-mono text-[10px] font-bold text-salmon-700">
                    {hasUnlockedDelivery ? "UNLOCKED!" : `Add $${(deliveryThreshold - totalDiscounted).toFixed(2)}`}
                  </span>
                </div>
                <div className="w-full h-2 bg-salmon-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-salmon-300 to-salmon-500 rounded-full transition-all duration-500" 
                    style={{ width: `${deliveryPercentage}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-450 leading-none">
                  Spend <strong>${deliveryThreshold}</strong> to unlock absolutely free shipping all across Lebanon!
                </p>
              </div>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-salmon-50 flex items-center justify-center border border-salmon-100">
                <ShoppingBag className="w-7 h-7 text-salmon-300" />
              </div>
              <div>
                <p className="text-slate-800 font-bold">Your basket is empty!</p>
                <p className="text-xs text-slate-450 max-w-xs mt-1 leading-relaxed">
                  Add some of our delicious traditional Lebanese organic wellness imports.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold bg-white hover:bg-salmon-50 text-salmon-600 border border-salmon-200 hover:border-salmon-400 rounded-lg cursor-pointer transition-all shadow-sm"
              >
                Explore Items
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = item.product.discount_price && item.product.discount_price < item.product.price
                ? item.product.discount_price
                : item.product.price;
              const hasDiscount = item.product.discount_price && item.product.discount_price < item.product.price;

              return (
                <div 
                  key={item.product.id} 
                  id={`cart-item-${item.product.id}`}
                  className="flex items-center gap-4 p-3 bg-salmon-50/20 border border-salmon-100/60 rounded-xl"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-salmon-100 bg-salmon-50/10"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.product.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400 block">{item.product.weight_or_size || 'Standard pack'}</span>
                    
                    {/* Price with discount calculations */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-sm font-bold text-salmon-600 font-mono">${(itemPrice * item.quantity).toFixed(2)}</span>
                      {hasDiscount && (
                        <span className="text-[10px] line-through text-slate-400 font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity adjusters */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center bg-white border border-salmon-200 rounded-lg p-0.5 shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-salmon-600 hover:text-salmon-800 hover:bg-salmon-50 rounded cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-salmon-600 hover:text-salmon-800 hover:bg-salmon-50 rounded cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Footer with Pricing */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-salmon-100 bg-white space-y-4">
            
            <div className="space-y-2 text-sm text-slate-600 font-sans">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-medium">${totalRaw.toFixed(2)}</span>
              </div>
              
              {totalSaved > 0 && (
                <div className="flex justify-between text-salmon-600 text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-salmon-500" /> Special Flash Discounts
                  </span>
                  <span className="font-mono font-bold">-${totalSaved.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-salmon-500" /> Lebanon Delivery Fee
                </span>
                {deliveryFee === 0 ? (
                  <span className="font-mono text-salmon-600 font-bold uppercase text-[10px] tracking-wide">FREE</span>
                ) : (
                  <span className="font-mono">${deliveryFee.toFixed(2)}</span>
                )}
              </div>

              {totalDiscounted < deliveryThreshold && (
                <p className="text-[11px] text-salmon-600 text-left font-light bg-salmon-50/50 p-2 rounded-lg border border-salmon-100/50">
                  💡 Add <span className="font-bold">${(deliveryThreshold - totalDiscounted).toFixed(2)}</span> more to unlock <strong>FREE delivery</strong> (otherwise ${deliveryFee.toFixed(2)})!
                </p>
              )}

              {totalDiscounted >= giftThreshold && (
                <div className="bg-salmon-50 p-2.5 rounded-lg border border-salmon-100/80 flex items-center gap-2 text-left animate-pulse">
                  <span className="text-lg">🎁</span>
                  <div>
                    <p className="text-xs font-extrabold text-salmon-700">Free Premium Gift Earned!</p>
                    <p className="text-[10px] text-slate-500 font-light">A complimentary mystery wellness booster has been added to your parcel.</p>
                  </div>
                </div>
              )}

              <div className="border-t border-salmon-100 my-2 pt-2 flex justify-between text-base font-bold text-slate-900">
                <span>Total (Cash on Delivery)</span>
                <span className="font-mono text-salmon-600 text-lg">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="checkout-trigger-btn"
              onClick={onOpenCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-salmon-500 to-salmon-600 hover:from-salmon-400 hover:to-salmon-500 text-white font-bold rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <span className="block text-[10px] text-slate-400 text-center uppercase tracking-widest font-mono">
              Cash on Delivery (COD) across Lebanon
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
