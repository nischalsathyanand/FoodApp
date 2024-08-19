import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from './ConfirmationModal';

const ProductListTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetch('http://localhost:8000/api/products')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/products/${productIdToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProducts(products.filter(product => product.productId !== productIdToDelete));
                toast.success("Product deleted successfully!");
            } else {
                toast.error("Failed to delete the product.");
            }
        } catch (error) {
            console.error("There was an error deleting the product!", error);
            toast.error("There was an error deleting the product.");
        }
        setShowModal(false);
    };

    const handleUpdateProduct = (productId) => {
        navigate(`/admin/products/${productId}`); // Navigate to the update route
    };

    const openModal = (productId) => {
        setProductIdToDelete(productId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setProductIdToDelete(null);
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>There was an error loading the products: {error.message}</p>;

    return (
        <div>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr><td colSpan="4">No products found.</td></tr>
                    ) : (
                        products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.productName}</td>
                                <td>Rs.{product.price}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleUpdateProduct(product.productId)}>Edit</button>
                                    <button className="delete-btn" onClick={() => openModal(product.productId)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <ConfirmationModal 
                show={showModal} 
                onClose={closeModal} 
                onConfirm={handleDelete} 
            />
            <ToastContainer />
        </div>
    );
}

export default ProductListTable;
