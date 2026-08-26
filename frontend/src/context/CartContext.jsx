import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('nexusCartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const savedCoupon = localStorage.getItem('nexusAppliedCoupon');
    return savedCoupon ? JSON.parse(savedCoupon) : null;
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('nexusCartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('nexusAppliedCoupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('nexusAppliedCoupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          addToast(`Only ${product.stock} items available in stock.`, 'error');
          return prev;
        }
        addToast(`Updated quantity for ${product.name} in cart`, 'success');
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stock) {
          addToast(`Only ${product.stock} items available in stock.`, 'error');
          return prev;
        }
        addToast(`Added ${product.name} to cart`, 'success');
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.product._id === productId);
      if (item) {
        addToast(`Removed ${item.product.name} from cart`, 'info');
      }
      return prev.filter((i) => i.product._id !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          if (quantity > item.product.stock) {
            addToast(`Only ${item.product.stock} items available in stock.`, 'error');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('nexusCartItems');
    localStorage.removeItem('nexusAppliedCoupon');
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxPrice = Math.round(itemsPrice * 0.18); // 18% tax
  const shippingPrice = itemsPrice > 1500 || itemsPrice === 0 ? 0 : 99; // Free shipping over ₹1500
  const subtotalBeforeDiscount = itemsPrice + taxPrice + shippingPrice;

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      addToast('Please enter a coupon code.', 'error');
      return false;
    }

    try {
      const { data } = await API.post('/coupons/validate', {
        code: code.trim(),
        orderAmount: subtotalBeforeDiscount,
      });

      setAppliedCoupon({
        code: data.code,
        discountAmount: data.discountAmount,
      });
      addToast(`Coupon '${data.code}' applied! Saved ₹${data.discountAmount}`, 'success');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid or expired coupon code.';
      addToast(message, 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon code removed.', 'info');
  };

  const discountAmount = appliedCoupon ? Math.min(appliedCoupon.discountAmount, subtotalBeforeDiscount) : 0;
  const totalPrice = Math.max(0, subtotalBeforeDiscount - discountAmount);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsPrice,
        taxPrice,
        shippingPrice,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        totalPrice,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
