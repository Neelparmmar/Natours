import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./../Context/userContext";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const data = { email, password };

    axiosInstance
      .post("/users/login", data)
      .then((res) => {
        setUser(res.data.user);
        // console.log("Logged in successfully", res);
        toast.success("Logged in Successfully...");
        navigate("/");
      })
      .catch((err) => {
        // console.log(err);

        toast.error(err.response.data.message);
      });
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <form className="form form--login" onSubmit={handleLogin}>
          <div className="form__group">
            <label htmlFor="email" className="form__label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form__group ma-bt-md">
            <label htmlFor="password" className="form__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              className="form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form__group">
            <button type="submit" className="btn btn--green">
              Login
            </button>
          </div>
        </form>
        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
        <p className="signup-text">
          Forgot password?{" "}
          <Link to="/forgetpassword" className="signup-link">
            Reset password
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
