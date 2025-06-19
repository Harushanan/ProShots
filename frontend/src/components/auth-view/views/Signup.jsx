import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Tilt from "react-parallax-tilt";
import axios from "axios";
import { FiMail, FiLock, FiUser, FiMapPin, FiPhone, FiArrowLeft } from "react-icons/fi";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@radix-ui/react-hover-card';

import loginBackground from "../../../assets/bgImage.jpg";
import logo from "../../../assets/LogoHome.jpeg";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [OTPVisible, setOTPVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [conformpassword, setConformpassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters long");
      setIsLoading(false);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    if (!email || !emailPattern.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    const phonePattern = /^0(7[01245678]\d{7})$/;
    if (!phone || !phonePattern.test(phone)) {
      setError("Invalid phone number");
      setIsLoading(false);
      return;
    }

    const strongAddress = /^[a-zA-Z0-9\s,.-]{5,100}$/; 
    if (!address || !strongAddress.test(address)) {
      setError("Please check your address");
      setIsLoading(false);
      return;
    }

    const minLength = 8;
    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$#!%*?&]+$/;

    if (!password || password.length < minLength) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (!strongPassword.test(password)) {
      setError("Password should satisfy password requirements");
      setIsLoading(false);
      return;
    }

    if (password !== conformpassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    axios.post("http://localhost:5000/checkregister", { username, email, password, phone, address })
      .then((result) => {
        if (result.data.message === "EmailAlreadyExists") {
          setError("Email already exists. Try another email");
          setIsLoading(false);
        } else if (result.data.message === "Alreadydeleteuser") {
          setError("This email is blocked from re-Signup");
          setIsLoading(false);
        } else {
          axios.post("http://localhost:5000/send-otp", { email })
            .then((res) => {
              const toastLoad = toast.loading("Processing...");
              setTimeout(() => {
                toast.dismiss(toastLoad);
                setOTPVisible(true);
                toast.success("OTP Sent! Check your email.");
                setIsLoading(false);
              }, 1500);
            })
            .catch((err) => {
              console.error("OTP Error: ", err);
              setError("Failed to send OTP. Try again.");
              setIsLoading(false);
            });
        }
      })
      .catch((err) => {
        console.error("Signup Error: ", err);
        setError("Signup failed. Please try again.");
        setIsLoading(false);
      });
  };

  const otpClose = () => {
    setOTPVisible(false);
    setOtp("");
  }

  const handleOTPSubmit = () => {
    if (!/^\d{5}$/.test(otp)) {
      toast.error("OTP must be 5 digits.");
      return;
    }

    const toastLoadOTP = toast.loading("Verifying OTP...");
    
    axios.post("http://localhost:5000/verify-otp", { email, otp })
      .then((res) => {
        if (res.data.message === "OTP Verified") {
          axios.post("http://localhost:5000/register", { username, email, password, phone, address })
            .then((res) => {
              if (res.data.message == "UserCreated") {
                setTimeout(() => {
                  navigate("/auth/login");
                }, 4000)
              }
            })
            .catch(() => setError("Signup failed. Try again."));
        } else if (res.data.message === "Invalid OTP") {
          setTimeout(() => {
            toast.dismiss(toastLoadOTP);
            toast.error("Invalid OTP. Please try again.");
          }, 2000);
        }
      })
      .catch(() => setError("OTP verification failed. Try again."));
  }

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
        </header>

        {/* Form Section */}
        <div className="flex-grow flex items-center justify-center p-6 -mt-10">
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            style: {
              zIndex: 9999, // Set the desired z-index
            },
          }}
        />    
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-full max-w-xl"
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
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center mb-8"
                    >
                      <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                        Create Account
                      </h2>
                      <p className="text-white/80 text-lg">Join ProShots today</p>
                    </motion.div>

                    <form onSubmit={handleSignup} className="space-y-5">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 text-white pl-10 pr-4 py-4 rounded-xl border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 outline-none transition placeholder-white/50"
                            placeholder="Username"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
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
                            placeholder="Email"
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
                            <FiMapPin className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-white/5 text-white pl-10 pr-4 py-4 rounded-xl border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 outline-none transition placeholder-white/50"
                            placeholder="Address"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 text-white pl-10 pr-4 py-4 rounded-xl border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 outline-none transition placeholder-white/50"
                            placeholder="Phone Number"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 text-white pl-10 pr-4 py-4 rounded-xl border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 outline-none transition placeholder-white/50"
                            placeholder="Password"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                      >
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-white/60" />
                          </div>
                          <input
                            type="password"
                            required
                            value={conformpassword}
                            onChange={(e) => setConformpassword(e.target.value)}
                            className="w-full bg-white/5 text-white pl-10 pr-4 py-4 rounded-xl border border-white/15 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 outline-none transition placeholder-white/50"
                            placeholder="Confirm Password"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <HoverCard>
                          <HoverCardTrigger>
                            <p className="text-white/60 text-sm mt-2 hover:cursor-pointer hover:text-white/80 transition"> 🛈 Password Requirements</p>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-72 p-4 bg-white/70 backdrop-blur-md border border-white/20 text-black rounded-xl shadow-lg z-50">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Must be 8 characters</li>
                              <li>At least one uppercase letter (A-Z)</li>
                              <li>At least one lowercase letter (a-z)</li>
                              <li>At least one number (0-9)</li>
                              <li>At least one special character (@$!%*?&)</li>
                            </ul>
                          </HoverCardContent>
                        </HoverCard>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
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
                              <span>Creating account...</span>
                            </>
                          ) : (
                            <span className="relative">
                              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 hover:opacity-100 rounded-xl transition-opacity"></span>
                              <span className="relative z-10">Sign Up</span>
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
                      className="mt-6"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 bg-transparent text-sm text-white/60">Already have an account?</span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link 
                          to="/auth/login" 
                          className="block w-full py-3 px-4 text-center rounded-xl text-white font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                        >
                          Login
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

      {/* OTP Dialog */}
      <Dialog open={OTPVisible} onOpenChange={otpClose}>
        <DialogContent className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg max-w-md">
          <DialogHeader>
          <Toaster
          richColors
          position="top-center"
          toastOptions={{
            style: {
              zIndex: 9999, // Set the desired z-index
            },
          }}
        />    
            <DialogTitle className="text-2xl font-bold text-white mb-4 text-center">
              Verify Your Email
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6">
            <p className="text-white/80 text-center">
              We've sent a 5-digit code to your email. Please enter it below.
            </p>
            <div className="flex justify-center">
              <InputOTP 
                value={otp} 
                onChange={(value) => setOtp(value)} 
                maxLength={5}
                className="border-white/30"
              >
                <InputOTPGroup className="space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <InputOTPSlot 
                      key={i} 
                      index={i} 
                      className="w-12 h-12 text-xl border-white/30 bg-white/5 text-white"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <button
              onClick={handleOTPSubmit}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Verify & Continue
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Signup; 