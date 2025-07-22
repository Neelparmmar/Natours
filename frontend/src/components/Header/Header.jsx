import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";
import { toast } from "react-toastify";
import axiosInstance from "./../../utils/axiosInstance";
import { API_URL } from "./../../utils/config";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    if (!user) {
      axiosInstance.get("/users/me").then((res) => {
        setUser(res.data.data.data);
      });
    }
  }, [user, setUser]);
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.get("/users/logout");
      setUser(null); // Clear context
      toast.success("Logged Out Successfully");
      // navigate("/login"); // Optional: redirect to login or home
    } catch {
      // console.error("Logout failed:", err);
      toast.error("Logout Failed");
    }
  };
  const navigate = useNavigate();
  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">
          All tours
        </Link>
        {user && (
          <form className="nav__search">
            <button className="nav__search-btn">
              <svg>
                <use xlinkHref="/img/icons.svg#icon-search"></use>{" "}
                {/* ✅ Correct attribute */}
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search tours"
              className="nav__search-input"
            />
          </form>
        )}
      </nav>

      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>

      <nav className="nav nav--user">
        {user && (
          <>
            <Link to="/user-profile/my-booking" className="nav__el">
              My bookings
            </Link>
            <Link to="/user-profile" className="nav__el">
              <img
                src={`${API_URL}/img/users/${user.photo}`}
                alt="User photo"
                className="nav__user-img"
                style={{ width: "50px", height: "50px" }}
              />
              <span>{user.name} </span>
            </Link>
            <Link to="#" className="nav__el" onClick={handleLogout}>
              Log Out
            </Link>
          </>
        )}

        {!user && (
          <>
            <button className="nav__el" onClick={() => navigate("/login")}>
              Log in
            </button>
            <button
              className="nav__el nav__el--cta"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
