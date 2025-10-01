import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import img from "./Images/Logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Fetch user from db.json (JSON Server must be running: json-server --watch db.json --port 5000)
      const res = await axios.get(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );

      if (res.data.length === 0) {
        alert("❌ Invalid credentials");
        return;
      }

      const user = res.data[0];

      // Save to localStorage
      localStorage.setItem("username", user.name);
      localStorage.setItem("role", user.role);

      // Redirect by role
      if (user.role === "hotel") {
        window.location.href = "/hotel-dashboard"; // Hotel Admin Dashboard
      } else {
        window.location.href = "/menu"; // Normal user goes to Menu
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("⚠️ Login failed, please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <img src={img} alt="5 Star Chahawala" className="logo" />
          <h2>Welcome Back!</h2>
          <p>Log in to continue enjoying your chai ☕</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn">
              Log In
            </button>

            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
