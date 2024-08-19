import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './AdminPanel.css';
import ProductListTable from './ProductListTable';
import AddProduct from './AddProduct'; // Ensure you have this component
import ProductUpdate from './ProductUpdate';


const AdminPanel = () => {
    return (
        <div className="admin-panel">
            <Sidebar />
            <div className="main-content">
                <Routes>
                    <Route path="products" element={<ProductListTable />} />
                    <Route path="add-product" element={<AddProduct />} />
                    <Route path="products/:productId" element={<ProductUpdate />} />
                    <Route path="/" element={<ProductListTable />} /> {/* Default route */}
                </Routes>
            </div>
        </div>
    );
}

const Sidebar = () => {
    const navigate = useNavigate(); // Use the useNavigate hook

    const handleLogout = () => {
        navigate("/home"); // Navigate to home
    }

    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/admin/products">Product</Link></li>
                <li><Link to="/admin/add-product">Add New Product</Link></li>
                <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            </ul>
        </div>
    );
}

export default AdminPanel;
