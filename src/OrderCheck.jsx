import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function OrderCheck() {
  const [orders, setOrders] = useState([]);
  const [newItemIds, setNewItemIds] = useState([]);
  const prevItemIdsRef = useRef(new Set());

  // 🔄 Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8081/orders");
      const newOrders = res.data;

      const currentItemIds = new Set(
        newOrders.flatMap(order => order.items.map(i => i.id))
      );

      const newIds = [...currentItemIds].filter(
        id => !prevItemIdsRef.current.has(id)
      );

      if (newIds.length > 0) {
        setNewItemIds(newIds);
        setTimeout(() => setNewItemIds([]), 5000);
      }

      prevItemIdsRef.current = currentItemIds;
      setOrders(newOrders);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      alert("Backend not running!");
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // 👤 Group by user
  const groupByUser = orders.reduce((acc, order) => {
    if (!acc[order.username]) acc[order.username] = [];
    acc[order.username].push(order);
    return acc;
  }, {});

  // 💾 Save Sales
  const saveSales = async (user) => {
    const userOrders = groupByUser[user];
    if (!userOrders) return;

    const soldItems = userOrders.flatMap(order =>
      order.items.map(item => ({
        itemName: item.name,
        quantity: item.qty,
        total: item.price * item.qty
      }))
    );

    await axios.post("http://localhost:8081/sales/add-multiple", soldItems);
  };

  // 🖨️ PRINT + SAVE INVOICE
  const handlePrint = async (user) => {
    const userOrders = groupByUser[user];
    if (!userOrders) return;

    const today = new Date().toLocaleDateString();

    const grandTotal = userOrders.reduce(
      (sum, order) =>
        sum + order.items.reduce((s, i) => s + i.price * i.qty, 0),
      0
    );

    // ✅ SAVE INVOICE
    await axios.post("http://localhost:8081/api/invoice/save", {
      username: user,
      grandTotal,
      items: userOrders.flatMap(order =>
        order.items.map(item => ({
          itemName: item.name,
          price: item.price,
          qty: item.qty,
          total: item.price * item.qty
        }))
      )
    });

    // 🧾 BILL HTML
    let rows = "";
    userOrders.forEach(order => {
      order.items.forEach(item => {
        rows += `
          <tr>
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>₹${(item.price * item.qty).toFixed(2)}</td>
          </tr>
        `;
      });
    });

    const html = `
      <html>
        <head>
          <title>${user} Bill</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1,h4,p { text-align:center; margin:4px; }
            table { width:100%; border-collapse:collapse; margin-top:10px; }
            th,td { border:1px solid black; padding:6px; }
            th { background:#f4f4f4; }
            .total { font-weight:bold; }
          </style>
        </head>
        <body>
          <h1>5 Star Chahawala</h1>
          <h4>Walunj, Pathardi</h4>
          <p>Customer: ${user}</p>
          <p>Date: ${today}</p>

          <table>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
            ${rows}
            <tr class="total">
              <td colspan="3">Grand Total</td>
              <td>₹${grandTotal.toFixed(2)}</td>
            </tr>
          </table>

          <p><b>Thank you! ☕</b></p>
        </body>
      </html>
    `;

    const win = window.open("", "", "width=800,height=600");
    win.document.write(html);
    win.document.close();
    win.print();

    await saveSales(user);

    // 🧹 Clear Orders
    setOrders(prev => prev.filter(o => o.username !== user));
  };

  // ❌ Cancel User Orders
  const handleCancel = async (user) => {
    if (!window.confirm(`Cancel all orders for ${user}?`)) return;

    for (const order of groupByUser[user]) {
      await axios.delete(`http://localhost:8081/orders/${order.id}`);
    }

    setOrders(prev => prev.filter(o => o.username !== user));
  };

  // ❌ Cancel Single Item
  const handleCancelItem = async (orderId, itemId) => {
    await axios.delete(`http://localhost:8081/orders/${orderId}/items/${itemId}`);

    setOrders(prev =>
      prev
        .map(o =>
          o.id === orderId
            ? { ...o, items: o.items.filter(i => i.id !== itemId) }
            : o
        )
        .filter(o => o.items.length > 0)
    );
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h2>📋 Hotel Admin Dashboard</h2>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          Object.keys(groupByUser).map(user => {
            const userOrders = groupByUser[user];
            const firstOrderTime = userOrders[0]?.orderDate;
            const total = userOrders.reduce(
              (sum, o) =>
                sum + o.items.reduce((s, i) => s + i.price * i.qty, 0),
              0
            );

            return (
              <div key={user} className="user-sections">
               <div className="cd">       
                  <h3>Customer: {user}</h3>
                  <h4>
                    Order Placed:{" "}
                    {firstOrderTime &&
                      new Date(firstOrderTime).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                  </h4>
                   <h4>
  Payment: <strong>
    {userOrders[0].paymentMode === "online" ? "online" : "Cash"}
  </strong>
</h4>

                </div>     
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>❌</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map(order =>
                      order.items.map(item => (
                        <tr
                          key={item.id}
                          className={newItemIds.includes(item.id) ? "highlight-new" : ""}
                        >
                          <td>{item.name}</td>
                          <td>₹{item.price}</td>
                          <td>{item.qty}</td>
                          <td>₹{item.price * item.qty}</td>
                          <td>
                            <button onClick={() => handleCancelItem(order.id, item.id)}>❌</button>
                          </td>
                        </tr>
                      ))
                    )}
                    <tr className="total">
                      <td colSpan="3">Grand Total</td>
                      <td>₹{total}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

                <div className="action-buttons">
                  <button className="print-btn" onClick={() => handlePrint(user)}>
                    🖨️ Print & Save Bill
                  </button>
                  <button className="cancel-btn" onClick={() => handleCancel(user)}>
                    ❌ Cancel Order
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default OrderCheck;