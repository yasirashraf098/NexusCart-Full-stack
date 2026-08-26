import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';
import { CouponSuggestions } from '../components/CouponSuggestions';
import { CreditCard, Truck, ShieldCheck, Lock, CheckCircle2, Tag, X } from 'lucide-react';

export const Checkout = () => {
  const {
    cartItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    totalPrice,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setApplying(true);
    await applyCoupon(couponInput);
    setApplying(false);
  };

  const handleRazorpayPayment = async (orderPayload) => {
    try {
      // 1. Create Razorpay order on backend
      const { data: razorpayOrder } = await API.post('/payments/orders', {
        amount: totalPrice,
      });

      const options = {
        key: razorpayOrder.key_id || 'rzp_test_TTxBLel8LU6NVm',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'NexusCart',
        description: 'Order Checkout Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment
            await API.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Create Order in DB
            const finalOrder = {
              ...orderPayload,
              paymentId: response.razorpay_payment_id,
            };
            const { data: createdOrder } = await API.post('/orders', finalOrder);
            clearCart();
            addToast('Payment verified & order placed successfully!', 'success');
            navigate(`/order-success/${createdOrder._id}`);
          } catch (err) {
            addToast(err.response?.data?.message || 'Payment verification failed', 'error');
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: user?.email,
        },
        theme: {
          color: '#2563eb',
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          addToast(resp.error?.description || 'Payment cancelled/failed', 'error');
        });
        rzp.open();
      } else {
        // Fallback simulation
        const finalOrder = {
          ...orderPayload,
          paymentId: `sim_${Date.now()}`,
        };
        const { data: createdOrder } = await API.post('/orders', finalOrder);
        clearCart();
        addToast('Order placed successfully (Simulated Payment)!', 'success');
        navigate(`/order-success/${createdOrder._id}`);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to initialize payment gateway', 'error');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      addToast('Please complete all shipping address fields.', 'error');
      return;
    }

    setSubmitting(true);

    const orderPayload = {
      orderItems: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      couponCode: appliedCoupon?.code,
      discountAmount,
    };

    try {
      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(orderPayload);
      } else {
        // Cash on Delivery
        const { data: createdOrder } = await API.post('/orders', {
          ...orderPayload,
          paymentId: `cod_${Date.now()}`,
        });
        clearCart();
        addToast('Order placed successfully!', 'success');
        navigate(`/order-success/${createdOrder._id}`);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-extrabold flex items-center justify-center text-sm">
                1
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 12 MG Road, Apartment 4B"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Bengaluru"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Karnataka"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 560001"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-extrabold flex items-center justify-center text-sm">
                2
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">Payment Option</h2>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('razorpay')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Online Payment (Razorpay / UPI / Cards)</h4>
                    <p className="text-xs text-slate-500">Pay securely via Credit/Debit card, UPI, Netbanking</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'razorpay' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'razorpay' && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 text-white">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Cash on Delivery (COD)</h4>
                    <p className="text-xs text-slate-500">Pay cash when your order arrives at your address</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cod' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </label>
            </div>

            {/* Helpful UPI Note */}
            {paymentMethod === 'razorpay' && (
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs space-y-1 text-slate-700">
                <p className="font-bold text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> UPI & Card Payment Info:
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  • <strong>Test Mode Keys (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono">rzp_test_...</code>):</strong> GPay/PhonePe real apps test QR code scan ko block karte hain (NPCI rules). Test mode me Razorpay modal khol kar UPI ID me <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold text-blue-900">success@razorpay</code> dalein aur <strong>Simulate Success</strong> par click karein.
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  • <strong>Real Live Payments:</strong> Real GPay/PhonePe QR scanning ke liye <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">backend/.env</code> me Razorpay Live Keys (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold text-blue-900">rzp_live_...</code>) daalein.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
            Items in Order ({cartItems.length})
          </h2>

          <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
            {cartItems.map(({ product, quantity }) => (
              <div key={product._id} className="flex items-center gap-3 text-xs">
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg bg-slate-100 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{product.name}</p>
                  <p className="text-slate-500">Qty: {quantity} × ₹{product.price}</p>
                </div>
                <span className="font-extrabold text-slate-900">
                  ₹{(product.price * quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Smart Coupon Suggestions */}
          <CouponSuggestions subtotal={itemsPrice + taxPrice + shippingPrice} />

          {/* Coupon Code Section in Checkout */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">Promo / Coupon Code</label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-extrabold text-emerald-900 uppercase font-mono">
                    {appliedCoupon.code} (-₹{discountAmount})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="p-1 text-emerald-700 hover:bg-emerald-100 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. NEXUS10, FLAT500"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={applying || !couponInput.trim()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all disabled:bg-slate-300"
                >
                  {applying ? '...' : 'Apply'}
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">₹{itemsPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax (18%)</span>
              <span className="font-bold text-slate-800">₹{taxPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-slate-800">
                {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-black text-slate-900">Total Payable</span>
              <span className="text-xl font-black text-blue-600">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300"
          >
            {submitting ? (
              'Processing Order...'
            ) : (
              <>
                <Lock className="w-4 h-4" /> Place Order Now
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Guaranteed Safe & Secure Checkout
          </div>
        </div>

      </form>
    </div>
  );
};
