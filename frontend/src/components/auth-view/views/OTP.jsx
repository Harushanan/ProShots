import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginbackground from '../../../assets/loginlogo.png'
import logo from '../../../assets/Logo.png'
import axios from 'axios';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot  } from "@/components/ui/input-otp"

function OTP() {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const [error , seterror] = useState("")

    function handleOTP(e){
       e.preventDefault();
       value = e.target.value

       if (/^[0-9]{0,5}$/.test(value)) {
          seterror("OTP Should 5 Digits");
          return
       }

       axios.post("http://localhost:5000/otp", {otp})
        .then((result) => {

            if (result.data.message === "EmailAlreadyExists") {  
                setError("Email already exists. Try another email");
            } 
            else if (result.data.message === "Success") {
                setError("Please wait......");
                setTimeout(() => { navigate('/') }, 3000);
            }
        })
        .catch((err) => {
            console.error("Signup Error: ", err);
            setError("Signup failed. Please try again.");
        });
    
    }

    return (
        <div className="bg-black">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px 30px' }}>
                <img src={logo} alt="Logo" style={{ width: '260px', height: '100px' }} />
                <Link to="/" style={{ display: 'inline-block', padding: '10px 20px', fontSize: '18px', backgroundColor: 'rgb(20, 190, 190)', color: 'white', textDecoration: 'none', borderRadius: '25px', textAlign: 'center' }}><b>Login</b></Link>
            </header>

            <div className="container" style={{ display: 'flex', flex: 1, height: '80vh' }}>
                <div className="left-side" style={{ flex: 1.5, background: `url(${loginbackground}) no-repeat center center/cover` }}></div>
            
                
                <InputOTP maxLength={6} className="border-black">
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>

            </div>
        </div>
    );
}

export default OTP;
