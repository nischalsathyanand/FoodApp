const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/product");
const path = require("path");

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Create a unique file name
    }
});

const upload = multer({ storage: storage });

// Function to generate the next product ID
const generateNextProductId = async () => {
    const lastProduct = await Product.findOne({}, {}, { sort: { productId: -1 } }).exec();
    let nextId = '001';
    if (lastProduct) {
        const lastId = parseInt(lastProduct.productId, 10);
        nextId = (lastId + 1).toString().padStart(3, '0');
    }
    return nextId;
};

// Route to create a new product with image upload
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { productName, price, quantity, category } = req.body;

        // Generate a new productId
        const productId = await generateNextProductId();

        // Create a new product with the uploaded image path
        const product = new Product({
            productId,
            productName,
            price,
            quantity,
            imagePath: req.file ? req.file.path : '', // Store the image file path
            category,
        });

        await product.save();
        res.status(201).send(product);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(400).send({ error: error.message });
    }
});

// Sample route to get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to get a single product by productId
router.get('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId; // Get the productId from the request parameters

        // Find the product by its productId
        const product = await Product.findOne({ productId });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send({ error: error.message });
    }
});


// Route to update a product by productId
router.put('/products/:productId', upload.single('image'), async (req, res) => {
    try {
        const productId = req.params.productId;
        const { productName, price, quantity, category } = req.body;

        // Build the update object
        const updateData = {
            productName,
            price,
            quantity,
            category,
        };

        // If a new image is uploaded, update the image path
        if (req.file) {
            updateData.imagePath = req.file.path;
        }

        // Update the product
        const updatedProduct = await Product.findOneAndUpdate(
            { productId },
            { $set: updateData },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send({ error: error.message });
    }
});



// Route to delete a single product by productId
router.delete('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId; // Get the productId from the request parameters
        console.log(productId);

        const product = await Product.findOneAndDelete({ productId: productId });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ error: error.message });
    }
});



//Route to get products by category
router.get('/products/category/:category', async (req, res) => {
    try {
        const category = req.params.category; // Get the category from the request parameters

        // Find products by the specified category
        const products = await Product.find({ category });

        if (products.length === 0) {
            return res.status(404).send({ message: "No products found in this category" });
        }

        res.status(200).send(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).send({ error: error.message });
    }
});

router.get('/product/categories', async (req, res) => {
    try {
        // Get distinct categories from the Product collection
        const categories = await Product.distinct('category');
      
        // Send the categories as a JSON response
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
