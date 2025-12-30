import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import img from "./Images/NewLogo.png";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "customer"; // Always customer by default

  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:8081/api/users/signup", {
      name,
      email,
      password,
      role,
    });

    if (res.status === 201 || res.status === 200) {
      alert("✅ Signup successful! Login details sent to your email.");
      window.location.href = "/login";
    }

  } catch (err) {
    if (err.response && err.response.status === 409) {
      alert("❌ Email already registered!");
    } else {
      alert("❌ Server error. Try again later.");
    }
  }
};


  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="signup-box">

          {/* Logo */}
          <img src={img} alt="5 Star Chahawala" className="logo" />

          <h2>Create Account</h2>

          <form onSubmit={handleSignup}>

            {/* Name */}
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
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

            {/* Button */}
            <button type="submit" className="btn">Sign Up</button>

            {/* Link */}
            <p className="login-link">
              Already have an account?{" "}
              <Link to="/login">Log In</Link>
            </p>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Signup;
