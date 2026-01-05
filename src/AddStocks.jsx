// AddStocks.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function AddStocks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Cold Drinks
  const fetchColdDrinks = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/items");
      const coldDrinks = res.data.filter(
        (item) => item.category?.name === "Cold Drinks"
      );
      setItems(coldDrinks);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching items:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColdDrinks();
  }, []);

  // Update Stock (inline)
  const handleUpdateStock = async (itemId, quantity, type) => {
    if (quantity <= 0 || isNaN(quantity)) {
      alert("Enter a valid positive quantity");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/items/update-stock", {
        itemId,
        quantity,
        type,
      });
      alert(`Stock ${type === "add" ? "added" : "subtracted"} successfully`);
      fetchColdDrinks();
    } catch (err) {
      console.error(err);
      alert("Error updating stock");
    }
  };

  // Delete Item


  // Filter search results
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="stock-loading">Loading Cold Drinks...</p>;
  if (!items.length) return <p className="stock-loading">No Cold Drinks found.</p>;

  return (
    <div className="stock-page">
      <h2 className="stock-title">🥤 Cold Drinks Stock Management</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search cold drinks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="stock-search"
      />

      <table className="stock-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="4" className="stock-noresult">
                No items match your search.
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.stock ?? 0}</td>
                <td className="stock-actions">
                  <input
                    type="number"
                    placeholder="Qty"
                    className="stock-input"
                    min="1"
                    onChange={(e) =>
                      (item.newStock = Number(e.target.value))
                    }
                  />

                  <button
                    className="stock-btn add-btn"
                    onClick={() =>
                      handleUpdateStock(
                        item.id,
                        item.newStock || 0,
                        "add"
                      )
                    }
                  >
                    Add
                  </button>
                  <button
                    className="stock-btn subtract-btn"
                    onClick={() =>
                      handleUpdateStock(
                        item.id,
                        item.newStock || 0,
                        "subtract"
                      )
                    }
                  >
                    Subtract
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

export default AddStocks;
