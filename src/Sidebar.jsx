import React from "react";
import { Link, useNavigate} from "react-router-dom";
import "./App.css";

function Sidebar({ role, setRole }) {

  const navigate = useNavigate();
  

 
  // ❌ Only admin can see sidebar
  if (role !== "admin") return null;

  // 🚀 Logout
  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Admin Dashboard</div>

      <ul className="sidebar-menu">
        <li><Link to="/sales">Sales Report</Link></li>
        <li><Link to="/itemlist">Items Management</Link></li>
        <li><Link to="/allusers">All Users</Link></li>
        <li><Link to="/customermsg">Customer Messages</Link></li>
        <li><Link to="/viewcategory">View Category</Link></li>
        <li><Link to="/addAd">Add Advertisement</Link></li>
        <li><Link to="/updateadd">Manage Advertisements</Link></li>
        <li><Link to="/completedorders">Completed Orders</Link></li>
        <li><Link to="/addstocks">Add Stock</Link></li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
