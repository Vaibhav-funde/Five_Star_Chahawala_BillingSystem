import React from "react";
import img from './Images/NewLogo.png';
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div>
            {/* Footer Section */}
            <footer>
                <div className="footer-container">
                    
                    {/* Logo Section */}
                    <div className="footer-logo">
                        <img src={img} alt="5 Star Chahawala" />
                        <p>Serving warmth in every cup, since 2024.</p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/menu">Menu</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <p>Email: 5starchahawala25@gmail.com</p>
                        <p>Phone: +91 7219349467</p>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 5 Star Chahawala. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
