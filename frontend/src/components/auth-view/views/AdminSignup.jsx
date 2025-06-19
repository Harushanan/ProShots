import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";

import loginbackground from '../../../assets/images/loginlogo.png'
import logo from '../../../assets/images/Logo.png'

import axios from 'axios';


function AdminSignup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [address , setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    
    const navigate = useNavigate()

    function handleadminSignup(e) {
        e.preventDefault(); 
        setError("");

        if (!username || username.length < 3) {
            setError("Username must be at least 3 characters long");
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailPattern.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password || !strongPassword.test(password)) {
            setError("Password is not strong");
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


    axios.post("http://localhost:5000/register-admin", { username, email, password, phone})
        .then((result) => {//
            console.log("Response from server: ", result);

            if (result.data.message === "EmailAlreadyExists") {  
                setError("Email already exists. Try another email");
            } 
            else if (result.data.message === "UserCreated") {
                setError("Please wait......");
                setTimeout(() => { navigate('/') }, 3000);
            }
        })
        .catch((err) => {
            console.error("Signup Error: ", err);
            setError("Signup failed. Please try again.");
        });
};

        
         
    
    
            


    return (
        <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px 30px'}}>
                
                <img src={logo} alt="Logo" style={{ width: '260px', height: '100px' }} />
                
                <Link to="/" style={{ display: 'inline-block', padding: '10px 20px', fontSize: '18px', backgroundColor: 'rgb(20, 190, 190)', color: 'white', textDecoration: 'none',  borderRadius: '25px', textAlign: 'center' }}><b>Login</b></Link>

                    
            </header>

            <div className="container" style={{ display: 'flex', flex: 1, height: '80vh' }}>
                <div className="left-side" style={{ flex: 1.5, background: `url(${loginbackground})no-repeat center center/cover`  }}></div>
                <div className="right-side" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '20px' }}>
                    <form onSubmit={handleadminSignup}    className="login-box" style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', width: '100%', maxWidth: '600px' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Admin Signup</h2>
                        <b>Name</b>
                        <input
                            type="text"
                            placeholder="Enter your Username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' , fontSize:'16px' }}
                        />

                        <b>Email</b>
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value.trim())}
                            required
                            style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px'  , fontSize:'16px'}}
                        />

                        <b>Phone number </b>
                        <input
                            type="tel"
                            placeholder="Enter your Phone number"
                            value={phone}
                            name="phone"
                            onChange={(e) => setPhone(e.target.value.trim())}
                            required
                            style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px'  , fontSize:'16px'}}
                        />
                        
                        <b>Password</b>
                        <input
                            type="password"
                            placeholder="Create your Password"
                            value={password}
                            name="password"
                            onChange={(e) => setPassword(e.target.value.trim())}
                            required
                            style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px'  , fontSize:'16px'}}
                        />
                        
                       
                        <button
                            style={{ width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Submit
                        </button>

                        <p style={{textAlign:"center",fontSize:"14px"}}>The password must be at least 8 characters with one uppercase, lowercase, number, and special character <b>Example : A1@bcdef</b></p>
                          { error && <p style={{ textAlign: "center", color: "red" }}>{error}</p> }

                        
                    </form>
                </div>
            </div>
        </>
    );
}

export default AdminSignup;
