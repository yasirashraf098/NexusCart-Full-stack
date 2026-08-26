const Coupon = require("../model/Coupon");

const formatCode = (code) => String(code || "").trim().toUpperCase();

const createCoupon = async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            expiresAt,
            usageLimit
        } = req.body;

        const normalizedCode = formatCode(code);

        if (!normalizedCode || !discountType || discountValue === undefined) {
            return res.status(400).json({
                message: "code, discountType, and discountValue are required"
            });
        }

        if (!['percentage', 'fixed'].includes(discountType)) {
            return res.status(400).json({ message: "discountType must be percentage or fixed" });
        }

        if (Number(discountValue) <= 0 || (discountType === "percentage" && Number(discountValue) > 100)) {
            return res.status(400).json({ message: "Enter a valid discountValue" });
        }

        if (expiresAt && new Date(expiresAt) <= new Date()) {
            return res.status(400).json({ message: "expiresAt must be a future date" });
        }

        const coupon = await Coupon.create({
            code: normalizedCode,
            discountType,
            discountValue: Number(discountValue),
            minOrderAmount: Number(minOrderAmount || 0),
            maxDiscount: maxDiscount === undefined || maxDiscount === "" ? undefined : Number(maxDiscount),
            expiresAt: expiresAt || undefined,
            usageLimit: usageLimit === undefined || usageLimit === "" ? undefined : Number(usageLimit),
            createdBy: req.user._id
        });

        res.status(201).json(coupon);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "A coupon with this code already exists" });
        }

        res.status(500).json({ message: error.message });
    }
};

const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const allowedFields = [
            "discountType",
            "discountValue",
            "minOrderAmount",
            "maxDiscount",
            "expiresAt",
            "usageLimit",
            "isActive"
        ];
        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        if (updates.discountType && !['percentage', 'fixed'].includes(updates.discountType)) {
            return res.status(400).json({ message: "discountType must be percentage or fixed" });
        }

        const effectiveType = updates.discountType;
        if (updates.discountValue !== undefined && Number(updates.discountValue) <= 0) {
            return res.status(400).json({ message: "Enter a valid discountValue" });
        }
        if (effectiveType === "percentage" && Number(updates.discountValue) > 100) {
            return res.status(400).json({ message: "Percentage discount cannot exceed 100" });
        }

        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!coupon) return res.status(404).json({ message: "Coupon not found" });

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deactivateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!coupon) return res.status(404).json({ message: "Coupon not found" });

        res.json({ message: "Coupon deactivated", coupon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        const amount = Number(orderAmount);

        if (!formatCode(code) || !Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ message: "code and a valid orderAmount are required" });
        }

        const coupon = await Coupon.findOne({ code: formatCode(code) });

        if (!coupon || !coupon.isActive) {
            return res.status(404).json({ message: "Coupon is invalid or inactive" });
        }
        if (coupon.expiresAt && coupon.expiresAt <= new Date()) {
            return res.status(400).json({ message: "Coupon has expired" });
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "Coupon usage limit has been reached" });
        }
        if (amount < coupon.minOrderAmount) {
            return res.status(400).json({
                message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}`
            });
        }

        let discountAmount = coupon.discountType === "percentage"
            ? (amount * coupon.discountValue) / 100
            : coupon.discountValue;

        if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        discountAmount = Math.min(discountAmount, amount);

        res.json({
            valid: true,
            code: coupon.code,
            discountAmount: Number(discountAmount.toFixed(2)),
            finalAmount: Number((amount - discountAmount).toFixed(2))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActiveCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({
            isActive: true,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        }).select("code discountType discountValue minOrderAmount maxDiscount expiresAt usageLimit usedCount").sort({ createdAt: -1 });

        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCoupon,
    getCoupons,
    getActiveCoupons,
    updateCoupon,
    deactivateCoupon,
    validateCoupon
};
