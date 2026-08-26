import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Search, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

export const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders/allorders');
      setOrders(data);
    } catch (err) {
      addToast('Failed to fetch orders list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      addToast(`Order status updated to ${newStatus}`, 'success');
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder="Search orders by customer name or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4 pr-6">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Loading customer orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No customer orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-extrabold text-slate-900 font-mono text-xs">{o._id}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{o.user?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{o.user?.email || 'N/A'}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-700">{o.items?.length || 0} items</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {o.items?.map((i) => i.product?.name).filter(Boolean).join(', ')}
                      </p>
                    </td>
                    <td className="p-4 font-black text-slate-900">
                      ₹{o.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 pr-6">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                          o.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : o.status === 'shipped'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : o.status === 'processing'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : o.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
