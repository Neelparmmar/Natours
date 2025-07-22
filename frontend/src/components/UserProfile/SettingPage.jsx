import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../Context/userContext";
import axiosInstance from "../../utils/axiosInstance";

const SettingPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null); // ✅ Initialize state
  const [isUpdating, setisUpdating] = useState(false);
  const [selectedPhoto, setselectedPhoto] = useState(null);
  const [userPassword, setUserPassword] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });

  const fileInputRef = useRef(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        setProfileData(res.data.data.data); // 👈 or adjust based on API
      } catch (err) {
        if (err.response?.status === 401) {
          // console.log("Not logged in");
        } else {
          // console.error("Error fetching user:", err);
        }
      }
    };

    fetchProfile();
  }, []);
  const HandleUser = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      if (profileData.photo) {
        formData.append("photo", profileData.photo); // 👈 image file
      }

      const res = await axiosInstance.patch("/users/updateMe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("User updated successfully");
      setProfileData(res.data.user);
      setUser(res.data.user);
      setselectedPhoto(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Updation Failed");
      // console.log("Update failed:", error?.response?.data?.message);
    }
  };

  const HandleUserPassword = async (e) => {
    e.preventDefault();
    setisUpdating(true);
    try {
      await axiosInstance.patch("/users/updatepassword", userPassword);
      // console.log("User updated successfully:", res.data);
      toast.success("User Password Changed successfully");
      setUserPassword({
        passwordCurrent: "",
        password: "",
        passwordConfirm: "",
      });
      // ✅ Update context with latest data
    } catch (error) {
      toast.error(error.response?.data.message || error.message);
      // console.error("Password Changed failed:", error);
    } finally {
      setisUpdating(false);
    }
  };
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // console.log(file.name);
    setselectedPhoto(file);
    setProfileData({ ...profileData, photo: file });
  };
  if (!user || !profileData) return <p>Loading....</p>;
  return (
    <div className="user-view__content">
      <div className="user-view__form-container">
        <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
        <form className="form form-user-data">
          <div className="form__group">
            <label className="form__label" htmlFor="name">
              User Name
            </label>
            <input
              id="name"
              type="text"
              className="form__input"
              value={profileData.name || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="form__input"
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              value={profileData.email || ""}
              required
            />
          </div>
          <div className="form__group form__photo-upload">
            <img
              className="form__user-photo"
              src={`/img/users/${user.photo}`}
              alt="User"
            />
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
            {selectedPhoto && (
              <img
                className="form__user-photo"
                src={URL.createObjectURL(selectedPhoto)}
                alt="Preview"
              />
            )}
            {/* Custom styled button triggers file input */}
            <button
              type="button"
              className="btn-text"
              onClick={handleFileClick}
            >
              Choose new photo
            </button>
          </div>
          <div className="form__group right">
            <button className="btn btn--small btn--green" onClick={HandleUser}>
              Save settings
            </button>
          </div>
        </form>
      </div>

      <div className="line">&nbsp;</div>

      <div className="user-view__form-container">
        <h2 className="heading-secondary ma-bt-md">Password change</h2>
        <form className="form form-user-settings">
          <div className="form__group">
            <label className="form__label" htmlFor="password-current">
              Current password
            </label>
            <input
              id="password-current"
              type="password"
              placeholder="••••••••"
              className="form__input"
              required
              minLength="8"
              value={userPassword.passwordCurrent}
              onChange={(e) =>
                setUserPassword({
                  ...userPassword,
                  passwordCurrent: e.target.value,
                })
              }
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="form__input"
              required
              minLength="8"
              value={userPassword.password}
              onChange={(e) =>
                setUserPassword({
                  ...userPassword,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className="form__group ma-bt-lg">
            <label className="form__label" htmlFor="password-confirm">
              Confirm password
            </label>
            <input
              id="password-confirm"
              type="password"
              placeholder="••••••••"
              className="form__input"
              required
              minLength="8"
              value={userPassword.passwordConfirm}
              onChange={(e) =>
                setUserPassword({
                  ...userPassword,
                  passwordConfirm: e.target.value,
                })
              }
            />
          </div>
          <div className="form__group right">
            <button
              className="btn btn--small btn--green"
              onClick={HandleUserPassword}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating.." : "Save password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingPage;
