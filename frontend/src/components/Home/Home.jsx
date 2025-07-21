import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const [tourData, setTourData] = useState([]);

  useEffect(() => {
    axiosInstance.get(`/tours`).then((res) => setTourData(res.data.data.data));
  }, []);
  if (!tourData) return <p>Loading...</p>;
  return (
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
                <use xlinkHref="img/icons.svg#icon-map-pin"></use>
              </svg>
              <span>{tour.startLocation.description}</span>
            </div>
            <div className="card__data">
              <svg className="card__icon">
                <use xlinkHref="img/icons.svg#icon-calendar"></use>
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
                <use xlinkHref="img/icons.svg#icon-flag"></use>
              </svg>
              <span>{tour.locations.length} stops</span>
            </div>
            <div className="card__data">
              <svg className="card__icon">
                <use xlinkHref="img/icons.svg#icon-user"></use>
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
              <span className="card__footer-value">{tour.ratingsAverage}</span>
              <span className="card__footer-text">
                rating ({tour.ratingsQuantity})
              </span>
            </p>
            <a href={`tours/${tour._id}`} className="btn btn--green btn--small">
              Details
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
