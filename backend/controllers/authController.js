const user = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail.js");
const { getOtpEmailTemplate } = require("../utils/emailTemplates.js");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const cleanEmail = (email || "").trim().toLowerCase();
        let existingUser = await user.findOne({ email: cleanEmail });

        if (existingUser) {
            // If user exists and is already verified, reject registration
            if (existingUser.isVerified || existingUser.verified) {
                return res.status(400).json({ message: "User already exists. Please log in instead." });
            }
            // If user exists but is NOT verified, update password and send fresh OTP
            const salt = await bcrypt.genSalt(10);
            existingUser.password = await bcrypt.hash(password, salt);
            if (name) existingUser.name = name;

            const otp = String(Math.floor(100000 + Math.random() * 900000));
            existingUser.otp = otp;
            existingUser.otpExpires = Date.now() + 10 * 60 * 1000;

            await existingUser.save();

            const textMessage = `Your OTP for NexusCart registration is: ${otp}`;
            const htmlMessage = getOtpEmailTemplate(existingUser.name, otp);

            // Asynchronous non-blocking email dispatch
            sendEmail(cleanEmail, "NexusCart Registration OTP", textMessage, htmlMessage).catch(emailErr => {
                console.error("REGISTER OTP EMAIL ERROR:", emailErr.message);
            });

            return res.status(200).json({
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                token: generateToken(existingUser._id),
                message: "Verification code sent to your email."
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await user.create({
            name,
            email: cleanEmail,
            password: hashedPassword,
            isVerified: false,
            verified: false
        });

        if (newUser) {
            const otp = String(Math.floor(100000 + Math.random() * 900000));
            newUser.otp = otp;
            newUser.otpExpires = Date.now() + 10 * 60 * 1000;

            await newUser.save();

            const textMessage = `Your OTP for NexusCart registration is: ${otp}`;
            const htmlMessage = getOtpEmailTemplate(name, otp);

            // Asynchronous non-blocking email dispatch
            sendEmail(cleanEmail, "NexusCart Registration OTP", textMessage, htmlMessage).catch(emailErr => {
                console.error("REGISTER OTP EMAIL ERROR:", emailErr.message);
            });

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser._id),
                message: "User registered. Verification code sent to email."
            });
        } else {
            res.status(500).json({ message: "Error creating user" });
        }
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
};

// Resend OTP
const resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const cleanEmail = (email || "").trim().toLowerCase();
        const existingUser = await user.findOne({ email: cleanEmail });

        if (!existingUser) {
            return res.status(404).json({ message: "User with this email not found" });
        }

        if (existingUser.isVerified || existingUser.verified) {
            return res.status(400).json({ message: "Email is already verified. Please log in." });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        existingUser.otp = otp;
        existingUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await existingUser.save();

        const textMessage = `Your new OTP for NexusCart registration is: ${otp}`;
        const htmlMessage = getOtpEmailTemplate(existingUser.name, otp);

        // Asynchronous non-blocking email dispatch
        sendEmail(cleanEmail, "NexusCart Verification OTP (Resent)", textMessage, htmlMessage).catch(emailErr => {
            console.error("RESEND OTP EMAIL ERROR:", emailErr.message);
        });

        res.json({ message: "New OTP sent to your email." });
    } catch (error) {
        console.error("RESEND OTP ERROR:", error);
        res.status(500).json({
            message: "Error resending OTP",
            error: error.message
        });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const cleanEmail = (email || "").trim().toLowerCase();
        const existingUser = await user.findOne({ email: cleanEmail });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            isVerified: existingUser.isVerified || existingUser.verified || false,
            token: generateToken(existingUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await user.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanOtp = String(otp || "").trim();
        const existingUser = await user.findOne({ email: cleanEmail });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (String(existingUser.otp || "").trim() !== cleanOtp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (!existingUser.otpExpires || existingUser.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "OTP expired. Please request a new code."
            });
        }

        existingUser.isVerified = true;
        existingUser.verified = true;
        existingUser.otp = undefined;
        existingUser.otpExpires = undefined;

        await existingUser.save();

        res.json({
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error("VERIFY EMAIL ERROR:", error);
        res.status(500).json({
            message: "Error verifying email",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    verifyEmail,
    resendOtp
};