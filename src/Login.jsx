import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import img from "./Images/NewLogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get("http://localhost:8081/api/users/login", {
        params: { email, password },
      });

      if (res.data.length > 0) {
        const user = res.data[0];
        alert(`✅ Login successful! Welcome ${user.name}`);

        // 🚫 BLOCK ADMIN LOGIN HERE
      if (user.role === "admin") {
        alert("❌ Admin cannot log in here. Please use admin login page.");
        return;
      }

        // Store user info
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", user.name);
        localStorage.setItem("email", user.email); // ✅ store email
        localStorage.setItem("role", user.role);

        // Redirect based on role
        if (user.role === "hotel") {
          navigate("/hotel-dashboard");
        }
         else {
          navigate("/");
        }
      } else {
        alert("❌ Invalid email or password!");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ Login failed. Try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <img src={img} alt="5 Star Chahawala" className="logo" />
          <h2>Log in</h2>
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

            <button type="submit" className="btn">Log In</button>

            <p className="signup-link">
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
            <p className="forgot-pass">
  <Link to="/forgot-password">Forgot password?</Link>
</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
