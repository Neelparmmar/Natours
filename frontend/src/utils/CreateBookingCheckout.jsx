import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

function CreateBookingCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tour = searchParams.get("tour");
    const user = searchParams.get("user");
    const price = searchParams.get("price");
    // console.log(tour, user, price);

    // If all params exist, call your backend to create booking
    if (tour && user && price) {
      axiosInstance
        .get(
          `/bookings/createBookingCheckout?tour=${tour}&user=${user}&price=${price}`
        )
        .then(() => {
          // Optionally display a message, then redirect
          navigate("/user-profile/my-booking", { replace: true });
        })
        .catch(() => {
          // Optionally handle failure (show error page, etc)
          navigate("/", { replace: true });
        });
    } else {
      // If params not present, or invalid, redirect
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  return <div>Processing your booking...</div>;
}

export default CreateBookingCheckout;
