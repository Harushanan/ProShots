import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';
import logo from '../../../assets/Logo.png';

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
    console.log("You file type is :" , file)
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/bmp" ,"image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG files are allowed");
      return;
    }

    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      setProfileImage(imageUrl);
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

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #c2e9fb, #a1c4fd)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{
        maxWidth: '600px',
        margin: 'auto',
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        transition: 'transform 0.3s ease-in-out'
      }}>
        <Link to="/client/profile" style={{
          display: 'inline-block',
          padding: '10px 24px',
          fontSize: '16px',
          background: 'linear-gradient(to right, #43e97b, #38f9d7)',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: '600',
          marginBottom: '25px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          ← Back
        </Link>
    
        <h1 style={{
          fontSize: '30px',
          fontWeight: '700',
          marginBottom: '30px',
          textAlign: 'center',
          color: '#222'
        }}>Update Profile</h1>
    
        <form onSubmit={handleUpdate}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Name:</label>
          <input
            type="text"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '15px',
              boxSizing: 'border-box'
            }}
          />
    
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Email:</label>
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f5f7fa',
              borderRadius: '10px',
              color: '#888',
              marginBottom: '10px',
              fontSize: '15px',
              userSelect: 'none'
            }}
            onMouseOver={() => setAlert("You can't change Email")}
            onMouseOut={() => setAlert("")}>
            {email}
          </div>
          {alert && <p style={{ color: 'crimson', fontSize: '14px', marginTop: '-10px', marginBottom: '15px' }}>{alert}</p>}
    
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Address:</label>
          <input
            type="text"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '15px'
            }}
          />
    
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Phone:</label>
          <input
            type="text"
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '15px'
            }}
          />
    
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              display: 'block',
              marginBottom: '25px',
              fontSize: '14px'
            }}
          />
    
          <button
            type="submit"
            disabled={!isChanged}
            style={{
              marginTop: '10px',
              padding: '14px',
              width: '100%',
              background: isChanged ? 'linear-gradient(to right, #667eea, #764ba2)' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              cursor: isChanged ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: isChanged ? '0 6px 16px rgba(102, 126, 234, 0.4)' : 'none'
            }}>
            Update Profile
          </button>
    
          {success && <p style={{ color: 'green', marginTop: '20px', fontWeight: '500' }}>{success}</p>}
          {error && <p style={{ color: 'crimson', marginTop: '20px', fontWeight: '500' }}>{error}</p>}
        </form>
      </div>
    </div>
    
  );
};

export default ProfileUpdate;
