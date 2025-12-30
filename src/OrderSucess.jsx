// src/OrderSuccess.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function OrderSucess() {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="checkmark">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. Your delicious chai will be ready soon ☕</p>
        <button onClick={() => navigate("/menu")} className="back-btn">
          Back to Menu
        </button>
      </div>

      <div className="confetti"></div>
    </div>
  );
}

export default OrderSucess;
