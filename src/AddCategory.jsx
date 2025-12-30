import React, { useState } from "react";
import axios from "axios";

function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setMessage("❌ Category name cannot be empty");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/categories", {
        name: categoryName,
      });

      setMessage(`✅ Category "${response.data.name}" added successfully.`);
      setCategoryName(""); // Clear input field after success
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage("❌ Failed to add category");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Category</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Category
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "30px auto",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#1b1a1aff",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
    textAlign: "center",
    border: "1px solid #c83581ff",
  },
  title: {
    marginBottom: "15px",
    color: "#fffdfdff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    backgroundColor: "#242323ff",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    color: "#f4eeeeff",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
    color: "#0ca323ff",
  },
};

export default AddCategory;
