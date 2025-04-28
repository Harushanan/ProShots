import React from "react";
import { Link, useNavigate } from "react-router-dom";
import userprofile from '../../../assets/userimge.png';
import logo from '../../../assets/Logo.png';
import Cookies from 'js-cookie';
import axios from 'axios';
import "./css/profile.css";
import Swal from "sweetalert2";

const Profile = () => {
  const navigate = useNavigate();
  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
  const myemail = userSession.user?.email || "";

  const deleteAccount = (email) => {  
    Swal.fire({
      title: "Are you sure?",
      text: "You Want to delete your Account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://localhost:5000/deleteaccount", { myemail: email })
          .then((res) => {
            if (res.data.message === "UserDeleted") {
              Cookies.remove("user");
              Swal.fire("Deleted!", "Your account has been deleted.", "success").then(() => {
                navigate("/");
              });
            }
          })
          .catch((err) => {
            console.error("Delete Error:", err);
            Swal.fire("Error!", "Something went wrong. Please try again.", "error");
          });
      }
    });
  };

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
        <img src={userSession?.user?.profileImage || userprofile} alt="Profile" className="profile-image" />
          <h1 style={{ fontSize: "50px"}}>{userSession.user?.username}</h1>

          <table className="profile-table">
            <tbody>
              <tr><td className="label">Email:</td><td>{userSession.user?.email}</td></tr>
              <tr><td className="label">Phone:</td><td>{userSession.user?.phone}</td></tr>
              <tr><td className="label">Address:</td><td>{userSession.user?.address}</td></tr>
              <tr><td className="label">Role:</td><td>{userSession.user?.role}</td></tr>
            </tbody>
          </table>

          <button onClick={() => navigate('/client/updateprofile')} className="edit-button">Edit Profile</button>
          <button onClick={() => deleteAccount(myemail)} className="delete-button">Delete Account</button>
          <button className="change-password-button" onClick={() => navigate('/client/changepassword')}>Change Password</button>
        </div> 
       </div>
    </div>
  );
};

export default Profile;
