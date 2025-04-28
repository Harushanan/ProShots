import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import { FaCalendarAlt, FaUser, FaEnvelope, FaMapMarkerAlt, FaUsers, FaDollarSign, FaCameraRetro } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


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
                    toast.success("You have deleted your booking successfully.");
                    setMyBooking(prev => prev.filter(booking => booking._id !== id));
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to delete booking. Please try again.");
            }
        }
    };



    return  (
        <div className="mx-auto px-6 py-12 p-10 bg-gradient-to-br bg-[#e0f7fa] min-h-screen">
            <button onClick={() =>navigate(-1)} className='absolute top-6 right-6 text-black text-2xl md:text-4xl hover:text-red-500 transition'> ✖ </button>
            <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">📸 My Event Bookings</h1>

            {myBooking.length === 0 && (
                <h2 className="text-center text-2xl text-gray-500 font-medium">You don’t have any bookings yet 😔</h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myBooking.map((book) => {
                    const isPast = new Date(book.eventDate) < new Date();
                    const displayStatus = isPast ? "Completed" : book.status;

                    return (
                        <div key={book._id} className="relative bg-white bg-opacity-30 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                            {/* Status ribbon */}
                            <div className={`absolute top-4 right-4 px-3 py-1 text-sm font-bold rounded-full ${
                                displayStatus === "Completed" ? "bg-gray-300 text-gray-800"
                                : displayStatus === "Accepted" ? "bg-green-500 text-white"
                                : displayStatus === "Canceled" ? "bg-red-500 text-white"
                                : "bg-yellow-400 text-white"
                            }`}>
                                {displayStatus}
                            </div>

                            <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                <FaCameraRetro className="text-blue-800" /> {book.eventType}
                            </h2>

                            <div className='pl-2'>
                                <p className="flex items-center text-base text-black mb-1">
                                    <FaUser className="mr-2" /> {book.clientName}
                                </p>
                                <p className="flex items-center text-base text-black mb-1">
                                    <FaEnvelope className="mr-2" /> {book.email}
                                </p>
                                <p className="flex items-center text-base text-black mb-1">
                                    <FaMapMarkerAlt className="mr-2" /> {book.location}
                                </p>
                                <p className="flex items-center text-base text-black mb-1">
                                    <FaCalendarAlt className="mr-2" /> {new Date(book.eventDate).toLocaleDateString()}
                                </p>
                                <p className="flex items-center text-base text-black mb-1">
                                    <FaUsers className="mr-2" /> Guests: {book.guestCount}
                                </p>
                                <p className="flex items-center text-base text-black mb-3">
                                    <FaDollarSign className="mr-2" /> Budget: ${book.budgetRange}
                                </p>
                            </div>
                            
                            <div className="text-base text-black mb-2">
                                <p><span className="font-medium">Drone : </span> {book.drone}</p>
                                <p><span className="font-medium">Videography : </span> {book.videography}</p>
                                <p><span className="font-medium">Live Stream : </span> {book.live}</p>
                                <p><span className="font-medium">Found Us : </span> {book.knowUs}</p>
                            </div>

                            {book.status === "Pending" && !isPast && (
                                <button
                                    onClick={() => handleDelete(book._id)}
                                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                                >
                                    Delete Booking
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyBookings
