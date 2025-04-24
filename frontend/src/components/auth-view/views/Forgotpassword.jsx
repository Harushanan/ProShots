import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { color, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import axios from "axios";
import loginbackground from "../../../assets/loginlogo.png";
import logo from "../../../assets/Logo.png";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError("");

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    if (!email || !emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const minLength = 8;
    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$#!%*?&]+$/;

    if (!password || password.length < minLength) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      return;
     }

   if (!strongPassword.test(password)) {
     setError("Password not Strong");
     toast.error("Weak password: Use at least 8 characters with one uppercase, lowercase, number, and special character.");
    return;
    }
    
    

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    // toast.loading("Updating password...");
    axios.post("http://localhost:5000/forgotpassword", { email, password })
      .then(({ data }) => {
        const { message } = data;
        if (message === "Invalid user") {
          setError("New email detected. Please sign up");
          toast.error("Email not found. Please sign up.");
        } else if (message === "Password updated successfully") {
          toast.success("Password updated successfully!");
          setTimeout(() => navigate("/auth/login"), 2000);
        }
      })
      .catch(() => {
        setError("Server error. Please try again.");
        toast.error("Server error. Try again");
      });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <Toaster />
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-black">
        <img src={logo} alt="Logo" className="w-64" />
        <Link to="/auth/login" className="px-6 py-2 bg-teal-500 text-white rounded-full font-bold text-lg hover:bg-teal-400">Login</Link>
      </header>

      <div className="relative flex flex-1 h-[80vh]">
        {/* Background Image */}
        <div className="hidden lg:flex flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${loginbackground})` }}></div>
        
        {/* Form Section */}
        <div className="flex flex-1 justify-center items-center bg-gray-900 p-8">
          <motion.form 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleForgotPassword}
            className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Set Your Password</h2>
            
            <label className="block font-semibold text-gray-700">Email</label>
            <input style={{color:"black"}}
              type="email"
              placeholder="Enter your Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            
            <label className="block mt-4 font-semibold text-gray-700">Password</label>
            <input style={{color:"black"}}
              type="password"
              placeholder="Create your Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            
            <label className="block mt-4 font-semibold text-gray-700">Confirm Password</label>
            <input style={{color:"black"}}
              type="password"
              placeholder="Confirm your Password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            
            <button 
              type="submit"
              className="w-full mt-6 bg-black text-white py-2 rounded-lg font-bold text-lg hover:scale-105 transition"
            >Submit</button>
            
            <p className="text-center text-gray-500 text-sm mt-4">The password must be at least 8 characters with one uppercase, lowercase, number, and special character <b>Example: A1@bcdef</b></p>
            {error && <p className="text-center text-red-500 mt-2">{error}</p>}
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;