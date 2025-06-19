import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { FaCalendarAlt, FaUser, FaEnvelope, FaMapMarkerAlt, FaUsers, FaDollarSign, FaCameraRetro } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import BookingForm from './BookingForm';

const MyBookings = () => {
    const [myBooking, setMyBooking] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = Cookies.get('user');
        const user = userData ? JSON.parse(userData) : null;
        const userEmails = user && user.user ? user.user.email : null;

        const fetchMyBookings = async() => {
            try {
                const res = await fetch(`http://localhost:5000/api/getMyBookings/${userEmails}`, {
                    method: "GET",
                    headers: {
                        "content-type": "application/json"
                    }
                })
                const result = await res.json();
                setMyBooking(result.data);
            } catch (error) {
                console.log(error);
                setMyBooking([]);
            }
        }

        fetchMyBookings();
    }, [])

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });
    
        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:5000/api/deleteMyBookings/${id}`, {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json"
                    }
                });
    
                if (res.ok) {
                    toast.success("Booking deleted successfully!");
                    setMyBooking(prev => prev.filter(booking => booking._id !== id));
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to delete booking. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer position='top-center' />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative mb-12">
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute right-0 top-0 text-gray-500 hover:text-red-500 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
                        <span className="inline-block mr-2">📸</span>
                        My Event Bookings
                    </h1>
                    <p className="text-center text-gray-600">View and manage your photography bookings</p>
                </div>

                {/* Empty State */}
                {myBooking.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="mt-4 text-xl font-medium text-gray-700">No bookings found</h2>
                        <p className="mt-2 text-gray-500">You haven't made any bookings yet</p>
                        <button 
                            onClick={() => navigate('/client/home')}
                            className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <BookingForm />
                        </button> 
                        
                    </div>
                )}

                {/* Bookings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myBooking.map((book) => {
                        const isPast = new Date(book.eventDate) < new Date();
                        const displayStatus = isPast ? "Completed" : book.status;

                        return (
                            <div 
                                key={book._id} 
                                className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                            >
                                {/* Status Badge */}
                                <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                                    displayStatus === "Completed" ? "bg-gray-100 text-gray-800"
                                    : displayStatus === "Accepted" ? "bg-green-100 text-green-800"
                                    : displayStatus === "Canceled" ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                    {displayStatus}
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                                            <FaCameraRetro className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{book.eventType}</h3>
                                            <p className="text-sm text-gray-500">{new Date(book.eventDate).toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <FaUser className="mt-1 mr-3 text-gray-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Client</p>
                                                <p className="text-gray-800">{book.clientName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FaEnvelope className="mt-1 mr-3 text-gray-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                <p className="text-gray-800">{book.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FaMapMarkerAlt className="mt-1 mr-3 text-gray-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Location</p>
                                                <p className="text-gray-800">{book.location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FaUsers className="mt-1 mr-3 text-gray-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Guests</p>
                                                <p className="text-gray-800">{book.guestCount}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FaDollarSign className="mt-1 mr-3 text-gray-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Budget</p>
                                                <p className="text-gray-800">${book.budgetRange}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Additional Services</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-600">Drone:</span> {book.drone}
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-600">Videography:</span> {book.videography}
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-600">Live Stream:</span> {book.live}
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-600">Found Us:</span> {book.knowUs}
                                            </div>
                                        </div>
                                    </div>

                                    {book.status === "Pending" && !isPast && (
                                        <div className="mt-6 flex space-x-3">
                                            <button
                                                onClick={() => handleDelete(book._id)}
                                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Cancel Booking
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MyBookings;