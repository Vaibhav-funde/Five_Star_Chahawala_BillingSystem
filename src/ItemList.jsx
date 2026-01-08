import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios
      .get("http://localhost:8081/api/items")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  /* RESET PAGE ON SEARCH */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, items]);

  // 🔍 SEARCH FILTER
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* PAGINATION LOGIC (same as TodaySale) */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // 🔴 DELETE ITEM
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    axios
      .delete(`http://localhost:8081/api/items/${id}`)
      .then(fetchItems)
      .catch((err) => console.error(err));
  };

  // 🟡 EDIT ITEM
  const handleEdit = (id) => {
    navigate(`/update-item/${id}`);
  };

  if (loading) return <p>Loading items...</p>;

  return (
    <div className="item-list-container">
      <h2>Items List</h2>

      {/* SEARCH + ADD */}
      <div className="list-header">
        <input
          type="text"
          placeholder="Search items by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <button
          className="add-item-btn"
          onClick={() => navigate("/additem")}
        >
          ➕ Add Item
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <p>No items found</p>
      ) : (
        <>
          {/* ITEMS GRID */}
          <div className="item-grid">
            {currentItems.map((item) => (
              <div key={item.id} className="item-card">
                <p className="item-id">ID: {item.id}</p>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                  />
                )}

                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="price">₹ {item.price}</p>

                <div className="category-row">
                  <span className="category-name">
                    {item.category ? item.category.name : "No category"}
                  </span>

                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item.id)}
                    >
                      ✏ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

export default ItemList;
