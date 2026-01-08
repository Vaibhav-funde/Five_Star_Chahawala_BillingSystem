import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ViewCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // 10 categories per page
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = () => {
    axios
      .get("http://localhost:8081/api/categories")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // DELETE FUNCTION
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`http://localhost:8081/api/categories/${id}`)
        .then(() => {
          alert("🗑 Category deleted successfully!");
          fetchCategories(); // refresh list
        })
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  // Filter search result
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categories]);

  // PAGINATION LOGIC
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredCategories.length / recordsPerPage);

  if (loading) return <p>Loading categories...</p>;
  if (!categories.length) return <p>No categories found.</p>;

  return (
    <div className="view-container">
      <h2>All Categories</h2>

      <button
        className="add-btn"
        onClick={() => navigate(`/addcategory`)}
      >
        Add Category
      </button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table className="view-table">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.length === 0 ? (
            <tr>
              <td colSpan="4">No categories match your search.</td>
            </tr>
          ) : (
            currentCategories.map((cat, i) => (
              <tr key={cat.id}>
                <td>{indexOfFirst + i + 1}</td>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/editcategory/${cat.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION BUTTONS */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}

export default ViewCategory;
