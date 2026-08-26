const productModel = require("../model/Product.js");
const cloudinary = require("../config/cloudinary.js");

const getProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    
    try {
        const { name, description, price, category, stock, imageURL: bodyImageURL } = req.body;
        let imageURL = bodyImageURL || "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            console.log("Cloudinary upload result:", result);
            imageURL = result.secure_url;
        }

        const product = new productModel({
            name,
            description,
            price,
            category,
            stock,
            imageURL
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, imageURL: bodyImageURL } = req.body;
        let imageURL = bodyImageURL || "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageURL = result.secure_url;
        }

        const product = await productModel.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            product.imageURL = imageURL || product.imageURL;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id);
        if (product) {
            res.json({ message: "Product deleted successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};