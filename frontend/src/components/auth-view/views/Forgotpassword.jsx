import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Tilt from "react-parallax-tilt";
import axios from "axios";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";

import loginBackground from "../../../assets/bgImage.jpg";
import logo from "../../../assets/LogoHome.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    const minLength = 8;
    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$#!%*?&]+$/;

    if (!password || password.length < minLength) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (!strongPassword.test(password)) {
      setError("Password not Strong");
      toast.error("Weak password: Use uppercase, lowercase, number, and special character.");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const loadingToast = toast.loading("Updating password...");
    
    try {
      const { data } = await axios.post("http://localhost:5000/forgotpassword", { email, password });
      const { message } = data;
      
      if (message === "Invalid user") {
        setError("Email not found. Please sign up.");
        toast.error("Email not found. Please sign up.");
      } else if (message === "Password updated successfully") {
        toast.success("Password updated successfully!");
        setTimeout(() => navigate("/auth/login"), 2000);
      }
    } catch (err) {
      setError("Server error. Please try again.");
      toast.error("Server error. Try again");
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
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
      <div className="relative z-10 min-h-screen flex flex-col">
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
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link 
              to="/auth/login" 
              className="flex items-center gap-2 px-6 py-3 text-lg bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 hover:border-white/30 transition-all shadow-lg"
            >
              <FiArrowLeft className="text-lg" />
              <span>Back to Login</span>
            </Link>
          </motion.div>
        </header>

        {/* Form Section */}
        <div className="flex-grow flex items-center justify-center p-6">
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
                        Reset Password
                      </h2>
                      <p className="text-white/80 text-lg">Enter your email and new password</p>
                    </motion.div>

                    <form onSubmit={handleForgotPassword} className="space-y-6">
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
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 text-white pl-10 pr-4 py-4 rounded-xl border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 outline-none transition placeholder-white/50"
                            placeholder="New password"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/5 text-white pl-10 pr-4 py-4 rounded-xl border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 outline-none transition placeholder-white/50"
                            placeholder="Confirm new password"
                          />
                        </div>
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
                              <span>Updating...</span>
                            </>
                          ) : (
                            <span className="relative">
                              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 hover:opacity-100 rounded-xl transition-opacity"></span>
                              <span className="relative z-10">Reset Password</span>
                            </span>
                          )}
                        </button>
                      </motion.div>
                    </form>

                    {error && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 text-center text-red-300 text-sm"
                      >
                        {error}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mt-6 text-center"
                    >
                      <p className="text-white/60 text-sm">
                        Password must contain:
                        <span className="block mt-1 text-white/70">
                          8+ chars, uppercase, lowercase, number, special character
                        </span>
                      </p>
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

export default ForgotPassword;