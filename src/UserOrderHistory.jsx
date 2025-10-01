import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function UserOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);

      // Fetch orders for this user
      axios
        .get(`http://localhost:5000/orders?username=${loggedInUser.name}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, []);

  if (!user) {
    return <p>Please log in to view your orders.</p>;
  }

  return (
    <div className="order-history-wrapper">
      <div className="order-history-container">
        <h2>🛒 {user.name}'s Order History</h2>

        {orders.length === 0 ? (
          <p>No past orders found.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const orderTotal = order.items.reduce(
                  (sum, item) => sum + item.price * item.qty,
                  0
                );
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.name} × {item.qty}
                        </div>
                      ))}
                    </td>
                    <td>₹{orderTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserOrderHistory;
