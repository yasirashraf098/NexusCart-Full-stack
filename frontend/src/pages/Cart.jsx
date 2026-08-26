import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CouponSuggestions } from '../components/CouponSuggestions';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck, Tag, X, Check } from 'lucide-react';

export const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    itemsPrice,
    taxPrice,
    shippingPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    totalPrice,
  } = useCart();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const subtotalBeforeDiscount = itemsPrice + taxPrice + shippingPrice;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setApplying(true);
    await applyCoupon(couponInput);
    setApplying(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4 py-12 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
        >
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const freeShippingThreshold = 1500;
  const amountToFreeShipping = freeShippingThreshold - itemsPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Free Shipping Progress */}
          {amountToFreeShipping > 0 ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                Add <strong className="font-extrabold">₹{amountToFreeShipping.toLocaleString()}</strong> more to get Free Express Shipping!
              </span>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold">
              <Truck className="w-4 h-4 text-emerald-600" />
              You qualify for FREE Express Shipping!
            </div>
          )}

          {cartItems.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={product.imageURL || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider">
                    {product.category}
                  </span>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-slate-800 text-sm hover:text-blue-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                {/* Quantity buttons */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal for item */}
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
            Order Summary
          </h2>

          {/* Smart Coupon Auto-Suggestions */}
          <CouponSuggestions subtotal={subtotalBeforeDiscount} />

          {/* Coupon Code Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Promo / Coupon Code</label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-extrabold text-emerald-900 uppercase text-xs font-mono">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-[11px] text-emerald-700 block font-medium">
                      Saved ₹{discountAmount}
                    </span>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                  title="Remove Coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. NEXUS10, FLAT500"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={applying || !couponInput.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all disabled:bg-slate-300"
                >
                  {applying ? '...' : 'Apply'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">₹{itemsPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST Tax (18%)</span>
              <span className="font-bold text-slate-800">₹{taxPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Charge</span>
              <span className="font-bold text-slate-800">
                {shippingPrice === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `₹${shippingPrice}`
                )}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-extrabold text-slate-900">Grand Total</span>
              <span className="text-2xl font-black text-blue-600">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            Proceed to Checkout <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            256-bit Encrypted Checkout
          </div>
        </div>

      </div>
    </div>
  );
};
