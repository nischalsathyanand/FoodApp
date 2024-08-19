import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './NavBar.css';

const NavBar = ({ cart, products }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleAdminPanelClick = () => {
        navigate('/admin');
    };

    const handleCartClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const cartItemCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    const cartItems = Object.keys(cart).map(productId => {
        const product = products.find(p => p._id === productId);
        return {
            ...product,
            quantity: cart[productId]
        };
    });

    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <header className="navbar">
            <div className="Appname">
                <h2 style={{ color: "white" }}>FRC</h2>
            </div>
            <div className="nav-items">
                <button className="add-product-button" onClick={handleAdminPanelClick}>
                    Admin Panel
                </button>
                <button className="login-button">Login</button>
                <div className="cart-icon" onClick={handleCartClick}>
                    <ShoppingCart style={{ fontSize: 24, color: 'white' }} />
                    {cartItemCount > 0 && (
                        <span className="cart-count">{cartItemCount}</span>
                    )}
                </div>
            </div>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Shopping Cart</DialogTitle>
                <DialogContent>
                    {cartItemCount === 0 ? (
                        <p>Cart is empty.</p>
                    ) : (
                        <div className="cart-page">
                            <table className="cart-table">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>{item.productName}</td>
                                            <td>₹{item.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>₹{item.price * item.quantity}</td>
                                            <td>
                                                <IconButton aria-label="delete">
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="cart-totals">
                                <h3>Cart Totals</h3>
                                <p>Subtotal: ₹{totalPrice}</p>
                                <Button variant="contained" color="success">
                                    Proceed to Payment
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <Button onClick={handleClose} color="primary">Close</Button>
            </Dialog>
        </header>
    );
};

export default NavBar;
