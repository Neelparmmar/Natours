import React, { useContext, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/users/signup", formData);
      toast.success("Successfully Signup");
      setUser(res.data.user);
      navigate("/");
      // console.log(res);
    } catch {
      toast.error("Failed to Signup");
    }
  };

  return (
    <main className="main">
      <div className="signup-form">
        <h2 className="heading-secondary ma-bt-lg">Create your account</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="form__input"
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form__input"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form__input"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="passwordConfirm">
              Confirm password
            </label>
            <input
              id="passwordConfirm"
              className="form__input"
              type="password"
              name="passwordConfirm"
              placeholder="••••••••"
              required
              minLength="8"
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
          </div>
          <div className="form__group">
            <button className="btn btn--green" type="submit">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Signup;
