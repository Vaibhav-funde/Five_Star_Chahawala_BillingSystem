// Bill.js
import React from "react";
import "./App.css";

function Bill({ user, orders }) {
  // ✅ Calculate subtotal safely
  const subtotal = orders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce((s, item) => {
        const qty = item.quantity ? parseInt(item.quantity, 10) : 1; // default 1
        const price = item.price ? parseFloat(item.price) : 0; // ensure number
        return s + price * qty;
      }, 0),
    0
  );

  const gst = parseFloat((subtotal * 0.18).toFixed(2)); // 18% GST
  const totalAmount = subtotal + gst;

  return (
    <div className="bill-container" id={`bill-${user}`}>
      <div className="bill-header">
        <h1>5 Star Chaiwala</h1>
        <h4>Walunj, Tal-Pathardi Dist-Ahilyanagar 414102</h4>
        <h4>Phone No: 7219349467</h4>

        <header>
          <h5>Date: {new Date().toLocaleDateString()}</h5>
          <p>
            Customer: <strong>{user}</strong>
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
          </tr>
        </thead>
        <tbody>
          {orders.flatMap((order) =>
            order.items.map((item, i) => {
              const qty = item.quantity ? parseInt(item.quantity, 10) : 1;
              const price = item.price ? parseFloat(item.price) : 0;
              return (
                <tr key={`${order.id}-${i}`}>
                  <td>{item.name}</td>
                  <td>{qty}</td>
                  <td>₹{price.toFixed(2)}</td>
                  <td>₹{(price * qty).toFixed(2)}</td>
                </tr>
              );
            })
          )}
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
      </footer>
    </div>
  );
}

export default Bill;
