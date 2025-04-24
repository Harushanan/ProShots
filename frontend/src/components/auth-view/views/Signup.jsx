import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import Tilt from "react-parallax-tilt";
import axios from "axios";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot  } from "@/components/ui/input-otp"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@radix-ui/react-hover-card';  // Adjust if using a different library


import loginbackground from "../../../assets/loginlogo.png";
import logo from "../../../assets/Logo.png";

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
  const [conformpassword, setconformpassword] = useState("");
  

  const handleSignup = (e) => {
    e.preventDefault();
    setError(""); 

    
    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    if (!email || !emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const phonePattern = /^0(7[01245678]\d{7})$/;
    if (!phone || !phonePattern.test(phone)) {
      setError("Invalid phone number");
      return;
    }

    const Stongaddress = /^[a-zA-Z0-9\s,.-]{5,100}$/; 
     if (!address || !Stongaddress.test(address)) {
      setError("Please Check your address");
      return;
    }

    const minLength = 8;
    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$#!%*?&]+$/;

    if (!password || password.length < minLength) {
      setError("Password must be at least 8 characters long");
      return;
     }

   if (!strongPassword.test(password)) {
     setError("Password should satisfy password requirements");
    return;
    }


    if(password !== conformpassword){
      setError("Password not match");
      return;

    }


    axios.post("http://localhost:5000/checkregister", { username, email, password, phone, address })
        .then((result) => {
            if (result.data.message === "EmailAlreadyExists") {  
                return setError("Email already exists. Try another email");
            } 

            else if(result.data.message === "Alreadydeleteuser"){
              return setError("This email is blocked from re-Signup");
            }

            else{
                axios.post("http://localhost:5000/send-otp", { email })
            .then((res) => {
                console.log("OTP:", res.data.otp);

                const toastLoad = toast.loading("wait until process ...");

                setTimeout(() => {
                    toast.dismiss(toastLoad);
                    setOTPVisible(true); // Open OTP modal after successful signup
                    toast.dismiss(toastLoad);
                    toast.success("OTP Sent! Check your email.");}, 1500);      

                //navigate("/otp", { state: { username, email, password, phone, address } });
            })
            .catch((err) => {
                console.error("OTP Error: ", err);
                setError("Failed to send OTP. Try again.");
            });
            }
            
        })
        .catch((err) => {
            console.error("Signup Error: ", err);
            setError("Signup failed. Please try again.");
        });

    
  };

  const otpClose = () => {
    setOTPVisible();
    setOtp("");
  }


  const handleOTPSubmit = () => {
    if (!/^\d{5}$/.test(otp)) {
        toast.error("OTP must be 5 digits.");
        return;
    }

  console.log("I am Enter OTP Is : ", otp)
  const toastLoadOTP = toast.loading("Verifying OTP...");
 
 

  axios.post("http://localhost:5000/verify-otp", { email, otp })
  .then((res) => {
      if (res.data.message === "OTP Verified") {
          axios.post("http://localhost:5000/register", { username, email, password, phone, address })
              .then((res) => {

                  if(res.data.message == "UserCreated")
                  setTimeout(() => {
                    navigate("/auth/login");
                  }, 4000)

              })
              .catch(() => setError("Signup failed. Try again."));
      } 
      else if(res.data.message === "Invalid OTP")
      {
        setTimeout(() => {
          toast.dismiss(toastLoadOTP);
          toast.error("Invalid OTP. Please try again.");
          //otpClose();
        }, 2000);
      }
  })
  .catch(() => setError("OTP verification failed. Try again."));


  
  }



  return (
    <div className="h-screen w-screen flex flex-col">
        <Toaster />
      {/* Header */}
      <header className="flex justify-between items-center bg-black p-4">
        <img src={logo} alt="Logo" className="w-52 h-24" />
        <Link to="/auth/login" className="px-6 py-2 text-lg bg-teal-500 text-white rounded-full">
          Login
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Background Image */}
        <div className="hidden md:block flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${loginbackground})` }}></div>

        {/* Signup Form */}
        <div className="flex-1 flex justify-center items-center bg-gray-900 p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-auto"
          >
            <Toaster />

            {/* Title with Tilt Effect */}
            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
              <motion.h2
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-bold text-center mb-6"
              >
                Create Account
              </motion.h2>
            </Tilt>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="text"
                required
                className="w-full bg-white/10 px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />

              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="email"
                required
                className="w-full bg-white/10 px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="text"
                required
                className="w-full bg-white/10 px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
              />

              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="tel"
                required
                className="w-full bg-white/10 px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Phone Number"
                onChange={(e) => setPhone(e.target.value)}
              />

              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="password"
                required
                className="w-full bg-white/10 px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="password"
                required
                className="w-full bg-white/10 px-4 py-3 text-gray-900 placeholder-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Conform Password"
                onChange={(e) => setconformpassword(e.target.value)}
              />
            
                <HoverCard>
                    <HoverCardTrigger>
                    <p className="text-gray-500 text-sm mt-2 hover:cursor-pointer"> 🛈 Password Requirements</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72 p-4 bg-gray-200 text-black rounded-lg shadow-lg">
                        <ul className="list-disc pl-4">
                            <li>Must 8 characters</li>
                            <li>At least one uppercase letter (A-Z)</li>
                            <li>At least one lowercase letter (a-z)</li>
                            <li>At least one number (0-9)</li>
                            <li>At least one special character (e.g., @$!%*?&)</li>
                        </ul>
                    </HoverCardContent>
                </HoverCard>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-black text-white py-3 rounded-lg text-lg font-bold shadow-md hover:bg-gray-800 transition"
              >
                Sign Up
              </motion.button>
            </form>

            {/* Already have an account? */}
            <p className="text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>

            {/* Error Message */}
            {error && <p className="text-center text-red-500 mt-2">{error}</p>}
          </motion.div>
        </div>

        <Dialog open={OTPVisible} onOpenChange={otpClose}>
                    <DialogContent className="bg-white rounded-2xl p-6 shadow-lg">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-gray-800">Enter OTP</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center my-4">
                            <InputOTP value={otp} onChange={setOtp} maxLength={6} className="border-black">
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <div className="flex justify-end">
                            <button className="btn-teal" onClick={handleOTPSubmit}>
                                Verify OTP
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

      </div>
    </div>
  );
};

export default Signup;
