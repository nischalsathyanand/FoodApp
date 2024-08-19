import React, { useState, useEffect } from "react";
import './ListProducts.css';
import NavBar from "./NavBar";

const ProductItem = ({ product, quantity, handleAddToCart, handleIncrement, handleDecrement }) => {
    return (
        <div className="product-item">
            <div className="discount-label">{product.discount}% Off</div>
            <img
                src={`http://localhost:8000/${product.imagePath}`}
                alt={product.productName}
            />
            <h3>{product.productName}</h3>
            <p>₹ {product.price}</p>
            {quantity === 0 ? (
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product._id)}>
                    Add to Cart
                </button>
            ) : (
                <div className="quantity-selector">
                    <button onClick={() => handleDecrement(product._id)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => handleIncrement(product._id)}>+</button>
                </div>
            )}
        </div>
    );
};

const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem("selectedCategory") || "");
    const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || "");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || {});

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

    useEffect(() => {
        fetch('http://localhost:8000/api/product/categories')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error('Unexpected data format for categories:', data);
                    setCategories([]);
                }
            })
            .catch(error => console.error("There was an error fetching categories!", error));
    }, []);

    const handleAddToCart = (productId) => {
        setCart(prevCart => {
            const newCart = {
                ...prevCart,
                [productId]: (prevCart[productId] || 0) + 1
            };
            localStorage.setItem("cart", JSON.stringify(newCart));
            return newCart;
        });
    };

    const handleIncrement = (productId) => {
        setCart(prevCart => {
            const newQuantity = (prevCart[productId] || 0) + 1;
            const newCart = {
                ...prevCart,
                [productId]: newQuantity
            };
            localStorage.setItem("cart", JSON.stringify(newCart));
            return newCart;
        });
    };

    const handleDecrement = (productId) => {
        setCart(prevCart => {
            const newQuantity = (prevCart[productId] || 0) - 1;
            let newCart;
            if (newQuantity > 0) {
                newCart = {
                    ...prevCart,
                    [productId]: newQuantity
                };
            } else {
                const { [productId]: removed, ...rest } = prevCart;
                newCart = rest;
            }
            localStorage.setItem("cart", JSON.stringify(newCart));
            return newCart;
        });
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        localStorage.setItem("selectedCategory", category);
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        localStorage.setItem("searchTerm", term);
    };

    const filteredProducts = products.filter(product =>
        (selectedCategory === "" || product.category === selectedCategory) &&
        (searchTerm === "" || product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>There was an error loading the products: {error.message}</p>;

    return (
        <div>
            <NavBar cart={cart} products={products} />
            <div className="filters">
                <div className="category-filter">
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        className="category-dropdown"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        {categories.length > 0 ? (
                            categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))
                        ) : (
                            <option value="">No Categories Available</option>
                        )}
                    </select>
                </div>
                <div className="search-filter">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="search-button" onClick={() => setSearchTerm('')}>Search</button>
                </div>
            </div>
            <h2 style={{ textAlign: "center" }}>List of All Products</h2>
            <div className="product-list">
                {filteredProducts.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    filteredProducts.map(product => (
                        <ProductItem
                            key={product._id}
                            product={product}
                            quantity={cart[product._id] || 0}
                            handleAddToCart={handleAddToCart}
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ListProduct;
