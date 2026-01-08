import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Optional: for custom styling

function CustomerMsg() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); // Optional: search filter

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset page when search changes
  }, [search, messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/contact/messages"
      );
      setMessages(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages.");
      setLoading(false);
    }
  };

  // Optional: search filter
  const filteredMessages = messages.filter(
    (msg) =>
      msg.username.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION LOGIC */
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMessages.length / recordsPerPage);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="customer-msg-container">
      <h2>Customer Messages</h2>

      {/* Search (optional) */}
      <div className="search" style={{ marginBottom: "15px" }}>
        <label style={{ color: "#fff", fontWeight: "bold", marginRight: "10px" }}>
          Search
        </label>
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "300px",
            backgroundColor: "#1a1a1a",
            color: "#fff",
          }}
        />
      </div>

      {filteredMessages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <>
          <table className="customer-msg-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {currentMessages.map((msg, i) => (
                <tr key={msg.id}>
                  <td>{indexOfFirst + i + 1}</td>
                  <td>{msg.id}</td>
                  <td>{msg.username}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={n === currentPage ? "page-btn active" : "page-btn"}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerMsg;
