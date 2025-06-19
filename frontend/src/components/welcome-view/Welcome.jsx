import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from "framer-motion";
import logo from '../../assets/LogoHome.jpeg';

import studioImage1 from '../../assets/image2.jpg';
import studioImage2 from '../../assets/image3.jpg';
import studioImage3 from '../../assets/image5.jpg';
import studioImage4 from '../../assets/image7.jpg';
import studioImage5 from '../../assets/image9.jpg';
import studioImage6 from '../../assets/adminBG.jpg';
import studioImage7 from '../../assets/bookImg.jpg';

const WelcomePage = () => {
    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Sample slider images with captions
    const slides = [
        {
            image: studioImage1,
            caption: "School Cultural Events"
        },
        {
            image: studioImage2,
            caption: "Sports Meet Photos"
        },
        {
            image: studioImage3,
            caption: "Baby Born Festival"
        },
        {
            image: studioImage4,
            caption: "Birthday Shots"
        },
        {
            image: studioImage5,
            caption: "Event Photography Services"
        },
        {
            image: studioImage6,
            caption: "Custom Camera Devices"
        },
        {
            image: studioImage7,
            caption: "Memorable Moments Captured"
        }
    ];

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds
        
        return () => clearInterval(interval);
    }, [slides.length]);

    function checksession() {
        if (userSession != null) {
            if (userSession.user.role === "customer") {
                navigate('/client/home');
            } else {
                navigate('/admin/dashboard');
            }
        } else {
            navigate('/auth/login');
        }
    }

    return (
        <div className="sm:h-screen h-auto bg-gradient-to-b from-blue-50 to-blue-50 flex flex-col overflow-y-auto relative">
            {/* Header */}
            <header className="py-0 border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <img 
                                src={logo} 
                                alt="ProShots Logo" 
                                onClick={()=>navigate('/')}
                                className="h-20 md:h-24 w-auto"
                            />
                        </div>
                        <nav className="ml-auto hidden md:block">
                            <ul className="flex space-x-8">
                                <li><Link to="/" className="text-red-600 hover:text-purple-600 transition-colors duration-200 font-medium">Home</Link></li>
                                <li><Link to="/common/blog" className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium">Blog</Link></li>
                                <li><Link to="/common/contact" className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium">Contact</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content with Vertical Slider */}
            <main className="flex-grow flex items-center py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
                            >
                                Capture Your <span className="text-purple-600">Perfect Moments</span>
                            </motion.h1>
                            
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-lg text-gray-600"
                            >
                                Professional studio management for photographers and clients. Book sessions, manage appointments, and create stunning memories.
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={checksession}
                                    className="px-6 py-3 animate-pulse bg-purple-600 text-white rounded-lg font-medium shadow-lg hover:bg-purple-700 transition-all"
                                >
                                    Get Started
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {navigate('/common/contact')}}
                                    className="px-6 py-3 bg-white text-purple-600 border border-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all"
                                >
                                    Learn More
                                </motion.button>
                            </motion.div>
                        </div>
                        
                        {/* Vertical Slider Section */}
                        <div className="relative h-96 lg:h-[32rem] w-full rounded-2xl overflow-hidden shadow-xl">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0"
                                >
                                    <img 
                                        src={slides[currentSlide].image} 
                                        alt={slides[currentSlide].caption}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-8 left-0 right-0 text-center">
                                        <motion.p
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-white text-xl font-semibold"
                                        >
                                            {slides[currentSlide].caption}
                                        </motion.p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                            
                            {/* Navigation Dots - Vertical */}
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-3 w-3 rounded-full transition-all ${currentSlide === index ? 'bg-white h-6' : 'bg-white/50'}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                            
                           
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WelcomePage;