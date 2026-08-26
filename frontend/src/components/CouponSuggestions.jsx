import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { Tag, Sparkles, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';

export const CouponSuggestions = ({ subtotal }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { appliedCoupon, applyCoupon } = useCart();

  useEffect(() => {
    fetchActiveCoupons();
  }, []);

  const fetchActiveCoupons = async () => {
    try {
      const { data } = await API.get('/coupons/active');
      setCoupons(data);
    } catch (err) {
      console.error('Failed to fetch coupons', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || coupons.length === 0) return null;

  const eligibleCoupons = coupons.filter(
    (c) => subtotal >= (c.minOrderAmount || 0)
  );
  const unlockableCoupons = coupons.filter(
    (c) => subtotal < (c.minOrderAmount || 0)
  );

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
          Suggested Coupons & Offers
        </h4>
      </div>

      {/* Eligible Coupons */}
      {eligibleCoupons.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            Ready to Apply ({eligibleCoupons.length})
          </span>
          {eligibleCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;

            return (
              <div
                key={coupon._id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isApplied
                    ? 'bg-emerald-100/60 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-900 font-mono text-xs uppercase tracking-wider">
                      {coupon.code}
                    </span>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : `Flat ₹${coupon.discountValue} OFF`}
                      {coupon.minOrderAmount > 0 && ` on orders above ₹${coupon.minOrderAmount}`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isApplied}
                  onClick={() => applyCoupon(coupon.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    isApplied
                      ? 'bg-emerald-600 text-white cursor-default flex items-center gap-1'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Unlockable Coupons */}
      {unlockableCoupons.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
            Add More Items to Unlock
          </span>
          {unlockableCoupons.map((coupon) => {
            const needed = coupon.minOrderAmount - subtotal;

            return (
              <div
                key={coupon._id}
                className="p-3 bg-white/70 border border-dashed border-amber-300 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-800 font-mono uppercase text-xs">
                      {coupon.code}
                    </span>
                    <p className="text-[11px] text-amber-800 font-semibold truncate">
                      Add <strong className="font-black">₹{needed.toLocaleString()}</strong> more to get{' '}
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} OFF`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
