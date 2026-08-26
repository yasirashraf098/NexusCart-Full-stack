import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await API.get(`/orders/${id}/status`);
      setOrder(data);
    } catch (err) {
      console.error('Order fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center">
        
        {/* Animated Check Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
          Thank you for your purchase! We've received your order and sent a confirmation email with details.
        </p>

        {order && (
          <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-200/60 mb-8 space-y-4 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row justify-between border-b border-slate-200 pb-3 gap-2">
              <div>
                <span className="text-slate-400 block text-xs">Order ID</span>
                <span className="font-extrabold text-slate-900 font-mono">{order._id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Status</span>
                <span className="inline-flex px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 uppercase text-[10px]">
                  {order.status || 'pending'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-xs mb-1">Shipping Address</span>
              <p className="font-semibold text-slate-800">
                {order.address?.fullName}, {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipCode}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block text-xs mb-2">Items Ordered</span>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between font-medium text-slate-700">
                    <span>
                      {item.product?.name || 'Product'} × {item.quantity}
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="font-bold text-slate-800">Total Paid</span>
              <span className="text-lg font-black text-blue-600">
                ₹{order.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/orders"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};
