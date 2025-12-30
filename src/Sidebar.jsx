import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Sidebar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  if (role !== "admin") return null; // Show only for admin

  // 🚀 Logout function
  const handleLogout = () => {
    localStorage.clear();          // Remove all user data
    navigate("/login");            // Redirect to login page
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Admin Dashboard</div>

      <ul className="sidebar-menu">
        <li><Link to="/sales">Sales Report</Link></li>
        <li><Link to="/crud">Items Managements</Link></li>
        <li><Link to="/total">Total Users</Link></li>
        <li><Link to="/allusers">All Users</Link></li>
        <li><Link to="/customermsg">Customer Messages</Link></li>
        <li><Link to="/addcategory">Add Category</Link></li>
        <li><Link to="/viewcategory">View Category</Link></li>
        <li><Link to="/addAd">Add Advertisement</Link></li>
        <li><Link to="/updateadd">Manage Advertisements</Link></li>
        <li><Link to="/completedorders">Completed Orders</Link></li>
       
      </ul>

      {/* 🔥 Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
