import React, { useEffect, useState } from 'react';
import {CheckBooking} from './CheckBooking';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Cookies from 'js-cookie';
import * as Tabs from "@radix-ui/react-tabs";



const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0] + 1; // Ensures YYYY-MM-DD format
};
  
function speakMessage(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US'; // You can change language here if needed
    speechSynthesis.speak(utterance);
  }


function BookingForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const todayDate = getTodayDate(); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPersonalFields, setShowPersonalFields] = useState(false);
    const [userFullName, setUserFullName] = useState(null);
    const [userPhoneNumber, setUserPhoneNumber] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [activeTab, setActiveTab] = useState("defaultBooking");


    
    useEffect(() => {
        const userData = Cookies.get('user');
        const user = userData ? JSON.parse(userData) : null;
        const userFullName = user && user.user ? user.user.username : null;
        const userPhoneNumber = user && user.user ? user.user.phone : null;
        const userAddress = user && user.user ? user.user.address : null;
        if (activeTab === "defaultBooking") {
            setFormDetails(prev => ({
                ...prev,
                clientName: userFullName || '',
                phoneNumber: userPhoneNumber || '',
                address: userAddress || ''
            }));
        }
    }, [activeTab, isOpen]);

    const onSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitting(true); 

        const userData = Cookies.get('user');
        const user = userData ? JSON.parse(userData) : null;
        const userEmails = user && user.user ? user.user.email : null;
        const userFullName = user && user.user ? user.user.username : null;
        const userPhoneNumber = user && user.user ? user.user.phone : null;
        const userAddress = user && user.user ? user.user.address : null;
    
        const formDetailsWithEmail = { ...formDetails, userEmail: userEmails };

        if (!CheckBooking(formDetails)) {
            setIsSubmitting(false);
            return;
        }

        const response = await fetch('http://localhost:5000/api/bookings', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formDetailsWithEmail)
        });
    
        if (!response.ok) {
            const datas = await response.json();
            if (datas.message) {
                toast.error(datas.message);
            } else {
                toast.error('Booking Failed');
            }
            setIsSubmitting(false);
            return;
        } else {            
            toast.success('Booking Successful!');      
            speakMessage("Your booking has been successfully added. A team member will reach out shortly with more details. Thank you!");
            setTimeout(() => {
                setFormDetails({
                    clientName: '',
                    phoneNumber: 0,
                    address: '',
                    eventType: '',
                    eventDate: '',
                    location: '',
                    duration: 0,
                    guestCount: 0,
                    budgetRange: 0,
                    knowUs: '',
                    videography: false,
                    drone: false,
                    live: false,
                    terms: false
                })
                setIsOpen(false);
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 5000); 
            }, 5050);
        }
    
    };

    const getButtonColor = () => {

        if (location.pathname.toLowerCase().startsWith('/client/displayoldfullevent/')) {
            return 'bg-black/60 backdrop-blur-sm text-base md:text-lg text-white border-white rounded-lg hover:bg-white hover:text-black transition';
        }

        switch (location.pathname.toLowerCase()) {
            case '/client/home': return 'bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition';
            case '/client/blog': return 'bg-white/15 backdrop-blur-sm text-white rounded-lg hover:bg-white hover:text-black transition';
            default: return 'bg-gray-600 hover:bg-gray-700';
        }
    };
    

    const [formDetails, setFormDetails] = useState({
        clientName: '',
        phoneNumber: 0,
        address: '',
        eventType: '',
        eventDate: '',
        location: '',
        duration: 0,
        guestCount: 0,
        budgetRange: 0,
        knowUs: '',
        videography: false,
        drone: false,
        live: false,
        terms: false

    })

    const isFormComplete = () => {
        return (
            formDetails.eventType.trim() !== '' &&
            formDetails.eventDate.trim() !== '' &&
            formDetails.location.trim() !== '' &&
            formDetails.duration > 0 &&
            formDetails.guestCount > 0 &&
            formDetails.budgetRange !== 0 &&
            formDetails.terms === true
        );
    };
    
    const openModal = (withPersonalFields = false) => {
        setShowPersonalFields(withPersonalFields);
        setIsOpen(true);
    };

    

    return (
        <div className="relative">
            
            
            <div className="flex justify-center items-center py-12 px-4 sm:px-6">
                {/* Button to Open Modal */}
                {!isOpen && (
                    <button 
                        onClick={() => setIsOpen(true)} 
                        className={`px-6 py-3 text-lg font-medium rounded-lg border border-gray-300 hover:border-white transition-all duration-200 ${getButtonColor()} hover:shadow-lg transform hover:-translate-y-0.5`}
                    >
                        BOOK FOR EVENT
                    </button>
                )}

                {/* Modal */}
                {isOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 overflow-y-auto p-4">
                        <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl m-4 p-6 sm:p-8 overflow-y-auto max-h-[97vh]">
                            {/* Close Button */}
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    setFormDetails({
                                        clientName: '',
                                        phoneNumber: 0,
                                        email: '',
                                        address: '',
                                        eventType: '',
                                        eventDate: '',
                                        location: '',
                                        duration: 0,
                                        guestCount: 0,
                                        budgetRange: 0,
                                        knowUs: '',
                                        videography: false,
                                        drone: false,
                                        live: false,
                                        terms: false
                                    });
                                }}
                                className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors text-2xl"
                            >
                                ✖
                            </button>

                            {/* Modal Header */}
                            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
                                Book Photography Service
                            </h2>

                            <form onSubmit={onSubmit} className="space-y-6">
                                <Tabs.Root defaultValue="defaultBooking" value={activeTab} onValueChange={setActiveTab}>
                                    <Tabs.List className="flex gap-4 mb-6 justify-center">
                                        <Tabs.Trigger 
                                            value="defaultBooking" 
                                            className="px-5 py-2 rounded-lg bg-gray-700 text-white data-[state=active]:bg-blue-600 data-[state=active]:shadow-md transition-all"
                                        >
                                            Book For You
                                        </Tabs.Trigger>
                                        <Tabs.Trigger 
                                            value="customClient" 
                                            className="px-5 py-2 rounded-lg bg-gray-700 text-white data-[state=active]:bg-blue-600 data-[state=active]:shadow-md transition-all"
                                        >
                                            Book For Someone
                                        </Tabs.Trigger>
                                    </Tabs.List>
                                    
                                    <Tabs.Content value="customClient" className="space-y-4">
                                        <input 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                            onChange={(e) => setFormDetails({...formDetails, clientName: e.target.value})} 
                                            type="text" 
                                            name="clientName" 
                                            placeholder="Enter Full Name" 
                                            required 
                                        />
                                        
                                        <input 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                            onChange={(e) => setFormDetails({...formDetails, phoneNumber: e.target.value})} 
                                            type="tel"
                                            name="phoneNumber"
                                            placeholder="Enter Contact Number" 
                                            required 
                                        />
                                        
                                        <input 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                            onChange={(e) => setFormDetails({...formDetails, address: e.target.value})} 
                                            type="text" 
                                            name="address"
                                            placeholder="Enter Address" 
                                            required 
                                        />
                                    </Tabs.Content>
                                </Tabs.Root>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Event Type */}
                                    <div className="space-y-1">
                                        <label className="text-gray-100 font-medium ml-1" htmlFor="eventType">Event Type</label>
                                        <select 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            onChange={(e) => setFormDetails({...formDetails, eventType: e.target.value})} 
                                            name="eventType"
                                            value={formDetails.eventType}
                                        >
                                            <option value="" disabled>Select Event Type</option>
                                            <option value="Wedding">Wedding</option>
                                            <option value="Pre-Wedding">Pre-Wedding</option>
                                            <option value="Engagement">Engagement</option>
                                            <option value="BirthDay">BirthDay</option>
                                            <option value="School Event">School Event</option>
                                            <option value="Mehndi">Mehndi</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Event Date */}
                                    <div className="space-y-1">
                                        <label className="text-gray-100 font-medium ml-1" htmlFor="eventDate">Event Date</label>
                                        <input 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            type="date" 
                                            onChange={(e) => setFormDetails({...formDetails, eventDate: e.target.value})}  
                                            name="eventDate"
                                            min={new Date(Date.now() + 2*86400000).toISOString().split('T')[0]}

                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-1">
                                    <label className="text-gray-100 font-medium ml-1" htmlFor="location">Event Location</label>
                                    <input 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        type="text" 
                                        onChange={(e) => setFormDetails({...formDetails, location: e.target.value})} 
                                        name="location" 
                                        placeholder="Enter exact venue address" 
                                        required 
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Duration */}
                                    <div className="space-y-1">
                                        <label className="text-gray-100 font-medium ml-1" htmlFor="duration">Duration (hours)</label>
                                        <input 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            type="number" 
                                            onChange={(e) => setFormDetails({...formDetails, duration: e.target.value})} 
                                            name="duration"
                                            min="1"
                                            max="15"
                                            placeholder="4" 
                                            required 
                                        />
                                    </div>

                                    {/* Guest Count */}
                                    <div className="space-y-1">
                                        <label className="text-gray-100 font-medium ml-1" htmlFor="guestCount">Number of Guests</label>
                                        <input 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            type="number" 
                                            onChange={(e) => setFormDetails({...formDetails, guestCount: e.target.value})} 
                                            name="guestCount"
                                            min="0"
                                            max="4000"
                                            step="1"
                                            placeholder="100" 
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Budget */}
                                <div className="space-y-1">
                                    <label className="text-gray-100 font-medium ml-1" htmlFor="budgetRange">Budget Range (₹)</label>
                                    <input 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        type="number" 
                                        onChange={(e) => setFormDetails({...formDetails, budgetRange: e.target.value})} 
                                        name="budgetRange"
                                        min="3000"
                                        max="500000"
                                        step="1"
                                        placeholder="15000" 
                                        required 
                                    />
                                </div>

                                {/* How did you hear about us */}
                                <div className="space-y-1">
                                    <label className="text-gray-100 font-medium ml-1" htmlFor="knowUs">How did you hear about us?</label>
                                    <textarea 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                        onChange={(e) => setFormDetails({...formDetails, knowUs: e.target.value})}  
                                        name="knowUs"
                                        placeholder="Social media, friend recommendation, etc." 
                                        required 
                                    />
                                </div>

                                {/* Additional Services */}
                                <fieldset className="border border-gray-300 p-4 rounded-lg space-y-3">
                                    <legend className="text-gray-100 font-medium px-2">Additional Services</legend>
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="videography"
                                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                            onChange={(e) => setFormDetails({...formDetails, videography: e.target.checked})}  
                                            name="videography"
                                            checked={formDetails.videography} 
                                        />
                                        <label htmlFor="videography" className="ml-3 text-gray-100">Videography</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="drone"
                                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                            onChange={(e) => setFormDetails({...formDetails, drone: e.target.checked})}  
                                            name="drone"
                                            checked={formDetails.drone}
                                        />
                                        <label htmlFor="drone" className="ml-3 text-gray-100">Drone Photography</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="live"
                                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                            onChange={(e) => setFormDetails({...formDetails, live: e.target.checked})}  
                                            name="live"
                                            checked={formDetails.live}
                                        />
                                        <label htmlFor="live" className="ml-3 text-gray-100">Live Coverage</label>
                                    </div>
                                </fieldset>

                                {/* Terms and Conditions */}
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input 
                                            type="checkbox" 
                                            id="terms"
                                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                            onChange={(e) => setFormDetails({...formDetails, terms: e.target.checked})}  
                                            name="terms"
                                            checked={formDetails.terms}
                                            required 
                                        />
                                    </div>
                                    <label htmlFor="terms" className="ml-3 text-gray-100">
                                        I agree to the <a href="#" className="text-blue-400 hover:underline">Terms and Conditions</a>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                                        isFormComplete() && !isSubmitting 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' 
                                            : 'bg-blue-600 cursor-not-allowed'
                                    }`} 
                                    disabled={!isFormComplete() || isSubmitting} 
                                    title={!isFormComplete() ? 'Please fill all fields before booking' : isSubmitting ? 'Processing...' : ''}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : 'Book for Event'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                
                <Toaster 
                    position="bottom-center" 
                    autoClose={3000} 
                    toastOptions={{
                        className: 'bg-gray-800 text-white',
                    }}
                />
            </div>
        </div>
        );
}

export default BookingForm; 