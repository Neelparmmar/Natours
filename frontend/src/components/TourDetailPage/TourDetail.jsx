import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TourMap from "./TourMap";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../Context/userContext";
import { toast } from "react-toastify";

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const { user, bookedTours } = useContext(UserContext);
  const isBooked = bookedTours?.includes(id);
  const navigate = useNavigate();
  useEffect(() => {
    const key = localStorage.getItem("token");
    const token = {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    };
    const fetchTour = async () => {
      try {
        const res = await axiosInstance.get(`/tours/${id}`, token);
        setTour(res.data.data.data);
        // Check if user has already reviewed
        const alreadyReviewed = res.data.data.data.reviews.some(
          (r) => r.user?._id === user._id
        );
        setHasReviewed(alreadyReviewed);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTour();
  }, [id, user]);

  const HandleCheckOut = async (id) => {
    setisLoading(true);
    try {
      const res = await axiosInstance.get(`/bookings/checkout-session/${id}`);
      window.location.href = res.data.session.url;
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("❌ Failed to initiate checkout");
    } finally {
      setisLoading(false);
    }
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const key = localStorage.getItem("token");
    try {
      const res = await axiosInstance.post("/review", {
        review: reviewText,
        rating: Number(rating),
        tour: tour._id,
        user: user._id,
      });
      const updated = await axiosInstance.get(`/tours/${id}`, {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });
      setTour(updated.data.data.data);
      // setTour((prev) => ({
      //   ...prev,
      //   reviews: [...prev.reviews, res.data.data], // if response returns the new review
      // }));
      toast.success("✅ Review submitted!");

      setReviewText("");
      setRating("");
      console.log(res);

      // const res = await axiosInstance.post("/review", {
      //   review: reviewText,
      //   rating: Number(rating),
      //   tour: tour._id,
      //   user: user._id,
      // });

      // Optional: Refresh tour data to update reviews
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "❌ Failed to submit review");
    } finally {
      hasReviewed(true);
    }
  };

  if (!tour) return <p>Loading...</p>;

  // const startDate = new Date(tour.startDates[0]).toLocaleString("default", {
  //   month: "long",
  //   year: "numeric",
  // });

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <img
            src={`/img/tours/${tour.imageCover}`}
            alt=""
            className="header__hero-img"
          />
          <div className="header__hero-overlay"></div>
        </div>

        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name}</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-clock" />
              </svg>
              <span className="heading-box__text">{tour.duration} days</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-map-pin" />
              </svg>
              <span className="heading-box__text">
                {tour.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>

              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                </svg>
                <span className="overview-box__label">Next date</span>
                <span className="overview-box__text">
                  {new Date(tour.startDates[0]).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-trending-up"></use>
                </svg>
                <span className="overview-box__label">Difficulty</span>
                <span className="overview-box__text">{tour.difficulty}</span>
              </div>

              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-user"></use>
                </svg>
                <span className="overview-box__label">Participants</span>
                <span className="overview-box__text">
                  {tour.maxGroupSize} people
                </span>
              </div>

              <div className="overview-box__detail">
                <svg className="overview-box__icon">
                  <use xlinkHref="/img/icons.svg#icon-star"></use>
                </svg>
                <span className="overview-box__label">Rating</span>
                <span className="overview-box__text">
                  {tour.ratingsAverage} / 5
                </span>
              </div>
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>

              {tour.guides.map((guide, index) => (
                <div className="overview-box__detail" key={index}>
                  <img
                    src={`/img/users/${guide.photo}`}
                    alt={guide.role}
                    className="overview-box__img"
                  />
                  <span className="overview-box__label">
                    {guide.role.charAt(0).toUpperCase() + guide.role.slice(1)}
                  </span>
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About the {tour.name}</h2>
          {tour.description.split("\n").map((para, i) => (
            <p className="description__text" key={i}>
              {para}
            </p>
          ))}
        </div>
      </section>
      <section className="section-pictures">
        {tour.images?.map((img, index) => (
          <div className="picture-box" key={index}>
            <img
              className={`picture-box__img picture-box__img--${index + 1}`}
              src={`/img/tours/${img}`}
              alt={`${tour.name} image ${index + 1}`}
            />
          </div>
        ))}
      </section>
      <section className="section-map">
        <TourMap locations={tour.locations} />
      </section>
      <section className="section-reviews">
        <div className="reviews">
          {tour?.reviews?.map(
            (review, index) =>
              review.user ? ( // ✅ only render if user exists
                <div className="reviews__card" key={review._id || index}>
                  <div className="reviews__avatar">
                    <img
                      src={`/img/users/${review.user.photo || "default.jpg"}`}
                      alt={review.user.name}
                      className="reviews__avatar-img"
                    />
                    <h6 className="reviews__user">{review.user.name}</h6>
                  </div>
                  <p className="reviews__text">{review.review}</p>
                  <div className="reviews__rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`reviews__star ${
                          review.rating >= star
                            ? "reviews__star--active"
                            : "reviews__star--inactive"
                        }`}
                      >
                        <use xlinkHref="/img/icons.svg#icon-star" />
                      </svg>
                    ))}
                  </div>
                </div>
              ) : null // Skip rendering if review.user is null
          )}
        </div>
      </section>
      {user && isBooked && !hasReviewed && (
        <section className="section-review-form">
          <div className="review-form">
            <h2 className="heading-secondary ma-bt-lg">Leave a Review</h2>
            <form onSubmit={handleSubmitReview}>
              <textarea
                className="form__input"
                rows="4"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
              <select
                className="form__input"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              >
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 && "s"}
                  </option>
                ))}
              </select>
              <button className="btn btn--green" type="submit">
                Submit Review
              </button>
            </form>
          </div>
        </section>
      )}
      <section className="section-cta">
        <div className="cta">
          {/* Static Logo */}
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Natours logo" />
          </div>

          {/* Dynamic Tour Images */}
          <img
            src={`/img/tours/${tour.images?.[1]}`}
            alt="Tour view 1"
            className="cta__img cta__img--1"
          />
          <img
            src={`/img/tours/${tour.images?.[0]}`}
            alt="Tour view 2"
            className="cta__img cta__img--2"
          />

          {/* Dynamic Content */}
          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              {tour.duration} days. 1 adventure. Infinite memories. Make it
              yours today!
            </p>

            {user ? (
              isBooked ? (
                <button
                  className="btn btn--green span-all-rows"
                  disabled={true}
                >
                  You have already booked this tour.
                </button>
              ) : (
                <button
                  className="btn btn--green span-all-rows"
                  onClick={() => HandleCheckOut(tour._id)}
                >
                  {!isLoading ? "Book tour now!" : "Processing..."}
                </button>
              )
            ) : (
              <button
                className="btn btn--green span-all-rows"
                onClick={() => navigate("/login")}
              >
                Log in to Book Tour!
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TourDetail;
