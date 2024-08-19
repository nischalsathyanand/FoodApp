const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    productId: { type: String, unique: true, sparse: true }, // Allows unique or null
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imagePath: { type: String, required: false },
    category: { type: String, required: true },
}, {
    timestamps: true
});


// Export the model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
