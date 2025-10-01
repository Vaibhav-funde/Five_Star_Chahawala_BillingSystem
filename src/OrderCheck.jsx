import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function OrderCheck() {
  const [orders, setOrders] = useState([]);

  // Fetch orders from backend
  const fetchOrders = () => {
    axios
      .get("http://localhost:5000/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // This effect runs whenever `orders` changes
useEffect(() => {
  orders.forEach(order => {
    if (order.status === "pending") {
      axios
        .patch(`http://localhost:5000/orders/${order.id}`, { status: "processed" })
        .catch(err => console.error(err));
    }
  });
}, [orders]);

  // Group orders by user
  const groupByUser = orders.reduce((acc, order) => {
    if (!acc[order.username]) acc[order.username] = [];
    acc[order.username].push(order);
    return acc;
  }, {});

  // Print specific user bill
  const handlePrint = (user) => {
    const content = document.getElementById(`bill-${user}`).innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>${user} - Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; color: #007bff; margin: 0; }
            .bill-header { text-align: center; margin-bottom: 20px; }
            .bill-header p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; }
            th { background-color: #f4f4f4; text-align: left; }
            td { text-align: right; }
            td:nth-child(2) { text-align: left; }
            td:nth-child(4) { text-align: center; }
            .total { font-weight: bold; }
            .bill-footer { text-align: center; margin-top: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Cancel all orders of a user
  const handleCancel = (user) => {
    if (window.confirm(`Are you sure you want to cancel all orders for ${user}?`)) {
      const userOrders = groupByUser[user];
      userOrders.forEach((order) => {
        axios
          .delete(`http://localhost:5000/orders/${order.id}`)
          .then(() => {
            setOrders((prev) => prev.filter((o) => o.id !== order.id));
          })
          .catch((err) => console.error("Error deleting order:", err));
      });
    }
  };

  // New function to cancel a specific item
  const handleCancelItem = (orderId, itemId) => {
    setOrders((prevOrders) => {
      // Create a copy of the previous orders state
      const newOrders = [...prevOrders];
      const orderToUpdate = newOrders.find((order) => order.id === orderId);

      if (orderToUpdate) {
        // Filter out the item to be cancelled
        const updatedItems = orderToUpdate.items.filter((item) => item.id !== itemId);
        
        // If the order has no items left, remove the entire order
        if (updatedItems.length === 0) {
          // You would also send a DELETE request to your backend here
          // axios.delete(`http://localhost:5000/orders/${orderId}`);
          return newOrders.filter((order) => order.id !== orderId);
        } else {
          // Otherwise, update the order's items
          orderToUpdate.items = updatedItems;
          // You would also send a PUT or PATCH request to your backend here
          // axios.put(`http://localhost:5000/orders/${orderId}`, { items: updatedItems });
        }
      }
      return newOrders;
    });
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h2>📋 Hotel Admin Dashboard</h2>
        <p>Here you can manage and view all user orders separately.</p>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          Object.keys(groupByUser).map((user, index) => {
            const userOrders = groupByUser[user];
            const subtotal = userOrders.reduce(
              (sum, order) =>
                sum + order.items.reduce((s, i) => s + i.price * i.qty, 0),
              0
            );
            const gst = subtotal * 0.18; // 18% GST
            const grandTotal = subtotal + gst;

            return (
              <div key={index} className="user-sections">
                <div id={`bill-${user}`} className="bill-containers">
                  {/* Bill Header */}
                  <div className="billd">
                    <h2>5 Star Chaiwala</h2>
                    <p>Walunj, Tal-Pathardi Dist-Ahilyanagar 414102</p>
                    <p>Phone No: 7219349467</p>  </div>
                    <div className="line">
                    <p className="customer">👤 Customer: {user}</p>
                    <p className="date">Date: {new Date().toLocaleDateString()}</p>
                    <p className="bill-no">Bill No: {Math.floor(Math.random() * 1000 + 100)}</p>
                  </div>

                  {/* Orders Table */}
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map((order) =>
                        order.items.map((item, i) => (
                          <tr key={`${order.id}-${i}`}>
                            <td>{order.id}</td>
                            <td>{item.name}</td>
                            <td>₹{item.price.toFixed(2)}</td>
                            <td>{item.qty}</td>
                            <td>₹{(item.price * item.qty).toFixed(2)}</td>
                            <td>
                              <button
                                onClick={() => handleCancelItem(order.id, item.id)}
                                className="cancel-item-btn"
                              >
                                ❌
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                      <tr className="total">
                        <td colSpan="4">Subtotal</td>
                        <td>₹{subtotal.toFixed(2)}</td>
                        <td></td>
                      </tr>
                      <tr className="total">
                        <td colSpan="4">GST (18%)</td>
                        <td>₹{gst.toFixed(2)}</td>
                        <td></td>
                      </tr>
                      <tr className="total">
                        <td colSpan="4">Grand Total=</td>
                        <td>₹{grandTotal.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="bill-footer">Thank you for visiting 5 Star Chaiwala! ☕</div>
                </div>

                <button className="print-btn" onClick={() => handlePrint(user)}>
                  🖨️ Print {user}'s Bill
                </button>

                <button className="cancel-btn" onClick={() => handleCancel(user)}>
                  ❌ Cancel {user}'s Order
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default OrderCheck;