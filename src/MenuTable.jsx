import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function MenuTable() {
  const [tables] = useState(Array.from({ length: 10 }, (_, i) => ({ id: i + 1 })));
  const [items, setItems] = useState([]);
  const [activeTable, setActiveTable] = useState(null);
  const [orders, setOrders] = useState({});
  const [quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab] = useState("menu");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  // Fetch menu items
  useEffect(() => {
    axios.get("http://localhost:5000/Item")
      .then(res => setItems(res.data))
      .catch(err => console.error("Error fetching items:", err));
  }, []);

  const handleOrder = (tableId, item) => {
    const qty = quantities[item.id] || 1;
    setOrders(prev => {
      const currentOrders = prev[tableId] || [];
      const index = currentOrders.findIndex(o => o.item.id === item.id);
      if (index >= 0) currentOrders[index].qty += qty;
      else currentOrders.push({ item, qty });
      return { ...prev, [tableId]: [...currentOrders] };
    });
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const removeItem = (tableId, itemId) => {
    setOrders(prev => {
      const currentOrders = prev[tableId] || [];
      const updated = currentOrders.filter(o => o.item.id !== itemId);
      return { ...prev, [tableId]: updated };
    });
  };

  const calculateBill = (tableId) => {
    const currentOrders = orders[tableId] || [];
    const subtotal = currentOrders.reduce((sum, o) => sum + o.item.price * o.qty, 0);
    const gst = subtotal * 0.05;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  const getFilteredItems = () => {
    let updated = [...items];
    if (searchTerm) updated = updated.filter(p => (p?.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterType !== "All") updated = updated.filter(p => (p?.category || "").toLowerCase() === filterType.toLowerCase());
    if (sortOrder === "asc") updated.sort((a, b) => a.price - b.price);
    else if (sortOrder === "desc") updated.sort((a, b) => b.price - a.price);
    return updated;
  };

  return (
    <div className="hotel-container">
      <h2 className="hotel-title">Restaurant Tables</h2>

      {/* Tables */}
      <div className="table-grid">
        {tables.map(table => (
          <div key={table.id} className={`table-card ${activeTable === table.id ? "active" : ""}`}
            onClick={() => { setActiveTable(table.id); setActiveTab("menu"); }}>
            Table {table.id}
            <div className="order-count">{orders[table.id]?.reduce((sum, o) => sum + o.qty, 0) || 0} items</div>
          </div>
        ))}
      </div>

      {activeTable && (
        <div className="menu-bill-section">
          <h3>Table {activeTable}</h3>

          {/* Tabs */}
          <div className="tab-buttons">
            <button className={activeTab === "menu" ? "active-tab" : ""} onClick={() => setActiveTab("menu")}>Menu</button>
            <button className={activeTab === "bill" ? "active-tab" : ""} onClick={() => setActiveTab("bill")}>Bill</button>
          </div>

          {/* Menu */}
          {activeTab === "menu" && (
            <>
              <div className="controls" style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
                <input type="text" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Chai">Chai</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Bun">Bun</option>
                  <option value="Cold Drinks">Cold Drinks</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Juice Bar">Juice Bar</option>
                  <option value="Ice Cream">Ice Cream</option>
                </select>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                  <option value="default">Sort by Price</option>
                  <option value="asc">Low → High</option>
                  <option value="desc">High → Low</option>
                </select>
              </div>

              <div className="chai-container">
                {getFilteredItems().map(product => (
                  <div key={product.id} className="chai-card">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <h4>₹{product.price}</h4>
                    <p>{product.description}</p>
                    <input type="number" min="1" value={quantities[product.id] || 1}
                      onChange={e => setQuantities({ ...quantities, [product.id]: parseInt(e.target.value) })}
                      style={{ width: "40px", marginRight: "8px" }} />
                    <button className="addbt" onClick={() => handleOrder(activeTable, product)}>Add</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Bill */}
          {activeTab === "bill" && (
            <div className="bill-container" id="print-bill">
              <div className="bill-header">
                <h1>5 Star Chaiwala</h1>
                <h4>Walunj, Tal-Pathardi Dist-Ahilyanagar 414102</h4>
                <h4>Phone No: 7219349467</h4>
                <header>
                  <h5>Date: {new Date().toLocaleDateString()}</h5>
                  <p>Table No: <strong>{activeTable}</strong></p>
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
                  {(orders[activeTable] || []).map((o, index) => (
                    <tr key={index}>
                      <td>{o.item.name}</td>
                      <td>{o.qty}</td>
                      <td>₹{o.item.price}</td>
                      <td>₹{(o.item.price * o.qty).toFixed(2)}</td>
                      <td>
                        <button className="remove-btn" onClick={() => removeItem(activeTable, o.item.id)}>❌</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="price-summary">
                <p><strong>Subtotal:</strong> ₹{calculateBill(activeTable).subtotal.toFixed(2)}</p>
                <p><strong>GST (5%):</strong> ₹{calculateBill(activeTable).gst.toFixed(2)}</p>
                <h2><strong>Grand Total:</strong> ₹{calculateBill(activeTable).total.toFixed(2)}</h2>
              </div>

              <footer className="bill-footer">
                <p>🙏 Thank you for visiting! ☕</p>
                <button onClick={() => window.print()} className="print-btn">🖨️ Print / Save Bill</button>
              </footer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuTable;
