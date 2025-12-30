import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./App.css";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: "" });

  useEffect(() => {
    axios.get(`http://localhost:8081/api/categories/${id}`)
      .then(res => setCategory(res.data))
      .catch(() => alert("❌ Failed to load category"));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    axios.put(`http://localhost:8081/api/categories/${id}`, category)
      .then(() => {
        alert("✔ Category updated successfully");
        navigate("/viewcategory");
      })
      .catch(() => alert("❌ Update failed"));
  };

  return (
    <div className="update-page">
      <div className="update-card">
        <h2>Edit Category</h2>

        <form onSubmit={handleUpdate}>
          <label>Category Name</label>
          <input
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />

          <button type="submit" className="update-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCategory;
