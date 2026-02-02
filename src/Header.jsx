import React, { useEffect, useState } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import img from "./Images/NewLogo.png";

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [newOrders, setNewOrders] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const hideHeaderRoutes = ["/admin", "/admin-login", "/sales",    "/admin-dashboard"];
const location = useLocation(); 
const [search, setSearch] = useState("");
const navigate = useNavigate();

 


  // ================= HANDLE SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/menu?search=${search}`);
      setSearch("");
    }
  };

  // 🔔 Fetch new orders (hotel)
  const fetchNewOrders = () => {
    axios
      .get("http://localhost:8081/orders")
      .then((res) => {
        const pending = res.data.filter(
          (o) => o.status === "pending"
        ).length;
        setNewOrders(pending);
      })
      .catch((err) => console.error(err));
  };

   useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const name = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");


    if (isLoggedIn && name) {
      setUsername(name);
      setRole(userRole);
    } else {
      setUsername(null);
      setRole(null);
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((sum, i) => sum + i.qty, 0));

    let interval;
    if (userRole === "hotel") {
      fetchNewOrders();
      interval = setInterval(fetchNewOrders, 10000);
    }

    return () => interval && clearInterval(interval);
  }, [location.pathname]); // 🔥 FIX

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    setRole(null);
    setCartCount(0);
    window.location.href = "/login";
  };
  
if (hideHeaderRoutes.includes(location.pathname)) {
  return null;
}

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="header-bar">
        <div className="Logo">
          <img src={img} alt="5 Star Chahawala" />
        </div>

       {/* 🔎 SEARCH BAR */}
<form className="search-bar" onSubmit={handleSearch}>
  <input
    type="text"
    placeholder="Search chai, coffee..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <button type="submit">🔍</button>
</form>

        {/* DESKTOP NAV */}
        <nav className="nav-links">
          <ul>
            {role === "hotel" && (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/table">Tables</Link></li>
                <li><Link to="/rating">Rating</Link></li>
                <li>
                  <Link to="/cart" className="order-btn">
                    🛒 Cart ({cartCount})
                  </Link>
                </li>
                <li>
                  <Link to="/hotel-dashboard" className="order-btn">
                    Orders {newOrders > 0 && <span className="badge">{newOrders}</span>}
                  </Link>
                </li>
                <li>
                  <span className="logout" onClick={handleLogout}>
                    Logout 🧑‍💼
                  </span>
                </li>
              </>
              )}
              
                {/* ================= NOT LOGGED IN ================= */}
{!username && (
  
  <>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/menu">Menu</Link></li>
    <li>
      <Link to="/login" className="logout">Login</Link>
    </li>
  </>
)}

{/* ================= CUSTOMER LOGGED IN ================= */}
{username && role === "customer" && (
  <>
  
    <li><Link to="/">Home</Link></li>
    <li><Link to="/menu">Menu</Link></li>
    <li><Link to="/about">About</Link></li>
    <li><Link to="/contact">Contact</Link></li>
    <li><Link to="/rating">Rating</Link></li>
    <li>
      <Link to="/cart" className="order-btn">
        🛒 Cart ({cartCount})
      </Link>
    </li>
    <li>
      <span className="logout" onClick={handleLogout}>
        Logout 👨🏻‍💻
      </span>
    </li>
  </>
)}

          </ul>
        </nav>

        {/* ✅ MOBILE ICONS */}
        <div className="mobile-only-icons">
          <form className="mobile-search" onSubmit={handleSearch}>
  <input
    type="text"
    placeholder="Search chai..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
   <button type="submit">🔍</button>
</form>
          <Link to="/cart" className="cart-icon">🛒 {cartCount}</Link>
          <button className="menu-btn" onClick={() => setMenuOpen(true)}>☰</button>
        </div>
      </header>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div className={`mobile-sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>✖</button>
 {/* 🔹 COMMON LINKS */}
  <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
  <Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>

  {/* 🔹 CUSTOMER LOGGED IN */}
  {role === "customer" && (
    <>
      <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
      <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
      <Link to="/rating" onClick={() => setMenuOpen(false)}>Rating</Link>
      <Link to="/cart" onClick={() => setMenuOpen(false)}>
        Cart ({cartCount})
      </Link>
    </>
  )}

        {role === "hotel" && (
          <Link to="/hotel-dashboard" onClick={() => setMenuOpen(false)}>
            Orders ({newOrders})
          </Link>
        )}

        {/* 🔓 LOGOUT */}
        {username ? (
          <span className="logout" onClick={handleLogout}>Logout</span>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        )}

        {/* 👤 USER INFO */}
        {username && (
          <div className="mobile-user">
            <span className="user-icon">👤</span>
            <span className="user-name">{username}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
