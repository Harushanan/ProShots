import React, { useEffect, useState } from "react";
import logo from '../../../assets/Logo.png';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

import axios from 'axios';


const ProfileUpdate= () => {
  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
  
  const [alert, setAlert] = useState("");

   const [username, setUsername] = useState(userSession?.user?.username);

   const [email, setEmail] = useState(userSession?.user?.email);
   const [address , setAddress] = useState(userSession?.user?.address);
   const [phone, setPhone] = useState(userSession.user.phone);
   const [error, setError] = useState("");

   const navigate = useNavigate()

  function handleUpdate(e){
    e.preventDefault(); 
    setError("");

    if (!username || username.length < 3) {
        setError("Username must be at least 3 characters long");
        return;
    }


    const realPhone = /^(?:\+94|0)(7[01245678]\d{7})$/;
    if (phone.startsWith("+94")) {
       if (phone.length !== 12 || !realPhone.test(phone)) {
            setError("Invalid phone number");
            return;
        }}
    else if (phone.length !== 10 || !realPhone.test(phone)) {
            setError("Invalid phone number");
            return;
         }

         axios.post("http://localhost:5000/updateprofile", { username, phone, address, email })
         .then((result) => {
             const { message, newprofile } = result.data;
     
             if (message === "Updated successfully") {  
                 setError("Details updated successfully");
     
              
                 Cookies.remove("user");
     
        
                 const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; 
                 Cookies.set("user", JSON.stringify({ user: newprofile, expirationTime }), { expires: 1 });
     
              
                 setTimeout(() => { navigate('/client/profile') }, 3000);
             } 
         })
         .catch((err) => {
             console.error("Profile Update Error: ", err);
             setError("Profile update failed. Please try again.");
         });
     
  }

  
  return (<>
     <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px 30px'}}>
        <img src={logo} alt="Logo" style={{ width: '260px', height: '100px' }} />
        <Link  to="/admin/profile"  style={{ display: 'inline-block', padding: '10px 20px', fontSize: '18px', backgroundColor: 'rgb(20, 190, 190)', color: 'white', textDecoration: 'none', borderRadius: '25px', textAlign: 'center'}}><b>Back</b></Link>
    </header>

  
    <div style={{ maxWidth: "500px", margin: "auto", background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", fontFamily: "'Arial', sans-serif" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center", color: "#333" }}>Update Profile</h1>

    <form onSubmit={handleUpdate}>
      <div style={{ marginBottom: "15px" }}>
      <label style={{ fontSize: "16px", fontWeight: "500", color: "#555", marginBottom: "5px", display: "block" }}>Name:</label>
      <input type="text" name="username" required onChange={(e) => setUsername(e.target.value)}  value={username} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" }} />
    </div>

    <div style={{ marginBottom: "25px" }}>
      <label style={{ fontSize: "16px", fontWeight: "500", color: "#555", marginBottom: "5px", display: "block" }}>Email:</label>
      <div style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px", backgroundColor: "#f9f9f9", boxSizing: "border-box" }} 
            onMouseOver={() => setAlert("You can't change Email")} onMouseOut={() => setAlert("")}>{userSession.user.email}</div>
      { alert && <p style={{color: "red" , fontSize: "14px" }}>{alert}</p> }
    </div>

    <div style={{ marginBottom: "15px" }}>
      <label style={{ fontSize: "16px", fontWeight: "500", color: "#555", marginBottom: "5px", display: "block" }}>Address:</label>
      <input type="text" name="address"  required  onChange={(e) => setAddress(e.target.value)} value={address}  style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" }} />
    </div>

    <div style={{ marginBottom: "25px" }}>
      <label style={{ fontSize: "16px", fontWeight: "500", color: "#555", marginBottom: "5px", display: "block" }}>Phone:</label>
      <input type="text" name="phone"  required onChange={(e) => setPhone(e.target.value)} value={phone}  style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" }} />
    </div>

    <div style={{ marginBottom: "25px" }}>
      <label style={{ fontSize: "16px", fontWeight: "500", color: "#555", marginBottom: "5px", display: "block" }}>Add Your profile:</label>
      <input type="file" name="file" style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box" }} />
    </div>
    
    <br/>
    <br/>

    <button style={{
      width: "100%", padding: "12px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer", transition: "background-color 0.3s"
    }} onMouseOver={e => e.target.style.backgroundColor = "#45a049"} onMouseOut={e => e.target.style.backgroundColor = "#4CAF50"}>
      <b>Update Profile</b>
    </button>

    { error && <p style={{color: "green" , fontSize: "16px", textAlign:"center" }}>{error}</p> }
  </form>
</div>

</>);
};

export default ProfileUpdate;
