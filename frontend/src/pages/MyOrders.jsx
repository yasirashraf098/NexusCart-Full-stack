import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  processing: { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Package },
  shipped: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Truck },
  delivered: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  cancelled: { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
};

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order history.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded mb-8"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 bg-slate-200 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4 py-12 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">No Orders Placed Yet</h2>
        <p className="text-slate-500 text-sm mb-8">
          You haven't placed any orders with NexusCart yet.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const statusStyle = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const StatusIcon = statusStyle.icon;

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Order ID</span>
                  <p className="font-extrabold text-slate-900 font-mono text-sm">{order._id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusStyle.bg}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" /> {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {item.product?.name || 'Product Item'}
                        </p>
                        <p className="text-slate-400 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer details */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <p className="text-slate-500 max-w-md">
                  <strong className="text-slate-700">Ship to:</strong> {order.address?.fullName},{' '}
                  {order.address?.street}, {order.address?.city}
                </p>
                <div className="text-right w-full sm:w-auto">
                  <span className="text-slate-400 block text-[10px]">Total Amount</span>
                  <span className="text-lg font-black text-blue-600">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
