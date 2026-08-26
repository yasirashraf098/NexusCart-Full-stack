import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const isInCart = cartItems.some((item) => item.product._id === product._id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.imageURL || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-700 shadow-sm border border-slate-200/50">
            {product.category}
          </span>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500/90 text-white rounded-full text-[10px] font-bold shadow-sm">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {product.rating ? product.rating.toFixed(1) : '4.5'}
            </span>
            <span className="text-xs text-slate-400">({product.numReviews || 12})</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-slate-800 text-sm leading-snug hover:text-blue-600 transition-colors line-clamp-2 mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isInCart
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : product.stock > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
