import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

function Menu() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const role = localStorage.getItem("role"); // "hotel" or "customer"


  // ✅ Fetch products from backend
  useEffect(() => {
    axios.get('http://localhost:8081/api/items')
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // 🔍 Search + Filter + Sort logic
  useEffect(() => {
    let updated = [...products];

    // Search
    if (searchTerm) {
      updated = updated.filter(product =>
        (product?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterType !== "All") {
      updated = updated.filter(product =>
        (product?.category?.name || "").toLowerCase() === filterType.toLowerCase()
      );
    }

    // Sort by price
    if (sortOrder === "asc") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      updated.sort((a, b) => b.price - a.price);
    }

    setFiltered(updated);
  }, [searchTerm, filterType, sortOrder, products]);

  // Extract unique categories for dropdown
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category?.name)))];

  // Render product cards
  const renderCards = () => {
    if (filtered.length === 0) {
      return <p>No products found.</p>;
    }

    return filtered.map(product => (
      <div key={product.id} className="chai-card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <h4>₹{product.price}</h4>
        <p>{product.description}</p>
        <br />
         {/* ✅ STOCK ONLY FOR HOTEL ROLE & COLD DRINKS */}
{role === "hotel" && product.category?.name === "Cold Drinks" && (
  <p className="stock">
    Stock: {product.stock > 0 ? product.stock : "0"}
  </p>
)}

<Link
  to="/chaid"
  state={product}
  className={`btn order-btn ${
    product.category?.name === "Cold Drinks" && product.stock === 0
      ? "disabled"
      : ""
  }`}
  onClick={e => {
    if (
      product.category?.name === "Cold Drinks" &&
      product.stock === 0
    ) {
      e.preventDefault();
      alert("Out of Stock");
    }
  }}

>
  Add
</Link>

          </div>
    ));
  };

  return (
    <div className="container">
      <h2>☕ Menu List</h2>

      {/* 🔧 Controls */}
      <div className="controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="default">Sort by Price</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* 🧾 Product Grid */}
      <div className="chai-container">
        {renderCards()}
      </div>
    </div>
  );
}

export default Menu;
