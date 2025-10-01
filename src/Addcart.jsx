// import React, { useEffect, useState } from 'react';
// import './App.css';

// function Addcart() {
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartItems(savedCart);
//   }, []);

//   const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
//   const gst = parseFloat((subtotal * 0.18).toFixed(2)); // 18% GST
//   const totalAmount = subtotal + gst;

//   const removeItem = (id) => {
//     const updatedCart = cartItems.filter(item => item.id !== id);
//     setCartItems(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="cart-container">
//         <h2>Your Cart</h2>
//         <p>Your cart is empty.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="cart-container" id="print-bill">
//      <div className="header-row">
//     <h2>5 Star Chaiwala</h2>
//     <span className="bill-date">{new Date().toLocaleDateString()}</span>
//   </div>
//       <h2>Bill</h2>
//       {cartItems.map((item) => (
//         <div className="cart-item" key={item.id}>
//           <img src={item.image} alt={item.name} className="cart-img" />
//           <div className="cart-info">
//             <h4>{item.name}</h4>
//             <p>₹{item.price} × {item.qty}</p>
//             <h3>Item Total: ₹{item.price * item.qty}</h3>
//             <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
//           </div>
//         </div>
//       ))}

//       <div className="price-breakdown">
//         <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
//         <p><strong>GST (18%):</strong> ₹{gst.toFixed(2)}</p>
//         <h3><strong>Grand Total:</strong> ₹{totalAmount.toFixed(2)}</h3>
//       </div>

//       <button className="checkout-btn" onClick={() => window.print()}>
//   🖨️ Print Bill
// </button>

//     </div>
//   );
// }

// export default Addcart;


///bill

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function Addcart() {
  const [cartItems, setCartItems] = useState([]);
  const [username, setUsername] = useState("");

  // Load cart + username from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);

    const savedUsername = localStorage.getItem("username") || "Guest";
    setUsername(savedUsername);
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  const gst = parseFloat((subtotal * 0.18).toFixed(2)); // 18% GST
  const totalAmount = subtotal + gst;

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Place order → send data to backend
  
const handlePlaceOrder = async () => {
  const username = localStorage.getItem("username");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // Calculate total
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Prepare order payload with qty
  const orderData = {
    username: username,
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty        // 👈 include quantity
    })),
     totalAmount: totalAmount,
      orderDate: new Date().toISOString(),
      status: "pending" // 👈 important for notification
    };
    
  try {
    const response = await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      alert("Order placed successfully!");
      localStorage.removeItem("cart"); // clear cart after placing order
    } else {
      alert("Failed to place order");
    }
  } catch (error) {
    console.error("Error placing order:", error);
  }
};

  if (cartItems.length === 0) {
    return (
      <div className="bill-container empty">
        <h2>🛒 Your Cart</h2>
        <p>No items in your bill.</p>
      </div>
    );
  }

  return (
    <div className="bill-container" id="print-bill">
      <div className="bill-header">
        <h1>5 Star Chaiwala</h1>
        <h4>Walunj, Tal-Pathardi Dist-Ahilyanagar 414102</h4>
        <h4>Phone No: 7219349467</h4>

        <header>
          <h5>Date: {new Date().toLocaleDateString()}</h5>
          <p>
            Customer: <strong>{username}</strong>
          </p>
          <p>Bill No: {Math.floor(Math.random() * 1000)}</p>
        </header>
      </div>

      <table className="bill-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>₹{item.price}</td>
              <td>₹{(item.price * item.qty).toFixed(2)}</td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="price-summary">
        <p>
          <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
        </p>
        <p>
          <strong>GST (18%):</strong> ₹{gst.toFixed(2)}
        </p>
        <h2>
          <strong>Grand Total:</strong> ₹{totalAmount.toFixed(2)}
        </h2>
      </div>

      <footer className="bill-footer">
        <p>🙏 Thank you for visiting! ☕</p>
        <button onClick={() => window.print()} className="print-btn">
          🖨️ Print / Save Bill
        </button>
        <br />
        <button onClick={handlePlaceOrder} className="checkout-btn">
          🛒 Place Order
        </button>
      </footer>
    </div>
  );
}

export default Addcart;
