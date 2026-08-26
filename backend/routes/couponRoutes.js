const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
    createCoupon,
    getCoupons,
    getActiveCoupons,
    updateCoupon,
    deactivateCoupon,
    validateCoupon
} = require("../controllers/couponController");

const router = express.Router();

router.get("/active", getActiveCoupons);

router.post("/validate", protect, validateCoupon);

router.route("/")
    .post(protect, admin, createCoupon)
    .get(protect, admin, getCoupons);

router.route("/:id")
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, deactivateCoupon);

module.exports = router;
