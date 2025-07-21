import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TourMap from "./TourMap";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../Context/userContext";

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    const key = localStorage.getItem("token");
    const token = {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    };
    axiosInstance.get(`/tours/${id}`, token).then((res) => {
      setTour(res.data.data.data);
    });
  }, [id]);

  const HandleCheckOut = async (id) => {
    setisLoading(true);
    try {
      const res = await axiosInstance.get(`/bookings/checkout-session/${id}`);

      window.location.href = res.data.session.url;
    } finally {
      setisLoading(false);
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
      this si no simething iY
      <section className="section-reviews">
        <div className="reviews">
          {tour?.reviews?.map((review, index) => (
            <div className="reviews__card" key={index}>
              <div className="reviews__avatar">
                <img
                  src={`/img/users/${review.user.photo}`}
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
          ))}
        </div>
      </section>
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
              <button
                className="btn btn--green span-all-rows"
                onClick={() => HandleCheckOut(tour._id)}
              >
                {!isLoading ? "Book tour now!" : "Processing..."}
              </button>
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
