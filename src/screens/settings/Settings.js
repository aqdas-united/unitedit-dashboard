import React, { useState, useRef } from "react";
import "./Settings.css";
import USER_PLACEHOLDER from "../../assets/icons/userPlaceholder.png";


const Settings = () => {
  const [user, setUser] = useState({
    name: "Ahmad",
    email: "Alce@gmail.com",
    image: USER_PLACEHOLDER,
  });
  const [newName, setNewName] = useState(user.name);
  const [newImage, setNewImage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should not exceed 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setUser({
      ...user,
      name: newName,
      image: newImage || user.image,
    });

    setSuccess("Profile updated successfully!");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="profile-image-section">
          <div className="profile-image-wrapper" onClick={handleImageClick}>
            <img
              src={newImage || user.image}
              alt="Profile"
              className="profile-image"
            />
          </div>
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter your name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="form-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;