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

  // 🔍 Search
  if (searchTerm) {
    updated = updated.filter(p =>
      String(p?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  // 📂 Category filter (FIXED)
  if (filterType !== "All") {
    updated = updated.filter(
      p =>
        p?.category?.name &&
        p.category.name.toLowerCase() === filterType.toLowerCase()
    );
  }

  // 💰 Sort
  if (sortOrder === "asc") updated.sort((a, b) => a.price - b.price);
  else if (sortOrder === "desc") updated.sort((a, b) => b.price - a.price);

  return updated;
};


  // 🧾 SAVE INVOICE (SAME AS ORDERCHECK)
const saveInvoice = async () => {
  const tableOrders = orders[activeTable] || [];
  if (!tableOrders.length) {
    alert("No items in bill!");
    return;
  }

  const grandTotal = tableOrders.reduce(
    (sum, o) => sum + o.item.price * o.qty,
    0
  );

  const invoicePayload = {
    username: `Table ${activeTable}`, // or waiter name later
    grandTotal,
    items: tableOrders.map(o => ({
      itemName: o.item.name,
      price: o.item.price,
      qty: o.qty,
      total: o.item.price * o.qty
    }))
  };

  try {
    await axios.post("http://localhost:8081/api/invoice/save", invoicePayload);
    console.log("✅ Invoice saved");
  } catch (err) {
    console.error("❌ Invoice save failed", err);
    alert("Invoice not saved!");
  }
};


  return (
    <div className="hotel-container">
      <h2 className="hotel-title">Restaurant Tables</h2>

      {/* TABLES */}
      {/* TABLES (only when no table selected) */}
{!activeTable && (
  <div className="table-grid">
    {tables.map(table => (
      <div
        key={table.id}
        className="table-card"
        onClick={() => {
          setActiveTable(table.id);
          setActiveTab("menu");
        }}
      >
        Table {table.id}
        <div className="order-count">
          {orders[table.id]?.reduce((sum, o) => sum + o.qty, 0) || 0} items
        </div>
      </div>
    ))}
  </div>
)}


    {/* MENU / BILL SECTION */}
      {activeTable && (
        <div className="menu-bill-section">

          <button className="backbtn" onClick={() => setActiveTable(null)}>
            ← Back to Tables
          </button>

          <div className="table-header">
            <h3>Table {activeTable}</h3>
            <div className="tab-buttons">
              <button className={activeTab === "menu" ? "active-tab" : ""} onClick={() => setActiveTab("menu")}>Menu</button>
              <button className={activeTab === "bill" ? "active-tab" : ""} onClick={() => setActiveTab("bill")}>Bill</button>
            </div>
          </div>

          {/* MENU */}
          {activeTab === "menu" && (
            <>
              <div className="controls">
                <input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="All">All</option>
                  {categories.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                  <option value="default">Sort</option>
                  <option value="asc">Low → High</option>
                  <option value="desc">High → Low</option>
                </select>
              </div>

              <div className="chai-container">
                {getFilteredItems().map(p => (
                  <div className="chai-card" key={p.id}>
                    <img src={p.image} alt={p.name} />
                    <h3>{p.name}</h3>
                    <h4>₹{p.price}</h4>
                    <p>{p.description}</p>
                    

                    <div className="qty-add-row">
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => setQuantities(q => ({ ...q, [p.id]: Math.max(1, (q[p.id] || 1) - 1) }))}>−</button>
                        <span className="qty-value">{quantities[p.id] || 1}</span>
                        <button className="qty-btn" onClick={() => setQuantities(q => ({ ...q, [p.id]: (q[p.id] || 1) + 1 }))}>+</button>
                      </div>
                      <button className="addbt add-inline" onClick={() => handleOrder(activeTable, p)}>ADD</button>
                    </div>
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
                  await saveInvoice();     // 🧾 Invoice table
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
