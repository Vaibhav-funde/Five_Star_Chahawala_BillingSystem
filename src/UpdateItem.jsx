import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function UpdateItem() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [itemData, setItemData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: { id: "" }, // ✅ category as object with id
  });

  // Fetch all items
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch all categories
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Load selected item data
  useEffect(() => {
    if (selectedId) {
      axios
        .get(`http://localhost:8081/api/items/${selectedId}`)
        .then((res) => {
          const item = res.data;
          // Ensure category is an object with id
          if (item.category && typeof item.category === "object") {
            item.category = { id: item.category.id };
          }
          setItemData(item);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle category separately
    if (name === "category") {
      setItemData({ ...itemData, category: { id: parseInt(value) } });
    } else {
      setItemData({ ...itemData, [name]: value });
    }
  };

  // Handle update
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedId) return alert("Select an item first");

    axios
      .put(`http://localhost:8081/api/items/${selectedId}`, itemData)
      .then(() => alert("Item updated successfully"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="update-page">
      <div className="update-card">
        <h2>Update Item</h2>

        {/* Dropdown to select item */}
        <div className="form-group">
          <label>Select Item</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Select Item --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Form for selected item */}
        {selectedId && (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={itemData.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                name="price"
                type="number"
                value={itemData.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={itemData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                name="image"
                value={itemData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={itemData.category?.id || ""}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="update-btn">
              Update Item
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdateItem;
