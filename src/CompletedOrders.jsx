import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function CompletedOrders() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/invoice/all")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // 📅 Date filter logic
  const filterByDate = (invoiceDate) => {
    if (dateFilter === "all") return true;

    const today = new Date();
    const invDate = new Date(invoiceDate);

    if (dateFilter === "today") {
      return invDate.toDateString() === today.toDateString();
    }

    if (dateFilter === "7days") {
      const last7 = new Date();
      last7.setDate(today.getDate() - 7);
      return invDate >= last7;
    }

    if (dateFilter === "30days") {
      const last30 = new Date();
      last30.setDate(today.getDate() - 30);
      return invDate >= last30;
    }

    return true;
  };

  // 🔍 Search + Date filter combined
  const filteredInvoices = invoices.filter((inv) =>
    inv.username.toLowerCase().includes(search.toLowerCase()) &&
    filterByDate(inv.invoiceDate)
  );

  return (
    <div className="completed-container">
      <h2>✅ Completed Orders (Invoices)</h2>

      {/* SEARCH + DATE FILTER */}
      <div className="filter-row">
        <input
          type="text"
          placeholder="🔍 Search customer name..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="date-filter"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {filteredInvoices.length === 0 ? (
        <p className="no-data">No invoices found</p>
      ) : (
        filteredInvoices.map((inv) => (
          <div key={inv.id} className="invoice-card">
            <div className="invoice-header">
              <h4>Customer: {inv.username}</h4>
              <p>Date: {new Date(inv.invoiceDate).toLocaleDateString()}</p>
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
                <tr className="grandtotal">
                  <td colSpan="3"><strong>Grand Total</strong></td>
                  <td><strong>₹{inv.grandTotal}</strong></td>
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
