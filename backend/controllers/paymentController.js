const Razorpay = require('razorpay');
const crypto = require('crypto');

const createOrder = async (req, res) => {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_TTxBLel8LU6NVm';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'bV72A9LrE0KWSpNF8GKdjv5s';

    const instance = new Razorpay({
      key_id,
      key_secret,
    });
    
    const amountInPaise = Math.round(Number(req.body.amount) * 100);

    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).json({ message: "Failed to create Razorpay order" });

    res.json({
      ...order,
      key_id,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: error.message || "Payment gateway error" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'bV72A9LrE0KWSpNF8GKdjv5s';

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.status(500).json({ message: error.message || "Payment verification error" });
  }
};

module.exports = { createOrder, verifyPayment };