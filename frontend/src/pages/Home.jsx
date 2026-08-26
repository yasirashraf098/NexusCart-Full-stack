import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { ProductCard } from '../components/ProductCard';
import { useToast } from '../context/ToastContext';
import { Search, SlidersHorizontal, Sparkles, ShoppingCart, RefreshCw, Flame, Tag, Copy, Check } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Footwear',
  'Home & Living',
  'Fitness',
  'Beauty',
  'Bags',
  'Kitchen',
  'Gaming',
  'Stationery'
];

export const Home = ({ searchQuery = '' }) => {
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [copiedCode, setCopiedCode] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchProductsAndCoupons();
  }, []);

  const fetchProductsAndCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, coupRes] = await Promise.all([
        API.get('/products'),
        API.get('/coupons/active').catch(() => ({ data: [] })),
      ]);
      setProducts(prodRes.data);
      setCoupons(coupRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch store catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Coupon code '${code}' copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(''), 3000);
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // featured
    });

  return (
    <div className="min-h-screen pb-12">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 mb-8 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" /> Premium Shopping Experience
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Discover Next-Gen Products & Daily Deals.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            Upgrade your tech, fashion, and lifestyle with verified high-quality items delivered straight to your door.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#catalog"
              className="px-6 py-3 rounded-2xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Explore Products
            </a>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400"><Flame className="w-4 h-4" /> Free Shipping</span> over ₹1,500
            </div>
          </div>
        </div>
      </section>

      {/* Available Offers & Promo Coupons Showcase */}
      {coupons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-gradient-to-r from-blue-900/10 via-amber-500/10 to-blue-900/10 border border-blue-200/60 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Active Promo Coupons & Offers</h2>
                <p className="text-xs text-slate-500">Copy code and apply at cart/checkout for instant savings!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c._id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 hover:border-blue-400 transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-black text-slate-900 text-sm uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        {c.code}
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-blue-600">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {c.minOrderAmount > 0 ? `Min purchase ₹${c.minOrderAmount}` : 'No min purchase'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyCode(c.code)}
                    className="p-2 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 transition-colors shrink-0"
                    title="Copy Promo Code"
                  >
                    {copiedCode === c.code ? (
                      <Check className="w-4 h-4 text-emerald-500 group-hover:text-white" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Storefront Container */}
      <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8">
          
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filters</span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Max Price:</label>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 sm:w-32 accent-blue-600"
              />
              <span className="text-xs font-bold text-slate-800">₹{maxPrice.toLocaleString()}</span>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-3">
                <div className="w-full aspect-square bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3 pt-2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center max-w-md mx-auto my-12">
            <p className="font-bold text-sm mb-2">{error}</p>
            <button
              onClick={fetchProductsAndCoupons}
              className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow hover:bg-rose-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
            <p className="text-slate-500 text-sm mb-6">
              Try adjusting your search criteria, category filters, or price range.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setMaxPrice(10000);
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
