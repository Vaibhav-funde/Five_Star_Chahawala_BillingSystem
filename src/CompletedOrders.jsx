import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function CompletedOrders() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/invoice/all")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // 🔍 Filter by customer name
  const filteredInvoices = invoices.filter((inv) =>
    inv.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="completed-container">
      <h2>✅ Completed Orders (Invoices)</h2>

      <input
        type="text"
        placeholder="🔍 Search customer name..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredInvoices.length === 0 ? (
        <p className="no-data">No invoices found</p>
      ) : (
        filteredInvoices.map((inv) => (
          <div key={inv.id} className="invoice-card">
            <div className="invoice-header">
              <h4>Customer: {inv.username}</h4>
              <p>Date: {inv.invoiceDate}</p>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>₹{item.price}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.total}</td>
                  </tr>
                ))}
                <tr className="grand-total">
                  <td colSpan="3">Grand Total</td>
                  <td>₹{inv.grandTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default CompletedOrders;
