import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function MenuTable() {
  // Tables
  const [tables] = useState(Array.from({ length: 20 }, (_, i) => ({ id: i + 1 })));

  // Items & Categories
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load from storage
  const [activeTable, setActiveTable] = useState(() => {
    const saved = localStorage.getItem("activeTable");
    return saved ? JSON.parse(saved) : null;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : {};
  });
  const [quantities, setQuantities] = useState(() => {
    const saved = localStorage.getItem("quantities");
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState("menu");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  // Fetch menu items
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Save orders, quantities, active table
  useEffect(() => { localStorage.setItem("orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("quantities", JSON.stringify(quantities)); }, [quantities]);
  useEffect(() => { localStorage.setItem("activeTable", JSON.stringify(activeTable)); }, [activeTable]);

  // Add item to order
  const handleOrder = (tableId, item) => {
    const qty = parseInt(quantities[item.id] || 1);
    if (qty < 1) return;

    setOrders(prev => {
      const currentOrders = prev[tableId] || [];
      const index = currentOrders.findIndex(o => o.item.id === item.id);
      if (index >= 0) currentOrders[index].qty += qty;
      else currentOrders.push({ item, qty });
      return { ...prev, [tableId]: [...currentOrders] };
    });

    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    alert(`✅ Added ${qty} x ${item.name} to Table ${tableId}`);
  };

  // Remove item
  const removeItem = (tableId, itemId) => {
    setOrders(prev => {
      const updated = (prev[tableId] || []).filter(o => o.item.id !== itemId);
      return { ...prev, [tableId]: updated };
    });
  };

  // Clear bill
  const clearBill = (tableId) => {
    setOrders(prev => ({ ...prev, [tableId]: [] }));
  };

  // Calculate bill
  const calculateBill = (tableId) => {
    const currentOrders = orders[tableId] || [];
    const subtotal = currentOrders.reduce((sum, o) => sum + o.item.price * o.qty, 0);
    return { subtotal, total: subtotal };
  };

  // Save bill to DB
  const saveBillToDB = async () => {
    const tableOrders = orders[activeTable] || [];
    if (!tableOrders.length) return alert("No items to save!");
    const soldItems = tableOrders.map(o => ({
      tableNo: activeTable,
      itemName: o.item.name,
      quantity: o.qty,
      price: o.item.price,
      total: o.item.price * o.qty,
      billDate: new Date().toISOString(),
    }));
    try {
      await axios.post("http://localhost:8081/sales/add-multiple", soldItems);
      alert("✅ Bill saved to Sales Database!");
    } catch (err) {
      console.error(err);
      alert("❌ Could not store bill! Check backend logs.");
    }
  };

  // Filtered items
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

      {/* TABLES */}
      <div className="table-grid">
        {tables.map(table => (
          <div
            key={table.id}
            className={`table-card ${activeTable === table.id ? "active" : ""}`}
            onClick={() => { setActiveTable(table.id); setActiveTab("menu"); }}
          >
            Table {table.id}
            <div className="order-count">
              {orders[table.id]?.reduce((sum, o) => sum + o.qty, 0) || 0} items
            </div>
          </div>
        ))}
      </div>

      {activeTable && (
        <div className="menu-bill-section">
          <h3>Table {activeTable}</h3>

          {/* TABS */}
          <div className="tab-buttons">
            <button className={activeTab === "menu" ? "active-tab" : ""} onClick={() => setActiveTab("menu")}>Menu</button>
            <button className={activeTab === "bill" ? "active-tab" : ""} onClick={() => setActiveTab("bill")}>Bill</button>
          </div>

          {/* MENU */}
          {activeTab === "menu" && (
            <>
              <div className="controls" style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                {/* Dynamic category dropdown */}
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="All">All Types</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>

                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
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

                    <input
                      type="number"
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) => setQuantities({ ...quantities, [product.id]: parseInt(e.target.value) })}
                      style={{ width: "40px", marginRight: "8px" }}
                    />

                    <button className="addbt" onClick={() => handleOrder(activeTable, product)}>Add</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* BILL */}
          {activeTab === "bill" && (
            <div className="bill-container" id="print-bill">
              {/* BILL HEADER */}
              <div className="bill-header">
                <h1>5 Star Chahawala</h1>
                <h4>Walunj, Tal-Pathardi Dist-Ahilyanagar 414102</h4>
                <h4>Phone: 7219349467</h4>

                {/* Top info banner */}
                <div className="bill-info">
                  <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                  <div><strong>Table No:</strong> {activeTable}</div>

                </div>
              </div>

              {/* BILL TABLE */}
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
                  {(orders[activeTable] || []).map((o, i) => (
                    <tr key={i}>
                      <td>{o.item.name}</td>
                      <td>{o.qty}</td>
                      <td>₹{o.item.price}</td>
                      <td>₹{(o.qty * o.item.price).toFixed(2)}</td>
                      <td>
                        <button className="remove-btn" onClick={() => removeItem(activeTable, o.item.id)}>❌</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="price-summary">
                <h2><strong>Grand Total:</strong> ₹{calculateBill(activeTable).total.toFixed(2)}</h2>
              </div>

              <footer className="bill-footer">
                <p>🙏 Thank you for visiting! ☕</p>
                <button className="print-btn" onClick={async () => {
                  await saveBillToDB();
                  window.print();
                  setTimeout(() => clearBill(activeTable), 800);
                }}>
                  🖨️ Print & Save Bill
                </button>
              </footer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuTable;
