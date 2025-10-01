import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import img from "./Images/Logo.png";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users", {
        name,
        email,
        password,
        role: "customer", // default role
      });
      alert("Signup successful!");
      window.location.href = "/login";
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="signup-box">
          <img src={img} alt="5 Star Chahawala" className="logo" />
          <h2>Create Account</h2>
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <button type="submit" className="btn">Sign Up</button>
            <p className="login-link">
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
