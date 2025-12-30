import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Optional: for custom styling

function CustomerMsg() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
     const response = await axios.get("http://localhost:8081/api/contact/messages");
      setMessages(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages.");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="customer-msg-container">
      <h2>Customer Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <table className="customer-msg-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.id}</td>
                <td>{msg.username}</td>
                <td>{msg.email}</td>
                <td>{msg.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomerMsg;
