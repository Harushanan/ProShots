import React from "react";
import { Link, useNavigate } from "react-router-dom";
import userprofile from '../../../assets/userimge.png';
import logo from '../../../assets/Logo.png';
import Cookies from 'js-cookie';
import axios from 'axios';
import "./css/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
  const myemail = userSession.user?.email || "";

  function deleteaccount(email) {
    const confirmDelete = window.confirm("Are you sure you want to delete Your Account ?");
    if (confirmDelete) {
      axios.post("http://localhost:5000/deleteaccount", { myemail: email })
        .then((result) => {
          if (result.data.message === "UserDeleted") {
            Cookies.remove("user");
            navigate('/');
          }
        }) 
        .catch((err) => console.error("Delete Error:", err));
    }
  }

  return (
    <div className="profile-container">
    <header className="profile-header">
      <img src={logo} alt="Logo" className="logo" />
      <Link
        to={userSession.user?.role === "admin" ? "/admin/dashboard" : "/client/home"}
        className="back-button"
      >
        <b>Back</b>
      </Link>
    </header>

    <div className="profile-content">
      <div className="profile-card">
        <img src={userprofile} alt="Profile" className="profile-image" />
        <h2>{userSession.user?.username}</h2>

        <table className="profile-table">
          <tbody>
            <tr><td className="label">Email:</td><td>{userSession.user?.email}</td></tr>
            <tr><td className="label">Phone:</td><td>{userSession.user?.phone}</td></tr>
            <tr><td className="label">Address:</td><td>{userSession.user?.address}</td></tr>
            <tr><td className="label">Role:</td><td>{userSession.user?.role}</td></tr>
          </tbody>
        </table>

        <button onClick={() => navigate('/client/updateprofile')} className="edit-button">Edit Profile</button>
        <button onClick={() => deleteaccount(myemail)} className="delete-button">Delete Account</button>
        <button className="change-password-button">Change Password</button>
      </div>

      <div className="orders-container">
        <h1>Customer Orders & Photography Bookings</h1>
        
        <h2>Orders</h2>
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OD1001</td>
                <td>Custom Mug</td>
                <td>$15.99</td>
                <td>Shipped</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Event Photography</h2>
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Photography ID</th>
                <th>Event</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EB1001</td>
                <td>Birthday</td>
                <td>$50.00</td>
                <td>2025/12/25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Profile;
