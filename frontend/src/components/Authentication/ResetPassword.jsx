import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.patch(`/users/resetPassword/${token}`, {
        password,
        passwordConfirm,
      });
      toast.success("Password reset successful. Please log in.");
      navigate("/login");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Password reset failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Reset Your Password</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="password" className="form__label">
              New Password
            </label>
            <input
              id="password"
              type="password"
              className="form__input"
              placeholder="Enter new password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form__group">
            <label htmlFor="passwordConfirm" className="form__label">
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              type="password"
              className="form__input"
              placeholder="Confirm new password"
              minLength={8}
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form__group">
            <button type="submit" className="btn btn--green" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
