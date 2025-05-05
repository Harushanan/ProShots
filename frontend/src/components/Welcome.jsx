import React from 'react';
import camera from '../assets/camera.jpg';
import logo from '../assets/Logo.png';
import { useNavigate} from "react-router-dom";
import Cookies from 'js-cookie'
import { motion } from "framer-motion";


const WelcomePage = () => {

    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    console.log("User userSession :  ", userSession); 

    const navigate = useNavigate()

    function checksession(){
        if(userSession != null){
            if(userSession.user.role=="customer"){
                navigate('/client/home');
            }

            else{
                navigate('admin/dashboard');
            }
            
             
        }

        else{ navigate('auth/login')}
    }

    return (
        <>  
            <div 
                style={{
                    margin: 0, 
                    padding: 0, 
                    textAlign: 'center', 
                    color: 'white', 
                    fontFamily: 'Arial, sans-serif', 
                    background: `url(${camera}) no-repeat center center/cover`,
                    height: '100vh', 
                    minHeight: '80vh', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden' 
                    
                }}
            >

                <h1 id="heading1" className='font-semibold text-5xl md:text-9xl lg:text-[120px] mb-12'><i>ProShots Creation</i></h1>

                <h1 style={{ fontSize: '2.5em', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
                    Capture Your Moments with Us
                </h1>
                <p style={{ fontSize: '1.2em', maxWidth: '600px', textShadow: '1px 1px 8px rgba(0,0,0,0.5)' }}>
                    Book your event photography, customize your designs, and create lasting memories with our professional studio.
                </p>
                <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={checksession}
                        className="get-started-btn mt-10"
                        >
                        Get Started
                        </motion.button>
            </div>
        </>
    );
};

export default WelcomePage;
