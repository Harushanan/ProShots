import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import Cookies from 'js-cookie'; 
import Swal from 'sweetalert2';
import React from 'react';
import { assets } from "@/assets/assets";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const AdminLayout = () => {
    const [visible, setVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); 
    const location = useLocation();
    const [isListening, setIsListening] = useState(false);
    const [activeSpeechField, setActiveSpeechField] = useState(null);
    

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const commands = [
        {
            command: 'open navigationbar',
            callback: () => {
                setIsOpen(true);
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
        },
        {
            command: 'close navigationbar',
            callback: () => {
                setIsOpen(false);
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
        },
        {
          command: 'go to slider',
          callback: () => {
            navigate('/admin/gallery');
            setIsOpen(false);
          },
          isFuzzyMatch: true,
          fuzzyMatchingThreshold: 0.8
        },
        {
          command: 'go to upload photos',
          callback: () => {
            navigate('/admin/uploadPage'); 
            setIsOpen(false);
          },
          isFuzzyMatch: true,
          fuzzyMatchingThreshold: 0.8
        },
        {
          command: 'go to user management',
          callback: () => {
            navigate('/admin/dashboard');
            setIsOpen(false);
          },
          isFuzzyMatch: true,
          fuzzyMatchingThreshold: 0.8
        },
        {
          command: 'go to bookings management',
          callback: () => {
            navigate('/admin/EventBookings');
            setIsOpen(false);
          },
          isFuzzyMatch: true,
          fuzzyMatchingThreshold: 0.8
        },
        {
          command: 'go to blog management',
          callback: () => {
            navigate('/admin/oldEventUpload');
            setIsOpen(false);
          },
          isFuzzyMatch: true,
          fuzzyMatchingThreshold: 0.8
        },
        {
            command: 'go to package management',
            callback: () => {
              navigate('/admin/newPackages');
              setIsOpen(false);
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'go to inventory management',
            callback: () => {
              navigate('/admin/create-product');
              setIsOpen(false);
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'go to order management',
            callback: () => {
              navigate('/admin/placedOrders');
              setIsOpen(false);
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'go to delivery management',
            callback: () => {
              navigate('/admin/delivery');
              setIsOpen(false);
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'go to feedback management',
            callback: () => {
              navigate('/admin/feedback');
              setIsOpen(false);
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          }, 
          {
            command: 'go to livechat management',
            callback: () => {
              navigate('/admin/liveChat');
              setIsOpen(false);
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          }, 
          {
            command: 'move to upcoming events',
            callback: () => {
                navigate('/admin/upcomingEvents');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8 
          },
          {
            command: 'move to booking report',
            callback: () => {
                navigate('/admin/bookingsReport');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8 
          },
          {
            command: 'move to event bookings',
            callback: () => {
                navigate('/admin/eventBookings');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8 
          },
          {
            command: 'move to delete packages',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/deletePackages');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to add new packages',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/newPackages');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to current customers',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/dashboard');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to deleted customers',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/delet-user');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to upload old events',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/oldEventUpload');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to view old events',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/oldEventDelete');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to create product',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/create-product');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to product list',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/product-list');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to placed orders',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/placedOrders');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to deleted orders',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/deletedOrders');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to feedback',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/feedback');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to order report',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/OrderReport');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to Faq And Feedback report',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/FaqAndFeedbackReport');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'move to faq',
            callback: () => {
              setActiveSpeechField(null);
              resetTranscript();
              navigate('/admin/faq');
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          },
          {
            command: 'sign out',
            callback: () => {
              logout();
              resetTranscript();
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.8
          }
    ]

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });
    
    
      const toggleListening = () => {
        if (isListening) {
          SpeechRecognition.stopListening();
          setIsListening(false);
        } else {
          SpeechRecognition.startListening({ continuous: true });
          setIsListening(true);
        }
        resetTranscript();
      };


      if (!browserSupportsSpeechRecognition) {
            toast.error("Your browser doesn't support speech recognition.")
      }
    

    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const customername = userSession ? userSession.user.username : "Guest";

    const logout = () => {
        Swal.fire({
            html: `
                <div class="text-white">
                    <h2 class="text-lg font-semibold text-yellow-400">Are you sure?</h2>
                    <p>You will be logged out!</p>
                </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            customClass: {
                popup: "bg-gray-800 !important rounded-xl p-6 shadow-lg", // Gray background
                confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
                cancelButton: "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            },
            didOpen: () => {
                document.querySelector('.swal2-popup').style.backgroundColor = "#36454F"; // Ensure gray background
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (isListening) {
                  SpeechRecognition.stopListening();
                  setIsListening(false);
                }
                Cookies.remove("user");
                navigate("/");
            }
        });
    };

    return (
        <div className="">
            <div className="w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-700 h-auto sticky z-50 shadow-lg">
                <header>
                    <h1 id="heading1" className="text-center font-bold text-5xl p-4">ProShots Photography Studio</h1>
                    <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
                    <div className="absolute top-1 right-4">
                        <img src={assets.logout} alt="Logout" className="h-[70px] cursor-pointer" onClick={logout} />
                    </div>
                </header>
            </div>

            <div className="relative min-h-screen overflow-hidden">
                {/* Background Image with zoom effect */}
                {
                    !location.pathname.includes('/admin/oldEventDelete') &&
                    !location.pathname.includes('/admin/product-list') &&
                    (
                        <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('/adminBG.jpg')] before:bg-cover before:bg-center before:animate-zoom-bg before:scale-110 before:z-0">
                        <div className="relative z-10 mb-10 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg w-full h-full"></div>
                        </div>
                    )  
                }

                {
                    (location.pathname.includes('/admin/oldEventDelete') ||
                    location.pathname.includes('/admin/product-list') ||
                    location.pathname.includes('/admin/bookingsReport') ) &&
                    (
                        <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('/adminSideAllBG.jfif')] before:bg-cover before:bg-center before:animate-zoom-bg before:scale-110 before:z-0">
                        <div className="relative z-10 mb-10 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg w-full h-full"></div>
                        </div>
                    )  
                }

                {/* Your content above background */}
                <main className="relative z-10 mb-10 min-h-screen">
                    {/* Microphone Section - make sure this is outside and above all containers */}
                    <div className="fixed top-[130px] left-5 z-[1000]">
                        {isListening ? (
                            <FaMicrophoneSlash
                                onClick={toggleListening}
                                className="h-[39px] w-[39px] cursor-pointer text-red-600 animate-pulse bg-white p-1 rounded-full hover:text-red-600 transition-colors shadow-md"
                                title="Stop Listening"
                            />
                        ) : (
                            <FaMicrophone
                                onClick={toggleListening}
                                className="h-[39px] w-[39px] cursor-pointer text-blue-600 bg-white p-1 rounded-full hover:text-blue-800 transition-colors shadow-md"
                                title="Start Voice Control"
                            />
                        )}
                    </div>
                    <Outlet />
                </main>
            </div> 

            { !location.pathname.includes('/admin/gallery') &&
                <div className="w-full bg-black h-24">
                    <footer className="flex items-center justify-center h-full text-center text-white">
                        <div>
                            <p className="text-lg mt-2">© {new Date().getFullYear()} All rights reserved. | Made by ProShots</p>
                        </div>
                    </footer>
                </div>
            }
        </div>
    );
}

export default AdminLayout;
