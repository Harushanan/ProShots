import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Tilt from "react-parallax-tilt";
import Cookies from "js-cookie";
import axios from "axios";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

import loginBackground from '../../../assets/bgImage.jpg';
import logo from '../../../assets/LogoHome.jpeg';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    const loadingToastId = toast.loading("Authenticating...");

    try {
      const result = await axios.post(
        "http://localhost:5000/login", 
        { email, password }, 
        { withCredentials: true }
      );

      const { message, getuser, role } = result.data;

      setTimeout(() => {
        if (message === "Invalid user") {
          setError("New email detected. Please sign up");
          toast.error("Please sign up first");
        } else if (message === "Successfullogin") {
          Cookies.set(
            "user",
            JSON.stringify({ 
              user: getuser, 
              expirationTime: Date.now() + 86400000 
            }),
            { expires: 1 }
          );
          toast.success("Login Successful!");
          navigate(role === "customer" ? "/client/home" : "/admin/gallery");
        } else if (message === "Invalidcredentials") {
          setError("Incorrect email or password");
          toast.error("Invalid credentials");
        }
        toast.dismiss(loadingToastId);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError("Server error. Please try again.");
      toast.error("Server error. Try again");
      setIsLoading(false);
      toast.dismiss(loadingToastId);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-cover bg-center relative">
      <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('/bgImage.jpg')] before:bg-cover before:bg-center before:animate-zoom-bg before:scale-110 before:z-0">
      </div>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Floating light particles */}  
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0
          }}
          animate={{ 
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            opacity: [0, 0.4, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm"
          style={{
            width: `${Math.random() * 15 + 5}px`,
            height: `${Math.random() * 15 + 5}px`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col ">
        {/* Header */}
        <header className="flex justify-between items-center p-6 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
          >
            <img 
              src={logo} 
              alt="ProShots Logo" 
              className="h-16 w-auto rounded-lg shadow-lg"
              onClick={() => navigate('/')}
            />
          </motion.div>
        </header>

        {/* Form Section */}
        <div className="flex-grow flex items-center justify-center p-6 -mt-16">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-full max-w-md"
            >
              <Tilt 
                tiltMaxAngleX={5} 
                tiltMaxAngleY={5} 
                glareEnable={true}
                glareMaxOpacity={0.15}
                glareColor="#ffffff"
                glarePosition="all"
                className="rounded-3xl"
                scale={1.02}
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-8">
                    <Toaster richColors position="top-right" />
                    
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center mb-8"
                    >
                      <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                        Welcome Back
                      </h2>
                    </motion.div>

                    <form onSubmit={handleLogin} className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 text-white pl-10 pr-4 py-4 rounded-xl border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 outline-none transition placeholder-white/50"
                            placeholder="Enter your email"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 text-white pl-10 pr-10 py-4 rounded-xl border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 outline-none transition placeholder-white/50"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <FiEyeOff className="h-5 w-5 text-black hover:text-black/60 transition" />
                            ) : (
                              <FiEye className="h-5 w-5 text-black hover:text-black/60 transition" />
                            )}
                          </button>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                        </div>

                        <Link 
                          to="/auth/forgot-password" 
                          className="text-sm text-white/70 hover:text-white hover:underline transition"
                        >
                          Forgot password?
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl text-lg font-semibold text-white transition-all ${
                            isLoading 
                              ? 'bg-purple-600/50' 
                              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/30'
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Signing in...</span>
                            </>
                          ) : (
                            <span className="relative">
                              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 hover:opacity-100 rounded-xl transition-opacity"></span>
                              <span className="relative z-10">Sign In</span>
                            </span>
                          )}
                        </button>
                      </motion.div>
                    </form>

                    {error && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-center text-red-600 text-base"
                      >
                        {error}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mt-8"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 bg-transparent text-sm text-white/60">New to ProShots?</span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link 
                          to="/auth/sign-up" 
                          className="block w-full py-3 px-4 text-center rounded-xl text-white font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                        >
                          Create an account
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;