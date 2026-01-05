import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function Chaidetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state;

  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (item) {
      console.log("Item loaded:", item);
    }
  }, [item]);

  if (!item) return <p>No item data provided.</p>;

  // Increase / Decrease quantity (respect Cold Drinks stock)
  const increaseQty = () => {
    if (item.category?.name === "Cold Drinks" && qty >= item.stock) {
      alert("Stock limit reached");
      return;
    }
    setQty(prev => prev + 1);
  };

  const decreaseQty = () => {
    if (qty > 1) setQty(prev => prev - 1);
  };

  // ✅ Add to Cart and Decrease Stock in Backend
  const handleAddToCart = async () => {
    if (item.category?.name === "Cold Drinks" && item.stock === 0) {
      alert("Out of Stock");
      return;
    }

    // 1️⃣ Add to localStorage cart
    const cartItem = { id: item.id, name: item.name, image: item.image, price: item.price, qty };
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = existingCart.findIndex(i => i.id === cartItem.id);
    if (existingIndex >= 0) {
      existingCart[existingIndex].qty += cartItem.qty;
    } else {
      existingCart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // 2️⃣ Call backend to decrease stock (Cold Drinks only)
    if (item.category?.name === "Cold Drinks") {
      try {
        await axios.post("http://localhost:8081/api/items/update-stock", {
          itemId: item.id,
          quantity: qty,
          type: "subtract" // subtract from stock
        });
        alert(`${item.name} added to cart successfully! Stock updated.`);
      } catch (err) {
        console.error("Error updating stock:", err);
        alert("Failed to update stock on server.");
      }
    } else {
      alert(`${item.name} added to cart!`);
    }

    navigate("/cart"); // go to cart
  };

  return (
    <div className="modal-box">
      <button className="close-btn" onClick={() => navigate(-1)}>×</button>

      <h2>{item.name}</h2>
      <img src={item.image} alt={item.name} className="modal-img" />
      <p>{item.description}</p>

      {/* Show Stock for Cold Drinks */}
      {item.category?.name === "Cold Drinks" && (
        <p className="stock">Available Stock: {item.stock}</p>
      )}

      <div className="pack-options">
        <h4>Select a Size</h4>
        <label>
          <input type="radio" name="pack" defaultChecked />
          ₹{item.price}
        </label>
      </div>

      <div className="qty-box">
        <button onClick={decreaseQty}>-</button>
        <span>{qty}</span>
        <button onClick={increaseQty}>+</button>
      </div>

      {/* Disable if Out of Stock */}
      <button
        className="add-cart-btn"
        disabled={item.category?.name === "Cold Drinks" && item.stock === 0}
        onClick={handleAddToCart}
      >
        {item.category?.name === "Cold Drinks" && item.stock === 0
          ? "OUT OF STOCK"
          : `ADD TO CART – ₹${item.price * qty}`}
      </button>
    </div>
  );
}

export default Chaidetail;
