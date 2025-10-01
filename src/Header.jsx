import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';  // add axios
import img from './Images/Logo.png';

function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [newOrders, setNewOrders] = useState(0); // 🔔 new orders counter

    // Fetch new orders periodically
    const fetchNewOrders = () => {
        axios.get('http://localhost:5000/orders')  // your JSON server endpoint
            .then(res => {
                // Count orders that are 'pending' or unprocessed
                const pendingOrders = res.data.filter(order => order.status === 'pending').length;
                setNewOrders(pendingOrders);
            })
            .catch(err => console.error("Error fetching orders:", err));
    };

    useEffect(() => {
        // Cart count
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cartItems.reduce((sum, item) => sum + item.qty, 0));

        // User details
        const user = localStorage.getItem("username");
        const userRole = localStorage.getItem("role");
        setUsername(user);
        setRole(userRole);

        // Fetch new orders every 5 seconds
        if (userRole === 'hotel') {
            fetchNewOrders();
            const interval = setInterval(fetchNewOrders, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        window.location.href = "/login";
    };

    return (
        <header className="header-bar">
            <div className="Logo">
                <img src={img} alt="5 Star Chahawala" /> 
            </div>

            <nav className="nav-links">
                <ul>
                    {role === "hotel" ? (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/menu">Menu</Link></li>
                            <li><Link to="/table">T</Link></li>
                            <li>
                                <Link to="/cart" className="order-btn">🛒 Cart ({cartCount})</Link>
                            </li>
                            <li><Link to="/addmenu">Add</Link></li>

                            {/* Check Orders Button with Notification */}
                            <li>
                                <Link to="/hotel-dashboard" className="order-btn">
                                    Orders {newOrders > 0 && (
                                        <span className="badge">{newOrders}</span>
                                    )}
                                </Link>
                            </li>

                            <li>
                                <span className='logout' onClick={handleLogout}>
                                    Logout <span className="welcome">👨🏻‍💻</span>
                                </span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/menu">Menu</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/rating">Rating</Link></li>
                            <li>
                                <Link to="/cart" className="order-btn">🛒 Cart ({cartCount})</Link>
                            </li>
                            <div className='username'>
                                {username ? (
                                    <span className='logout' onClick={handleLogout}>
                                        Logout <span className="welcome">👨🏻‍💻</span>
                                    </span>
                                ) : (
                                    <Link to="/login" className="logout">Login</Link>
                                )}
                            </div>
                        </>
                    )}
                </ul>
            </nav>

            
            
        </header>
    );
}

export default Header;
