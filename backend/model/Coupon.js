const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0
        },

        minOrderAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        maxDiscount: {
            type: Number,
            min: 0
        },

        expiresAt: {
            type: Date
        },

        usageLimit: {
            type: Number,
            min: 1
        },

        usedCount: {
            type: Number,
            default: 0,
            min: 0
        },

        isActive: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);