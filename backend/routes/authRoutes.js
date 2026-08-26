const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUsers,
    verifyEmail,
    resendOtp
} = require("../controllers/authController.js");

const { protect } = require("../middleware/authMiddleware.js");
const { admin } = require("../middleware/adminMiddleware.js");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/users", protect, admin, getUsers);

router.post("/verify-email", verifyEmail);

router.post("/resend-otp", resendOtp);

module.exports = router;