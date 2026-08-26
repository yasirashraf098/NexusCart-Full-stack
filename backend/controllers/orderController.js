const Order = require('../model/Order.js');
const { sendEmail } = require('../utils/sendEmail.js');
const { getOrderConfirmationTemplate } = require('../utils/emailTemplates.js');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        const order = new Order({
            user: req.user._id,
            items: orderItems,
            address: shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            totalAmount: totalPrice
        });

        await order.save();

        const textMessage = `Dear ${req.user.name},

Thank you for your order! Your order has been successfully placed.

Order Details:
Order ID: ${order._id}
Total Price: $${totalPrice}

We will notify you once your order is shipped.

Best regards,
NexusCart Team`;

        const htmlMessage = getOrderConfirmationTemplate(order, req.user);

        // Instant non-blocking email dispatch via setImmediate
        setImmediate(async () => {
            try {
                await sendEmail(req.user.email, `Order Confirmation #${order._id}`, textMessage, htmlMessage);
            } catch (emailError) {
                console.error("Order creation email notification error:", emailError.message);
            }
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const myorders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            await order.save();

            res.status(200).json({
                message: "Order status updated successfully",
                order
            });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    myorders,
    getOrders,
    getOrderById,
    updateOrderStatus
};