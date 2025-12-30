import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Ensure your CSS includes dark theme styles

import { useNavigate } from 'react-router-dom';

function Rating() {
  
  const navigate = useNavigate();

  const storedUser = sessionStorage.getItem("username") || localStorage.getItem("username") || "";

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name] = useState(storedUser);
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    
    const storedRole = localStorage.getItem("role");
  
    // If not logged in → redirect
    if (loggedIn !== "true") {
      navigate("/login");
      return;
    }
  
    // If user is NOT customer → redirect
    const allowedRoles = ["customer", "hotel", "admin"];

if (!allowedRoles.includes(storedRole)) {
  // User role is not allowed → redirect to login
  navigate("/login");
  return;
}
  
  }, [navigate]);
  

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/reviews");
        setReviews(res.data);

        // Check if user already submitted a review
        const existingReview = res.data.find(review => review.username === name);
        if (existingReview) {
          setHasReviewed(true);
          setRating(existingReview.rating);
          setMessage(existingReview.message);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchReviews();
  }, [name]);

  // Submit or update review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || rating === 0) {
      alert("⚠ Please give rating & message ⭐");
      return;
    }

    try {
      if (hasReviewed) {
        const reviewId = reviews.find(r => r.username === name).id;
        await axios.put(`http://localhost:8081/api/reviews/${reviewId}`, { message, rating });
      } else {
        await axios.post("http://localhost:8081/api/reviews", { username: name, message, rating });
      }

      // Refresh reviews
      const res = await axios.get("http://localhost:8081/api/reviews");
      setReviews(res.data);
      setHasReviewed(true);
      alert("✅ Your review has been submitted!");
    } catch (err) {
      console.log(err);
      alert("Failed to submit review.");
    }
  };

  // Delete review
  const handleDelete = async (id, reviewUser) => {
    if (reviewUser !== name) {
      alert("❌ You can only delete your own review!");
      return;
    }
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`http://localhost:8081/api/reviews/${id}`);
        setReviews(reviews.filter(r => r.id !== id));
        setMessage("");
        setRating(0);
        setHasReviewed(false);
      } catch (err) {
        console.log(err);
        alert("Failed to delete review.");
      }
    }
  };

  return (
    
    <div className="rating-page">
      <h1>Rate Our Chai! ☕</h1>

      {/* Rating Box */}
      <div className="rating-box">
        <form onSubmit={handleSubmit} className="rating-form">
          <input type="text" value={name} readOnly className="readonly-name" />

          <textarea
            placeholder="Write your review..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
          ></textarea>

          <div className="stars">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <span
                  key={starValue}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                  className={`star ${starValue <= (hover || rating) ? "active" : ""}`}
                >
                  ★
                </span>
              );
            })}
          </div>

          <button type="submit">{hasReviewed ? "Update Review" : "Submit Review"}</button>
        </form>
      </div>

      {/* Reviews Box */}
      <div className="reviews-box">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first! 🌟</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <h3>{review.username}</h3>
              <p className="review-message">{review.message}</p>
              <p className="review-stars">
                {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
              </p>
              {review.username === name && (
                <button className="delete-btn" onClick={() => handleDelete(review.id, review.username)}>
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
   
  );
}

export default Rating;
