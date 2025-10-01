// Chaidetail.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './App.css';

function Chaidetail() {
  const location = useLocation();
  const item = location.state;

  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (item) {
      console.log("Chai item loaded:", item);
    }
  }, [item]);

  if (!item) return <p>No item data provided.</p>;

  const increaseQty = () => {
    setQty(prevQty => prevQty + 1);
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(prevQty => prevQty - 1);
    }
  };

 const handleAddToCart = () => {
  const cartItem = {
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.price,
    qty: qty
  };

  // Get existing cart or empty array
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if item already exists
  const existingIndex = existingCart.findIndex(i => i.id === cartItem.id);
  if (existingIndex >= 0) {
    // Update quantity if it already exists
    existingCart[existingIndex].qty += cartItem.qty;
  } else {
    // Add new item
    existingCart.push(cartItem);
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(existingCart));

  // Optional: redirect to cart
  window.location.href = "/cart";
};


  return (
    <div className="modal-box">
      <button className="close-btn" onClick={() => window.history.back()}>×</button>
      <h2>{item.name}</h2>
      <img src={item.image} alt={item.name} className="modal-img" />
      <p>{item.description}</p>

      <div className="pack-options">
        <h4>Select a Size</h4>
        <label>
          <input type="radio" name="pack" defaultChecked />
          ₹{item.price}
        </label>
      </div>

      <div className="qty-box">
        <button onClick={decreaseQty}>-</button>
        <span id="qty">{qty}</span>
        <button onClick={increaseQty}>+</button>
      </div>
     <button className="add-cart-btn" onClick={handleAddToCart}>
  ADD TO CART – ₹{item.price * qty}
</button>
    </div>
  );
}

export default Chaidetail;
