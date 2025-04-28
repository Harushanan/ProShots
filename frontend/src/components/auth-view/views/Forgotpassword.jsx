import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { color, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import axios from "axios";
import loginbackground from "../../../assets/loginlogo.png";
import logo from "../../../assets/Logo.png";

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot  } from "@/components/ui/input-otp"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@radix-ui/react-hover-card';  // Adjust if using a different library

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [alertotp, setotpAlert] = useState("");
  const navigate = useNavigate();

   const [alert, setAlert] = useState("");
   const [isChanged, setIsChanged] = useState(false);
  
  const [OTPVisible, setOTPVisible] = useState(false);
  const [otp, setOtp] = useState("");

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

    axios.post("http://localhost:5000/checkupdateuserpw", { email })
    .then((res) => {

      if(res.data.message == "Invalid user"){
        setError("New email detected. Please sign up");
        toast.error("Email not found. Please sign up.");
      }

      else if(res.data.message == "current user"){
        axios.post("http://localhost:5000/send-otpchangepassword", { email , password })
        .then((res) => {
          console.log("OTP:", res.data.otp);
          const toastLoad = toast.loading("Wait until process...");
    
          if(res.data.message == "OTP sent successfully"){
            setTimeout(() => {
              toast.dismiss(toastLoad);
              setOTPVisible(true); 
              toast.success("OTP Sent! Check your email.");
            }, 1500);
          }
        })
        .catch((err) => {
          console.error("OTP Error: ", err);
          setError("Failed to send OTP. Try again.");
        });
       }
    })
    .catch((err) => {
      console.error("OTP Error: ", err);
      setError("Failed to send OTP. Try again.");
    });

  };

   const otpClose = () => {
      setOTPVisible(false);
      setOtp("");
    };
  
    const handleOTPSubmit = () => {

      if (!/^\d{5}$/.test(otp)) {
        toast.error("OTP must be 5 digits.");
        return;
      }
  
      console.log("I entered OTP iS :",otp);
      const toastLoadOTP = toast.loading("Verifying OTP...");

      axios.post("http://localhost:5000/verify-otpchangepassword", { email, otp })
      .then((res) => {
        if (res.data.message === "OTP Verified") {
          
          axios.post("http://localhost:5000/forgotpassword", { email, password })
            .then((res) => {
              const { message } = res.data;
    
              if (message === "Password updated successfully") {
                setTimeout(() => {
                  toast.dismiss(toastLoadOTP);
                  toast.success("Password change Successfully!");
                  setOTPVisible(false);
                  navigate("/auth/login")
                }, 1500);
              }})

            .catch(() => {
              otpClose();
              setError("Server error. Please try again.");
              toast.error("Server error. Try again");
            });
    
        } else if (res.data.message === "Invalid OTP") {
          setTimeout(() => {
            toast.dismiss(toastLoadOTP);
            setotpAlert("Invalid OTP")
            toast.error("Invalid OTP. Please try again.");
            //otpClose(); 
          }, 2000);
        }
      })
      .catch(() => {
        setError("OTP verification failed. Try again.");
      });
    }

      



  return (
    <>
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
              {alert && <p style={{ color: "red", marginRight: "100px" }}>{alert}</p>}
                <button
                  onClick={handleOTPSubmit}
                  style={{
                    backgroundColor: "#38bdf8",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: "600"
                  }}
                >
                  Verify OTP
                </button>
                <br/>
              </div>
            </DialogContent>
          </Dialog>
    </>
  );
};

export default Forgotpassword;