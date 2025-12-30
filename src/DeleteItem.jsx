import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function DeleteItem() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state

  // Fetch all items
  const fetchItems = () => {
    axios
      .get("http://localhost:8081/api/items")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      axios
        .delete(`http://localhost:8081/api/items/${id}`)
        .then(() => {
          alert("Item deleted successfully");
          fetchItems(); // Refresh list
        })
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading items...</p>;
  if (!items.length) return <p>No items found.</p>;

  return (
    <div className="delete-container">
      <h2>Delete Items</h2>

      {/* ✅ Search bar */}
      <input
        type="text"
        placeholder="Search items by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table className="delete-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="5">No items match your search.</td>
            </tr>
          ) : (
            filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>₹ {item.price}</td>
                <td>{item.category ? item.category.name : "No category"}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DeleteItem;
