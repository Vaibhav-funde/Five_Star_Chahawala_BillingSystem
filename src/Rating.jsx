import React, { useState, useEffect } from "react";
import "./App.css";

function Rating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);

  // Load reviews from localStorage once
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    setReviews(savedReviews);
  }, []);

  // Save reviews whenever they change
  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !message || rating === 0) {
      alert("Please provide your name, message, and rating ⭐");
      return;
    }

    const newReview = { id: Date.now(), name, message, rating };
    setReviews([newReview, ...reviews]);

    // ✅ clear form inputs & stars
    setName("");
    setMessage("");
    setRating(0);
    setHover(0);
  };

  return (
    <div className="rating-container">
      <h1>Rate Our Chai! ☕</h1>

      <form onSubmit={handleSubmit} className="rating-form">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Write your message..."
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

        <button type="submit">Submit Review</button>
      </form>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first! 🌟</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <h3>{review.name}</h3>
              <p>{review.message}</p>
              <p className="review-stars">
                {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Rating;
