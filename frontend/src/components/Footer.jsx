import React from 'react';
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      
      {/* Features Bar */}
      <div className="border-b border-slate-800 bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-500">On all orders above ₹1,500</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Secure Payment</h4>
              <p className="text-xs text-slate-500">Razorpay & Encrypted COD</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Easy Returns</h4>
              <p className="text-xs text-slate-500">7-day hassle-free exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 Support</h4>
              <p className="text-xs text-slate-500">Always here to help you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-xl font-black text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>Nexus<span className="text-blue-500">Cart</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your one-stop destination for premium electronics, fashion, lifestyle, and home essentials.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Quick Links</h5>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Storefront Home</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors">Shopping Cart</a></li>
              <li><a href="/orders" className="hover:text-white transition-colors">My Orders</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">User Login</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Categories</h5>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/?category=Electronics" className="hover:text-white transition-colors">Electronics & Gadgets</a></li>
              <li><a href="/?category=Fashion" className="hover:text-white transition-colors">Fashion & Clothing</a></li>
              <li><a href="/?category=Home%20%26%20Living" className="hover:text-white transition-colors">Home & Living</a></li>
              <li><a href="/?category=Footwear" className="hover:text-white transition-colors">Footwear</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Contact & Support</h5>
            <p className="text-sm text-slate-400 mb-2">Have questions? Reach out to our support team.</p>
            <p className="text-sm font-semibold text-blue-400">support@nexuscart.com</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NexusCart Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
