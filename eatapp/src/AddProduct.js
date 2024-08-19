import React, { useState } from 'react';
import './AddProduct.css';

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [imageFile, setImageFile] = useState(null); // Changed from imagePath to imageFile
    const [category, setCategory] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare form data
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('price', parseFloat(price));
        formData.append('quantity', parseInt(quantity, 10));
        formData.append('image', imageFile); // The image file
        formData.append('category', category);

        try {
            const response = await fetch('http://localhost:8000/api/products', {
                method: 'POST',
                body: formData, // Send the form data with the image
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setSuccess('Product added successfully!');
            setProductName('');
            setPrice('');
            setQuantity('');
            setImageFile(null); // Reset the file input
            setCategory('');
        } catch (error) {
            console.error('Error adding product:', error);
            setError(error.message);
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add New Product</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit} className="add-product-form" encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="productName">Product Name:</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setImageFile(e.target.files[0])} // Capture the file
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Snack">Snack</option>
                        <option value="Drinks">Drinks</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">Add Product</button>
            </form>
        </div>
    );
};
export default AddProduct;
