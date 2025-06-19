import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';
import './css/ProfileUpdate.css';

const ProfileUpdate = () => {
  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

  const [username, setUsername] = useState(userSession?.user?.username || "");
  const [email, setEmail] = useState(userSession?.user?.email || "");
  const [address, setAddress] = useState(userSession?.user?.address || "");
  const [phone, setPhone] = useState(userSession?.user?.phone || "");
  const [profileImage, setProfileImage] = useState(userSession?.user?.profileImage || "");
  const [isChanged, setIsChanged] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alert, setAlert] = useState("");
  const [isEditingImage, setIsEditingImage] = useState(false);

  const navigate = useNavigate();
 
  useEffect(() => {
    const isModified =
      username !== userSession?.user?.username ||
      email !== userSession?.user?.email ||
      address !== userSession?.user?.address ||
      phone !== userSession?.user?.phone ||
      profileImage !== userSession?.user?.profileImage;

    setIsChanged(isModified);
  }, [username, email, address, phone, profileImage, userSession]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/bmp", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG files are allowed");
      return;
    }

    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      setProfileImage(imageUrl);
      setIsEditingImage(false);
    } else {
      setError("Image upload failed.");
    }
  };

  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "proshots_event_management");

      const response = await fetch("https://api.cloudinary.com/v1_1/proshots/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      return null;
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    const realPhone = /^(?:\+94|0)(7[01245678]\d{7})$/;
    if (!realPhone.test(phone)) {
      setError("Invalid phone number");
      return;
    }

    axios.post("http://localhost:5000/updateprofile", {
      username,
      phone,
      address,
      email,
      profileImage,
    })
      .then((res) => {
        const { message, newprofile } = res.data;

        if (message === "Updated successfully") {
          Cookies.remove("user");
          const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
          Cookies.set("user", JSON.stringify({ user: newprofile, expirationTime }), { expires: 1 });

          setSuccess("Details updated successfully!");
          setTimeout(() => navigate('/client/profile'), 2500);
        } else {
          setError("Something went wrong. Try again.");
        }
      })
      .catch((err) => {
        console.error("Profile Update Error:", err);
        setError("Profile update failed. Please try again.");
      });
  };

  const handleImageClick = () => {
    setIsEditingImage(true);
  };

  const handleCancelImageEdit = () => {
    setIsEditingImage(false);
  };

  return (
    <div className="profile-update-container">
      <div className="profile-update-form-container">
        <Link to="/client/profile" className="profile-update-back-btn">
          ← Back
        </Link>
    
        <h1 className="profile-update-title">Update Profile</h1>
    
        <form className="profile-update-form" onSubmit={handleUpdate}>
          {/* Profile Image Section */}
          <div className="profile-image-section">
            {!isEditingImage ? (
              <div className="profile-image-display">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="profile-image-preview"
                    onClick={handleImageClick}
                  />
                ) : (
                  <div 
                    className="profile-image-placeholder"
                    onClick={handleImageClick}
                  >
                    <span>Click to add image</span>
                  </div>
                )}
                <button 
                  type="button" 
                  className="change-image-btn"
                  onClick={handleImageClick}
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="image-upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="profile-update-file-input"
                  id="profileImageInput"
                />
                <label htmlFor="profileImageInput" className="file-input-label">
                  Choose Image
                </label>
                <button
                  type="button"
                  className="cancel-image-btn"
                  onClick={handleCancelImageEdit}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <label className="profile-update-label">Name:</label>
          <input
            type="text"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="profile-update-input"
          />
    
          <label className="profile-update-label">Email:</label>
          <div
            className="profile-update-email-display"
            onMouseOver={() => setAlert("You can't change Email")}
            onMouseOut={() => setAlert("")}
          >
            {email}
          </div>
          {alert && <p className="profile-update-alert">{alert}</p>}
    
          <label className="profile-update-label">Address:</label>
          <input
            type="text"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            className="profile-update-input"
          />
    
          <label className="profile-update-label">Phone:</label>
          <input
            type="text"
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
            className="profile-update-input"
          />
    
          <button
            type="submit"
            disabled={!isChanged}
            className={`profile-update-submit-btn ${!isChanged ? 'disabled' : ''}`}
          >
            Update Profile
          </button>
    
          {success && <p className="profile-update-success">{success}</p>}
          {error && <p className="profile-update-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;