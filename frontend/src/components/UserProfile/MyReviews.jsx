import React, { useEffect, useState } from "react";
import "./MyReviews.css"; // Import the CSS file
import axiosInstance from "../../utils/axiosInstance";

function MyReviews() {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get("/review/my-reviews");
        console.log(res.data.data);

        setReviews(res.data.data); // Adjust if needed based on your API response structure
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <p className="review-loading">Loading reviews...</p>;

  if (!reviews.length) return <p className="review-empty">No reviews found.</p>;

  return (
    <div className="review-main">
      <h2 className="review-heading">MY REVIEWS</h2>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div className="review-card" key={review._id}>
            <div className="review-header">
              <img
                src={
                  review.tour?.imageCover
                    ? `/img/tours/${review.tour.imageCover}`
                    : "/img/tours/default.jpg"
                }
                alt="Tour"
                className="tour-img"
              />
              <div>
                <strong className="tour-name">{review.tour?.name}</strong>
                <div className="review-rating">★ {review.rating}/5</div>
              </div>
            </div>
            <div className="review-body">{review.review}</div>
            <div className="review-footer">
              <img
                src={
                  review.user?.photo
                    ? `/img/users/${review.user.photo}`
                    : "/img/users/default.jpg"
                }
                alt={review.user?.name}
                className="user-photo"
              />
              <span className="user-name">{review.user?.name}</span>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyReviews;
