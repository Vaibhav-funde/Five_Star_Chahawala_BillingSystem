import React, { useState } from "react";
import axios from "axios";
import App from "./App";

function AddMenu() {
  const [item, setItem] = useState({
    name: "",
    category: "",
    price: "",
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/items", item);
      alert("✅ Item added successfully!");
      setItem({ name: "", category: "", price: "" });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add item.");
    }
  };

  return (
    <div className="add-item-container">
      <h2>Add New Item</h2>
      <form className="add-item-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={item.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={item.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={item.price}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default AddMenu;
