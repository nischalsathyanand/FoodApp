import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductUpdate.css';

const ProductUpdate = () => {
    const { productId } = useParams(); // Get productId from route params
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null); // Store initial data
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        quantity: '',
        category: '',
        image: null // Handle image file upload
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) {
            console.error('Product ID is missing!');
            setLoading(false);
            return;
        }

        // Fetch product details when component mounts
        fetch(`http://localhost:8000/api/products/${productId}`)
            .then(response => response.json())
            .then(data => {
                setFormData({
                    productName: data.productName,
                    price: data.price,
                    quantity: data.quantity,
                    category: data.category,
                    image: null // Reset image file field
                });
                setInitialData({
                    productName: data.productName,
                    price: data.price,
                    quantity: data.quantity,
                    category: data.category,
                    image: null // Only compare non-file fields
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the product!", error);
                toast.error("There was an error fetching the product.");
                setLoading(false);
            });
    }, [productId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'image' ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { productName, price, quantity, category, image } = formData;

        // Compare current formData with initialData to check for changes
        if (
            formData.productName === initialData.productName &&
            formData.price === initialData.price &&
            formData.quantity === initialData.quantity &&
            formData.category === initialData.category &&
            !image // image is null in initialData
        ) {
            toast.info("No changes made.");
            navigate('/admin/products');
            return;
        }

        const updateData = new FormData();
        updateData.append('productName', productName);
        updateData.append('price', price);
        updateData.append('quantity', quantity);
        updateData.append('category', category);
        if (image) updateData.append('image', image);

        try {
            const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
                method: 'PUT',
                body: updateData
            });

            if (response.ok) {
                toast.success("Product updated successfully!");
                navigate('/admin/products');
            } else {
                const errorData = await response.json();
                toast.error(`Failed to update the product: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("There was an error updating the product!", error);
            toast.error("There was an error updating the product.");
        }
    };

    if (loading) return <p>Loading product...</p>;

    return (
        <div className="update-product-container">
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit} className="update-product-form">
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />
                    {formData.image && (
                        <div className="image-preview">
                            <img src={URL.createObjectURL(formData.image)} alt="Product Preview" />
                        </div>
                    )}
                </div>
                <button type="submit" className="submit-button">Update Product</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ProductUpdate;
