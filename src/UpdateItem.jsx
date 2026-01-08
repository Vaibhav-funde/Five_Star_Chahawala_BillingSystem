import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./App.css";

function UpdateItem() {
  const { id } = useParams();           // ✅ ID from URL
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [itemData, setItemData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: { id: "" }
  });

  // 🔹 Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔹 Load item by ID
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/items/${id}`)
      .then(res => {
        const item = res.data;
        setItemData({
          ...item,
          category: { id: item.category?.id }
        });
      })
      .catch(err => console.error(err));
  }, [id]);

  // 🔹 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setItemData({ ...itemData, category: { id: parseInt(value) } });
    } else {
      setItemData({ ...itemData, [name]: value });
    }
  };

  // 🔹 Update item
  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:8081/api/items/${id}`, itemData)
      .then(() => {
        alert("Item updated successfully");
        navigate("/itemlist"); // or admin dashboard
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="update-page">
      <div className="update-card">
        <h2>Edit Item (ID: {id})</h2>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={itemData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              name="price"
              type="number"
              value={itemData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={itemData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              name="image"
              value={itemData.image}
              onChange={handleChange}
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
              {categories.map(cat => (
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
      </div>
    </div>
  );
}

export default UpdateItem;
