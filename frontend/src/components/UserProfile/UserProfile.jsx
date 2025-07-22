import React, { useContext } from "react";
import { UserContext } from "../Context/userContext";
import { Outlet, NavLink } from "react-router-dom";

const UserProfile = () => {
  const { user } = useContext(UserContext);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-view">
      <nav className="user-view__menu">
        {user.role === "user" && (
          <ul className="side-nav">
            <li>
              <NavLink
                to="settings"
                className={({ isActive }) =>
                  isActive
                    ? "side-nav__link side-nav__link--active"
                    : "side-nav__link"
                }
              >
                <svg>
                  <use xlinkHref="img/icons.svg#icon-settings" />
                </svg>
                Settings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="my-booking"
                className={({ isActive }) =>
                  isActive
                    ? "side-nav__link side-nav__link--active"
                    : "side-nav__link"
                }
              >
                <svg>
                  <use xlinkHref="img/icons.svg#icon-briefcase" />
                </svg>
                My bookings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="my-reviews"
                className={({ isActive }) =>
                  isActive
                    ? "side-nav__link side-nav__link--active"
                    : "side-nav__link"
                }
              >
                <svg>
                  <use xlinkHref="img/icons.svg#icon-star" />
                </svg>
                My reviews
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="side-nav__link">
                <svg>
                  <use xlinkHref="img/icons.svg#icon-credit-card" />
                </svg>
                Billing
              </NavLink>
            </li>
          </ul>
        )}

        {user.role === "admin" && (
          <div className="admin-nav">
            <h5 className="admin-nav__heading">Admin</h5>
            <ul className="side-nav">
              <li>
                <NavLink to="#" className="side-nav__link">
                  <svg>
                    <use xlinkHref="img/icons.svg#icon-map" />
                  </svg>
                  Manage tours
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="side-nav__link">
                  <svg>
                    <use xlinkHref="img/icons.svg#icon-users" />
                  </svg>
                  Manage users
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="side-nav__link">
                  <svg>
                    <use xlinkHref="img/icons.svg#icon-star" />
                  </svg>
                  Manage reviews
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="side-nav__link">
                  <svg>
                    <use xlinkHref="img/icons.svg#icon-briefcase" />
                  </svg>
                  Manage bookings
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <div className="user-view__content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserProfile;
