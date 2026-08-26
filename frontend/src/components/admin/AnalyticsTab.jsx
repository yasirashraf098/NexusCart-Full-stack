import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, RefreshCw } from 'lucide-react';

export const AnalyticsTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/analytics');
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center max-w-md mx-auto">
        <p className="font-bold text-sm mb-2">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Total Revenue
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% this month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Total Orders
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              {stats?.totalOrders || 0}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-2">
              Completed & Active
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Store Products
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              {stats?.totalProducts || 0}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 mt-2">
              In Catalog
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Customers
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              {stats?.totalUsers || 0}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 mt-2">
              Registered Users
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Visual Summary Box */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black mb-2">NexusCart Analytics Overview</h3>
          <p className="text-slate-300 text-sm max-w-xl">
            Real-time performance tracking for catalog, user registrations, revenue generation, and order fulfillment status.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="px-5 py-2.5 rounded-2xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg text-xs flex items-center gap-2 shrink-0"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Stats
        </button>
      </div>
    </div>
  );
};
