import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Contact() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

useEffect(() => {
  const loggedIn = localStorage.getItem("isLoggedIn");
  const storedUsername = localStorage.getItem("username");
  const storedEmail = localStorage.getItem("email");
  const storedRole = localStorage.getItem("role");

  // If not logged in → redirect
  if (loggedIn !== "true") {
    navigate("/login");
    return;
  }

  // If user is NOT customer → redirect
  if (storedRole !== "customer"&& storedRole !== "admin" && storedRole !== "hotel") {
    navigate("/login");
    return;
  }

  setUsername(storedUsername || "");
  setEmail(storedEmail || "");
}, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim() === "") {
      alert("⚠ Please enter a message");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/contact/send", {
        username,
        email,
        message
      });

      alert("✅ Message sent successfully!");
      setMessage(""); // clear textarea
    } catch (err) {
      console.error("Error sending message:", err);
      alert("❌ Failed to send message");
    }
  };

  return (
    <div>
      <section className="contact-section">
        <div className="contact-container">

          <h1>Contact Us</h1>

          <div className="contact-info">
            <p><strong>📍 Address:</strong> Walunj, Beed Road, Pathardi, Maharashtra, India</p>
            <p><strong>📧 Email:</strong> 5starchahawala25@gmail.com</p>
            <p><strong>📞 Phone:</strong> +91 7219349467</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>

            <label>Your Name</label>
            <input type="text" value={username} disabled />

            <label>Your Email</label>
            <input type="email" value={email} disabled />

            <label>Your Message</label>
            <textarea 
              rows="5" 
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>

        </div>
      </section>
    </div>
  );
}

export default Contact;
