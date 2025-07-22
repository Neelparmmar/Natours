import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "./../../utils/axiosInstance";
import { UserContext } from "../Context/userContext";
import { Link } from "react-router-dom";

const MyBooking = () => {
  const [tourData, setTourData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setBookedTours } = useContext(UserContext);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/bookings/myBookings");
        setTourData(res.data.data.tours); // assuming it's an array of tours
        setBookedTours(res.data.data.tours.map((t) => t._id));
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [setBookedTours]);

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div style={{ color: "red" }}>❌ {error}</div>;

  return (
    <section className="section-tours">
      <div className="card-container">
        {tourData.map((tour) => (
          <div className="card" key={tour._id}>
            <div className="card__header">
              <div className="card__picture">
                <div className="card__picture-overlay">&nbsp;</div>
                <img
                  src={`/img/tours/${tour.imageCover}`}
                  alt={tour.name}
                  className="card__picture-img"
                />
              </div>

              <h3 className="heading-tertirary">
                <span>{tour.name}</span>
              </h3>
            </div>

            <div className="card__details">
              <h4 className="card__sub-heading">
                {tour.difficulty.charAt(0).toUpperCase() +
                  tour.difficulty.slice(1)}{" "}
                {tour.duration}-day tour
              </h4>
              <p className="card__text">{tour.summary}</p>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                </svg>
                <span>{tour.startLocation.description}</span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar"></use>
                </svg>
                <span>
                  {new Date(tour.startDates[0]).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-flag"></use>
                </svg>
                <span>{tour.locations.length} stops</span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-user"></use>
                </svg>
                <span>{tour.maxGroupSize} people</span>
              </div>
            </div>

            <div className="card__footer">
              <p>
                <span className="card__footer-value">${tour.price}</span>
                <span className="card__footer-text">per person</span>
              </p>
              <p className="card__ratings">
                <span className="card__footer-value">
                  {tour.ratingsAverage}
                </span>
                <span className="card__footer-text">
                  rating ({tour.ratingsQuantity})
                </span>
              </p>
              <Link
                to={`/tours/${tour._id}`}
                className="btn btn--green btn--small"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyBooking;
