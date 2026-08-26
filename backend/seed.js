require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");
const Coupon = require("./model/Coupon");

const products = [
    {
        name: "Wireless Headphones",
        description: "Over-ear Bluetooth headphones with active noise cancellation.",
        price: 2499,
        category: "Electronics",
        stock: 25,
        imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        rating: 4.5,
        numReviews: 18
    },
    {
        name: "Smart Watch Pro",
        description: "Fitness tracking smart watch with heart-rate monitoring.",
        price: 3999,
        category: "Electronics",
        stock: 18,
        imageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        rating: 4.2,
        numReviews: 12
    },
    {
        name: "Classic Cotton T-Shirt",
        description: "Soft, comfortable cotton T-shirt for everyday wear.",
        price: 699,
        category: "Fashion",
        stock: 50,
        imageURL: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        rating: 4.0,
        numReviews: 9
    },
    {
        name: "Running Shoes",
        description: "Lightweight running shoes with cushioned sole.",
        price: 2999,
        category: "Footwear",
        stock: 30,
        imageURL: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        rating: 4.7,
        numReviews: 24
    },
    {
        name: "Minimal Desk Lamp",
        description: "Adjustable LED desk lamp with warm and cool light modes.",
        price: 1199,
        category: "Home & Living",
        stock: 16,
        imageURL: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
        rating: 4.3,
        numReviews: 7
    },
    {
        name: "Mechanical Keyboard",
        description: "Compact mechanical keyboard with tactile switches and backlight.",
        price: 3299,
        category: "Electronics",
        stock: 22,
        imageURL: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
        rating: 4.6,
        numReviews: 31
    },
    {
        name: "Bluetooth Speaker",
        description: "Portable waterproof speaker with deep bass and 12-hour battery.",
        price: 1799,
        category: "Electronics",
        stock: 35,
        imageURL: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
        rating: 4.4,
        numReviews: 16
    },
    {
        name: "USB-C Fast Charger",
        description: "30W USB-C wall charger compatible with phones and tablets.",
        price: 899,
        category: "Electronics",
        stock: 60,
        imageURL: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
        rating: 4.1,
        numReviews: 22
    },
    {
        name: "Laptop Backpack",
        description: "Water-resistant backpack with a padded 15-inch laptop compartment.",
        price: 1899,
        category: "Bags",
        stock: 28,
        imageURL: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        rating: 4.5,
        numReviews: 14
    },
    {
        name: "Stainless Steel Water Bottle",
        description: "Insulated 750 ml bottle that keeps drinks cold for 24 hours.",
        price: 649,
        category: "Home & Living",
        stock: 70,
        imageURL: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
        rating: 4.3,
        numReviews: 19
    },
    {
        name: "Yoga Mat",
        description: "Non-slip exercise mat with comfortable 6 mm cushioning.",
        price: 999,
        category: "Fitness",
        stock: 42,
        imageURL: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
        rating: 4.4,
        numReviews: 11
    },
    {
        name: "Ceramic Coffee Mug",
        description: "Microwave-safe 350 ml ceramic mug in a clean matte finish.",
        price: 399,
        category: "Home & Living",
        stock: 80,
        imageURL: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
        rating: 4.0,
        numReviews: 8
    },
    {
        name: "Skin Care Gift Set",
        description: "Daily skin care set with cleanser, moisturizer, and serum.",
        price: 1499,
        category: "Beauty",
        stock: 24,
        imageURL: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8",
        rating: 4.2,
        numReviews: 13
    },
    {
        name: "Denim Jacket",
        description: "Classic blue denim jacket with a relaxed everyday fit.",
        price: 2199,
        category: "Fashion",
        stock: 19,
        imageURL: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        rating: 4.5,
        numReviews: 17
    },
    {
        name: "Polarized Sunglasses",
        description: "UV-protected polarized sunglasses with lightweight frame.",
        price: 1299,
        category: "Fashion",
        stock: 33,
        imageURL: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
        rating: 4.1,
        numReviews: 10
    },
    {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with silent clicks and precision tracking.",
        price: 1099,
        category: "Electronics",
        stock: 47,
        imageURL: "https://images.unsplash.com/photo-1527814050087-3793815479db",
        rating: 4.4,
        numReviews: 28
    },
    {
        name: "Portable Power Bank",
        description: "10000 mAh power bank with dual USB output and fast charging.",
        price: 1599,
        category: "Electronics",
        stock: 38,
        imageURL: "https://images.unsplash.com/photo-1609592424824-7630e9114c16",
        rating: 4.3,
        numReviews: 21
    },
    {
        name: "Scented Candle",
        description: "Hand-poured vanilla scented soy candle with 30-hour burn time.",
        price: 549,
        category: "Home & Living",
        stock: 45,
        imageURL: "https://images.unsplash.com/photo-1603006905003-be475563bc59",
        rating: 4.2,
        numReviews: 9
    },
    {
        name: "Non-Stick Frying Pan",
        description: "24 cm non-stick frying pan suitable for everyday cooking.",
        price: 1399,
        category: "Kitchen",
        stock: 26,
        imageURL: "https://images.unsplash.com/photo-1584990347449-a3d9059bdfef",
        rating: 4.4,
        numReviews: 15
    },
    {
        name: "Notebook Set",
        description: "Set of three ruled notebooks with durable textured covers.",
        price: 499,
        category: "Stationery",
        stock: 90,
        imageURL: "https://images.unsplash.com/photo-1531346878377-a5be20888e57",
        rating: 4.0,
        numReviews: 6
    },
    {
        name: "Gaming Controller",
        description: "Wireless game controller with vibration feedback and USB-C charging.",
        price: 2799,
        category: "Gaming",
        stock: 20,
        imageURL: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3",
        rating: 4.6,
        numReviews: 27
    },
    {
        name: "Travel Neck Pillow",
        description: "Memory foam neck pillow for comfortable long-distance travel.",
        price: 799,
        category: "Travel",
        stock: 36,
        imageURL: "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
        rating: 4.1,
        numReviews: 12
    },
    {
        name: "Electric Kettle",
        description: "1.5 litre electric kettle with automatic shut-off protection.",
        price: 1699,
        category: "Kitchen",
        stock: 23,
        imageURL: "https://images.unsplash.com/photo-1594213114663-2b98e5d8d6c7",
        rating: 4.3,
        numReviews: 20
    },
    {
        name: "Analog Wall Clock",
        description: "Silent sweep analog wall clock with a modern minimalist design.",
        price: 849,
        category: "Home & Living",
        stock: 31,
        imageURL: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c",
        rating: 4.2,
        numReviews: 8
    },
    {
        name: "Resistance Bands Set",
        description: "Set of five resistance bands for home strength training.",
        price: 749,
        category: "Fitness",
        stock: 55,
        imageURL: "https://images.unsplash.com/photo-1598289431512-b97b0917affc",
        rating: 4.4,
        numReviews: 18
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        const password = await bcrypt.hash("Password@123", 10);

        // Only remove records previously created by this seed file.
        const seedUsers = await User.find({
            email: { $in: ["admin@nexuscart.test", "customer@nexuscart.test"] }
        }).select("_id");
        await Order.deleteMany({ user: { $in: seedUsers.map((user) => user._id) } });
        await User.deleteMany({ email: { $in: ["admin@nexuscart.test", "customer@nexuscart.test"] } });
        await Product.deleteMany({ name: { $in: products.map((product) => product.name) } });
        await Coupon.deleteMany({ code: { $in: ["NEXUS10", "FLAT500"] } });

        const [adminUser, customer] = await User.create([
            {
                name: "NexusCart Admin",
                email: "admin@nexuscart.test",
                password,
                role: "admin",
                isVerified: true
            },
            {
                name: "Demo Customer",
                email: "customer@nexuscart.test",
                password,
                role: "user",
                isVerified: true
            }
        ]);

        await Coupon.create([
            {
                code: "NEXUS10",
                discountType: "percentage",
                discountValue: 10,
                minOrderAmount: 1000,
                maxDiscount: 500,
                createdBy: adminUser._id
            },
            {
                code: "FLAT500",
                discountType: "fixed",
                discountValue: 500,
                minOrderAmount: 2000,
                createdBy: adminUser._id
            }
        ]);

        const createdProducts = await Product.insertMany(products);

        await Order.insertMany([
            {
                user: customer._id,
                items: [
                    { product: createdProducts[0]._id, quantity: 1, price: createdProducts[0].price },
                    { product: createdProducts[2]._id, quantity: 2, price: createdProducts[2].price }
                ],
                totalAmount: createdProducts[0].price + createdProducts[2].price * 2,
                address: {
                    fullName: customer.name,
                    street: "12 MG Road",
                    city: "Bengaluru",
                    state: "Karnataka",
                    zipCode: "560001",
                    country: "India"
                },
                paymentId: "demo_payment_001",
                status: "delivered"
            },
            {
                user: customer._id,
                items: [
                    { product: createdProducts[3]._id, quantity: 1, price: createdProducts[3].price }
                ],
                totalAmount: createdProducts[3].price,
                address: {
                    fullName: customer.name,
                    street: "12 MG Road",
                    city: "Bengaluru",
                    state: "Karnataka",
                    zipCode: "560001",
                    country: "India"
                },
                paymentId: "demo_payment_002",
                status: "processing"
            }
        ]);

        console.log("Seed completed: 2 users, 25 products, and 2 orders created.");
        console.log("Admin login: admin@nexuscart.test / Password@123");
        console.log("Customer login: customer@nexuscart.test / Password@123");
    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedDatabase();
