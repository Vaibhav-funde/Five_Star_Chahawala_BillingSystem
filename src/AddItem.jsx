import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function AddItem() {
  const [item, setItem] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: ""
  });

  const [categories, setCategories] = useState([]);

  // ✅ Fetch categories from backend
  useEffect(() => {
    axios.get("http://localhost:8081/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Wrap category ID in an object for backend
    const payload = {
      ...item,
      category: { id: item.category }
    };

    try {
      await axios.post("http://localhost:8081/api/items", payload);
      alert("✅ Item added successfully!");
      setItem({ name: "", price: "", description: "", image: "", category: "" });
    } catch (err) {
      console.error("Error adding item:", err.response ? err.response.data : err);
      alert("❌ Failed to add item!");
    }
  };

  return (
    <div className="additem-container">
      <h2>Add New Menu Item</h2>
      <form className="additem-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={handleChange}
          required
        />

        <label>Price (₹):</label>
        <input
          type="number"
          name="price"
          value={item.price}
          onChange={handleChange}
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={item.description}
          onChange={handleChange}
        />

        <label>Image URL:</label>
        <input
          type="text"
          name="image"
          value={item.image}
          onChange={handleChange}
        />

        <label>Category:</label>
        <select
          name="category"
          value={item.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button type="submit">➕ Add Item</button>
      </form>
    </div>
  );
}

export default AddItem;
