import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import img from "./Images/NewLogo.png";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleAdminLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.get("http://localhost:8081/api/users/admin/login", {
      params: { email, password }
    });

    const user = res.data; // 👈 backend returns single object

    if (!user || user.role !== "admin") {
      alert("❌ Invalid credentials or not admin!");
      return;
    }

    // ✅ STORE ADMIN
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", user.role);
    localStorage.setItem("username", user.name);

    alert("✅ Admin login successful");
    navigate("/sales"); // or your admin dashboard route
  } catch (err) {
    console.error(err);
    alert("❌ Login failed");
  }
};


  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <img src={img} className="logo" alt="Admin" />
          <h2>Admin Login</h2>

          <form onSubmit={handleAdminLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn">Login as Admin</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
