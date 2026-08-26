import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw, Check, Plus, Minus } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      
      // Fetch related products in same category
      const { data: allProducts } = await API.get('/products');
      const related = allProducts.filter(
        (p) => p.category === data.category && p._id !== data._id
      );
      setRelatedProducts(related.slice(0, 4));
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-slate-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-10 bg-slate-200 rounded w-1/3"></div>
            <div className="h-24 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h3>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    );
  }

  const isInCart = cartItems.some((item) => item.product._id === product._id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Storefront
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm mb-12">
        
        {/* Left Column - Product Image */}
        <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/60 relative">
          <img
            src={product.imageURL || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-200/50">
            {product.category}
          </span>
        </div>

        {/* Right Column - Product Specs */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Ratings */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-extrabold uppercase text-blue-600 tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-amber-800 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
                <span className="text-amber-600 font-normal">({product.numReviews || 12} reviews)</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price tag */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 font-medium">Inclusive of all taxes</span>
            </div>

            {/* Description */}
            <div className="border-t border-b border-slate-100 py-4 mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Description
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Availability */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-slate-700">Availability:</span>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock ({product.stock} units available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isInCart
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                    : product.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isInCart ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-600" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md active:scale-95 disabled:bg-slate-200 disabled:text-slate-400"
              >
                Buy Now
              </button>
            </div>

            {/* Feature badging */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Truck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-600 block">Fast Delivery</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-600 block">Original Product</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <RefreshCw className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-600 block">Easy Returns</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Related Products in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
