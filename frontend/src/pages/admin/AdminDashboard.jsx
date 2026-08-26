import React, { useState } from 'react';
import { AnalyticsTab } from '../../components/admin/AnalyticsTab';
import { ProductsTab } from '../../components/admin/ProductsTab';
import { OrdersTab } from '../../components/admin/OrdersTab';
import { UsersTab } from '../../components/admin/UsersTab';
import { CouponsTab } from '../../components/admin/CouponsTab';
import { BarChart3, Package, ShoppingBag, Users, Tag, ShieldCheck } from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> NexusCart Admin Control Center
          </div>
          <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics Overview
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" /> Products Management
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'coupons'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" /> Discount Coupons
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Orders Management
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" /> Users Management
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'coupons' && <CouponsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'users' && <UsersTab />}
      </div>

    </div>
  );
};
