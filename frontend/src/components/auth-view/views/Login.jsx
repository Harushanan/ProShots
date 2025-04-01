import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import Tilt from "react-parallax-tilt";
import Cookies from "js-cookie";
import axios from "axios";

import loginbackground from '../../../assets/loginlogo.png';
import logo from '../../../assets/Logo.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  


  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const loadingToastId = toast.loading("Authenticating...");

    axios
      .post("http://localhost:5000/login", { email, password }, {withCredentials:true})
      .then((result) => {
        const { message, getuser, role } = result.data;

        setTimeout(() => {
          if (message === "Invalid user") {
            setError("New email detected. Please sign up");
            toast.error("Please sign up first");
            toast.dismiss(loadingToastId);
          } else if (message === "Successfullogin") {
            Cookies.set(
              "user",
              JSON.stringify({ user: getuser, expirationTime: Date.now() + 86400000 }),
              { expires: 1 } 
            );
            toast.success("Login Successful!");
            navigate(role === "customer" ? "/client/home" : "/admin/gallery");
          } else if (message === "Invalidcredentials") {
            setError("Incorrect email or password");
            toast.error("Invalid credentials");
            toast.dismiss(loadingToastId);
          }
        }, 1500);
      })
      .catch(() => {
        setError("Server error. Please try again.");
        toast.error("Server error. Try again");
        
      });
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center bg-black p-4 w-full">
        <img src={logo} alt="Logo" className="w-52 h-24" />
        <Link to="/auth/sign-up" className="px-6 py-2 text-lg bg-teal-500 text-white rounded-full">
          Sign Up
        </Link>
      </header>

      {/* Main content */}
      <div className="flex flex-grow">
        {/* Background Image */}
        <div className="hidden md:block flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${loginbackground})` }}></div>

        {/* Form Container */}
        <div className="flex-1 flex justify-center items-center bg-gray-900 p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-auto"
          >
            <Toaster />

            {/* Tilt Effect */}
            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
              <motion.h2 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-bold text-center mb-6"
              >
                Welcome Back
              </motion.h2>
            </Tilt>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="email"
                className="w-full bg-white/10 px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="password"
                className="w-full bg-white/10 px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <Link to="/auth/forgot-password" className="block text-right text-sm text-gray-500 hover:underline">
                Forgot Password?
              </Link>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-black text-white py-3 rounded-lg text-lg font-bold shadow-md hover:bg-gray-800 transition"
              >
                Login
              </motion.button>
            </form>

            {/* Sign-up Link */}
            <p className="text-center text-gray-500 mt-4">
              Don't have an account? <Link to="/auth/sign-up" className="text-blue-500 hover:underline">Sign up</Link>
            </p>

            {/* Error Message */}
            {error && <p className="text-center text-red-500 mt-2">{error}</p>}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
