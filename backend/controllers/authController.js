const user = require("../model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail.js");


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

};

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
// TODOS: Hash the password before saving to the database
// TODOS: Implement JWT token generation for authentication
// TODOS: OTP Sending and verification for email confirmation
// TODOS: WELCOME MAIL
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        

        const newUser = await user.create({ name, email, password: hashedPassword });
           if(newUser){
        const otp = Math.floor(100000 + Math.random() * 900000);

         newUser.otp = otp;
         newUser.otpExpires = Date.now() + 10 * 60 * 1000;

             await newUser.save();

            const message = `Your OTP for NexusCart registration is: ${otp}`;

         await sendEmail(email, "NexusCart Registration OTP", message);
         res.status(201).json({ 
              _id : newUser._id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              token: generateToken(newUser._id),
       });
          }
          else{
            res.status(500).json({ message: "Error creating user" });
          }


       
    } 
    catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ 
            message: "Error registering user",
            error: error.message
        });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try{
        const existingUser = await user.findOne({ email });
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
            token: generateToken(existingUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user" });
    }
};
  
const getUsers = async (req, res) => {
    try{
        const users = await user.find({}).select("-password"); // Exclude password from the response
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (existingUser.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (existingUser.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        existingUser.isVerified = true;
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
    verifyEmail
};