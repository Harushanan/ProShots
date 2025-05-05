import React, { useEffect, useState } from 'react';
import {CheckBooking} from './CheckBooking';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Cookies from 'js-cookie';


const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0] + 1; // Ensures YYYY-MM-DD format
};
  


function BookingForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const todayDate = getTodayDate(); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitting(true);

        const userData = Cookies.get('user');
        const user = userData ? JSON.parse(userData) : null;
        const userEmails = user && user.user ? user.user.email : null;
    
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
            formDetails.clientName.trim() !== '' &&
            formDetails.phoneNumber !== 0 &&
            formDetails.address.trim() !== '' &&
            formDetails.eventType.trim() !== '' &&
            formDetails.eventDate.trim() !== '' &&
            formDetails.location.trim() !== '' &&
            formDetails.duration > 0 &&
            formDetails.guestCount > 0 &&
            formDetails.budgetRange !== 0 &&
            formDetails.terms === true
        );
    };
    

    

    return (
        <div>
            <ToastContainer 
                position = "top-center"
                autoClose = {5000}
                hideProgressBar = {false}
                closeOnClick = {true}
                pauseOnHover = {false}
                draggable = {true}
                progress = {undefined}
                newestOnTop = {true}
                rtl = {false}
                style={{ zIndex: 9999, position: 'fixed', top: 0 }} 
            />
            <div className='flex justify-center items-center m-10'>
                {/* Button to Open Modal */}
                {!isOpen && (
                    <button 
                        onClick={() => setIsOpen(true)} 
                        className={`px-4 md:px-6 py-2 md:py-3 text-lg border-[1px] border-gray-500 hover:border-white ${getButtonColor()}`}>
                        BOOK FOR EVENT
                    </button>
                )}

                {/* Modal */}
                {isOpen && (
                    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 overflow-y-auto'>
                        <div className='relative w-11/12 sm:w-3/4 lg:w-2/5 max-h-screen bg-white bg-opacity-15 backdrop-blur-md rounded-2xl shadow-lg m-5 p-7 overflow-y-auto'>
                        
                            <button 
                                onClick={() => {setIsOpen(false);
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
                                    })
                                }}
                                className='absolute top-4 right-4 text-white text-2xl hover:text-red-500 transition'>
                                ✖
                            </button>                   
 
                            <h2 className='flex text-lg sm:text-3xl text-white font-medium justify-center mb-4 sm:mb-6'>
                                Book Photography Service
                            </h2>

                            <form onSubmit={onSubmit} className='space-y-4'>
                                <input className='w-full p-2 border rounded-lg' 
                                    onChange={(e) => {setFormDetails({...formDetails, clientName: e.target.value})}} 
                                    type='text' 
                                    name= 'clientName' 
                                    placeholder='Enter Full Name' 
                                    required 
                                />
                                
                                <input className='w-full p-2 border rounded-lg' 
                                    onChange={(e) => {setFormDetails({...formDetails, phoneNumber: e.target.value})}} 
                                    type='text'
                                    name= 'phoneNumber'
                                    placeholder='Enter Contact Number' 
                                    required 
                                />
                                
                                <input className='w-full p-2 border rounded-lg' 
                                    onChange={(e) => {setFormDetails({...formDetails, address: e.target.value})}} 
                                    type='text' 
                                    name= 'address'
                                    placeholder='Enter Address' 
                                    required 
                                />

                                <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div className='flex flex-col'>
                                        <label className='text-base sm:text-xl mb-1 ml-2' htmlFor='eventType'>Event Type</label>
                                        <select className='w-full p-2 border rounded-lg' 
                                            onChange={(e)=> {setFormDetails({...formDetails, eventType: e.target.value})}} 
                                            name= 'eventType'
                                            value={formDetails.eventType}
                                        >
                                            <option value="" disabled>Select Event Type</option>
                                            <option value='Wedding'>Wedding</option>
                                            <option value='Pre-Wedding'>Pre-Wedding</option>
                                            <option value='Engagement'>Engagement</option>
                                            <option value='BirthDay'>BirthDay</option>
                                            <option value='School Event'>School Event</option>
                                            <option value='Mehndi'>Mehndi</option>
                                            <option value='Other'>Other</option>
                                        </select>

                                    </div>

                                    <div className='flex flex-col'>
                                        <label className='text-base sm:text-xl mb-1 ml-2' htmlFor='eventDate'>Event Date</label>
                                        <input className='w-full p-2 border rounded-lg' 
                                            type='date' 
                                            onChange={(e)=> {setFormDetails({...formDetails, eventDate: e.target.value})}}  
                                            name= 'eventDate'
                                            min={todayDate}
                                            required 
                                        />
                                    </div>
                                </div>

                                <input className='w-full p-2 border rounded-lg' 
                                    type='text' 
                                    onChange={(e)=> {setFormDetails({...formDetails, location: e.target.value})}} 
                                    name= 'location' 
                                    placeholder='Enter Event Location' 
                                    required 
                                />
                                
                                <input className='w-full p-2 border rounded-lg' 
                                    type='number' 
                                    onChange={(e)=> {setFormDetails({...formDetails, duration: e.target.value})}} 
                                    name= 'duration'
                                    min="1"
                                    max="15"
                                    placeholder='Enter Event Duration ( In hours )' 
                                    required 
                                />
                                
                                <input className='w-full p-2 border rounded-lg' 
                                    type='number' 
                                    onChange={(e)=> {setFormDetails({...formDetails, guestCount: e.target.value})}} 
                                    name= 'guestCount'
                                    min="0"
                                    max="4000"
                                    step="1"
                                    placeholder='Enter Number of Guests' 
                                    required 
                                />
                                
                                <input className='w-full p-2 border rounded-lg' 
                                    type='number' 
                                    onChange={(e)=> {setFormDetails({...formDetails, budgetRange: e.target.value})}} 
                                    name= 'budgetRange'
                                    min="3000"
                                    max="500000"
                                    step="1"
                                    placeholder='Enter Expected Budget' 
                                    required 
                                />
                                
                                <textarea className='w-full p-2 border rounded-lg' 
                                    type='text' 
                                    onChange={(e)=> {setFormDetails({...formDetails, knowUs: e.target.value})}}  
                                    name= 'knowUs'
                                    placeholder='How did you hear about us' 
                                    required 
                                />


                                <fieldset className='border p-4 rounded-lg'>
                                    <legend className='text-base sm:text-xl mb-2'>Additional Services:</legend>
                                    <div>
                                        <input type='checkbox' 
                                            onChange={(e)=> {setFormDetails({...formDetails, videography: e.target.checked})}}  
                                            name= 'videography'
                                            checked= {formDetails.videography} 
                                            id='videography' 
                                        />
                                        <label htmlFor='videography' className='ml-2'>Videography</label>
                                    </div>
                                    <div>
                                        <input type='checkbox' 
                                            onChange={(e)=> {setFormDetails({...formDetails, drone: e.target.checked})}}  
                                            name= 'drone'
                                            checked= {formDetails.drone}
                                            id='drone' 
                                        />
                                        <label htmlFor='drone' className='ml-2'>Drone Photography</label>
                                    </div>
                                    <div>
                                        <input type='checkbox' 
                                            onChange={(e)=> {setFormDetails({...formDetails, live: e.target.checked})}}  
                                            name= 'live'
                                            checked= {formDetails.live}
                                            id='live' 
                                        />
                                        <label htmlFor='live' className='ml-2'>Live Coverage</label>
                                    </div>
                                </fieldset>

                                <div className='flex items-center mt-4'>
                                    <input type='checkbox' 
                                        onChange={(e)=> {setFormDetails({...formDetails, terms: e.target.checked})}}  
                                        name= 'terms'
                                        checked= {formDetails.terms}
                                        id='terms' 
                                        required 
                                    />
                                    <label htmlFor='terms' className='ml-2'>I agree to the Terms and Conditions</label>
                                </div>

                                

                                <button 
                                    type='submit' 
                                    className={`w-full p-3 rounded-lg transition ${
                                        isFormComplete() && !isSubmitting ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 cursor-not-allowed'
                                    }`} 
                                    disabled={!isFormComplete() || isSubmitting} 
                                    title={!isFormComplete() ? 'Please fill all fields before booking' : isSubmitting ? 'Processing...' : ''}
                                >
                                    {isSubmitting ? 'Booking...' : 'Book for Event'}
                                </button>

                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div> 
        );
}

export default BookingForm;