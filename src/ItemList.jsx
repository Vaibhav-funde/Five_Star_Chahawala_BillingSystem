import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state

  // Fetch items from backend
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/items")
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setLoading(false);
      });
  }, []);

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading items...</p>;

  return (
    <div className="item-list-container">
      <h2>Items List</h2>

      {/* ✅ Search bar */}
      <input
        type="text"
        placeholder="Search items by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredItems.length === 0 ? (
        <p>No items match your search.</p>
      ) : (
        <div className="item-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              <p className="item-id">ID: {item.id}</p>
              {item.image && <img src={item.image} alt={item.name} />}
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="price">₹ {item.price}</p>
              <p className="category">
                {item.category ? item.category.name : "No category"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;
