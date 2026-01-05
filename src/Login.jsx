import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import img from "./Images/NewLogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8081/api/users/login",
        {
          email: email,
          password: password,
        }
      );

      const user = res.data;

      // 🚫 BLOCK ADMIN LOGIN
      if (user.role === "admin") {
        alert("❌ Admin cannot log in here. Use Admin Login page.");
        setLoading(false);
        return;
      }

      // ✅ SAVE USER DATA
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);

      alert(`✅ Login successful! Welcome ${user.name}`);

      // 🔁 REDIRECT BASED ON ROLE
      if (user.role === "hotel") {
        navigate("/hotel-dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <img src={img} alt="5 Star Chahawala" className="logo" />
          <h2>Log In</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="forgot-pass">
              <Link to="/forgot-password">Forgot password?</Link>
            </p>

            <p className="signup-link">
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
