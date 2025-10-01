import React from "react";
import img from './Images/Logo.png'
function Footer(){
    return(
        <div>
             {/* <!-- Footer Section --> */}
            <footer>
                <div className="footer-container">
                    <div className="footer-logo">
                        <img src={img} alt="5 Star Chahawala" />
                        <p>Serving warmth in every cup, since 2024.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Menu</a></li>
                            <li><a href="#">Deals</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
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
    )
}
export default Footer;