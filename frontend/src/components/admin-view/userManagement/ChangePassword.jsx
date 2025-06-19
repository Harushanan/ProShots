import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { Toaster, toast } from "sonner";

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot  } from "@/components/ui/input-otp"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@radix-ui/react-hover-card';  // Adjust if using a different library
import { Center } from "@react-three/drei";

const ChangePassword = () => {
  const navigate = useNavigate();
  const userSession = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  const myemail = userSession.user?.email || "";

  const [email, setEmail] = useState(myemail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); 
  const [alert, setAlert] = useState("");
  const [alertotp, setotpAlert] = useState(""); 
  const [isChanged, setIsChanged] = useState(false);

  const [OTPVisible, setOTPVisible] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError("");

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    if (!email || !emailPattern.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Invalid email");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

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

          if (message === "Invalid user") {
            setError("New email detected. Please sign up");
          } 
          else {
            setTimeout(() => {
              toast.dismiss(toastLoadOTP);
              toast.success("Password change Successfully!");
              setOTPVisible(false);
              navigate("/client/profile");
            }, 1500);
          }
        })
        .catch(() => {
          setError("Server error. Please try again.");
          toast.error("Server error. Try again");
        });

    } else if (res.data.message === "Invalid OTP") {
      setTimeout(() => {
        toast.dismiss(toastLoadOTP);
        setotpAlert("Invalid OTP");
        toast.error("Invalid OTP. Please try again.");
        //otpClose(); (commented, as in your code)
      }, 2000);
    }
  })
  .catch(() => {
    setError("OTP verification failed. Try again.");
  });


  
    
  };

  return (
    <>
      <Toaster />
      <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{
          maxWidth: '600px',
          margin: 'auto',
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          transition: 'transform 0.3s ease-in-out'
        }}>
          <Link to="/client/profile" style={{
            display: 'inline-block',
            padding: '10px 24px',
            fontSize: '16px',
            background: 'linear-gradient(to right, #43e97b, #38f9d7)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: '600',
            marginBottom: '25px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            ← Back
          </Link>

          <h1 style={{
            fontSize: '30px',
            fontWeight: '700',
            marginBottom: '30px',
            textAlign: 'center',
            color: '#222'
          }}>Change Password</h1>

          <form onSubmit={handleChangePassword}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Email:</label>
            <div
              style={{
                padding: '12px',
                backgroundColor: '#f5f7fa',
                borderRadius: '10px',
                color: '#888',
                marginBottom: '10px',
                fontSize: '15px',
                userSelect: 'none'
              }}
              onMouseOver={() => setAlert("You can't change Email")}
              onMouseOut={() => setAlert("")}>
              {email}
            </div>
            {alert && <p style={{ color: 'crimson', fontSize: '14px', marginTop: '-10px', marginBottom: '15px' }}>{alert}</p>}

            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>New Password:</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setIsChanged(true);
              }}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                fontSize: '15px'
              }}
            />

            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setIsChanged(true);
              }}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                fontSize: '15px'
              }}
            />

            <button
              type="submit"
              disabled={!isChanged}
              style={{
                marginTop: '10px',
                padding: '14px',
                width: '100%',
                background: isChanged ? 'linear-gradient(to right, #667eea, #764ba2)' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: isChanged ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: isChanged ? '0 6px 16px rgba(102, 126, 234, 0.4)' : 'none'
              }}
            >
              Change Password
            </button>

            {error && <p style={{ color: 'crimson', marginTop: '20px', fontWeight: '500' }}>{error}</p>}
          </form>
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
          {alert && <p style={{ color: "red", marginRight: "100px"}}>{alert}</p>}
            <button
             onClick={handleOTPSubmit}
             style={{
               backgroundColor: "#38bdf8",
               color: "white",
               padding: "10px 20px",
               borderRadius: "8px",
               fontWeight: "600",
              }}
          >
    Verify OTP
  </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangePassword; // // {alert && <p style={{color:"red"}}>alert</p>}
