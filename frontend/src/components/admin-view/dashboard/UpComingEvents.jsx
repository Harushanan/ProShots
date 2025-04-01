import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UpComingEvents = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/getUpcomingBookings", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => setBookings(data || []))
        .catch(() => toast.error("Failed to fetch upcoming bookings"));
    }, []);

    return (
      <div>
        <h1 className="text-4xl mt-8 mb-8 text-center text-blue-900 underline font-bold">Upcoming Event Details</h1>        
        <div className="w-full bg-black/10 p-4 mt-10">
            <ToastContainer position="top-center" autoClose={3000} />


            {bookings.length === 0 ? (
                <p className="text-4xl text-center text-red-600">No bookings available.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-black/30">
                            <th className="border border-gray-400 p-2 text-center text-black">Name</th>
                            <th className="border border-gray-400 p-2 text-center text-black">Event Type</th>
                            <th className="border border-gray-400 p-2 text-center text-black">Event Date</th>
                            <th className="border border-gray-400 p-2 text-center text-black">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.slice()
                        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)) 
                        .map((book) => {
                            const formattedDate = new Date(book.eventDate).toISOString().split("T")[0];
                            return (
                                <tr key={book._id} className="cursor-pointer hover:bg-gray-100">
                                    <td className="border border-gray-400 p-2 text-center">{book.clientName}</td>
                                    <td className="border border-gray-400 p-2 text-center">{book.eventType}</td>
                                    <td className="border border-gray-400 p-2 text-center">{formattedDate}</td>
                                    <td className="border border-gray-400 p-2 text-center">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button 
                                                    onClick={() => setSelectedBooking(book)} 
                                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 ease-in-out"
                                                >
                                                    View
                                                </button>
                                            </DialogTrigger>
                                            {selectedBooking && selectedBooking._id === book._id && (
                                                <DialogContent className="w-[500px] bg-white rounded-lg shadow-xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-lg">{selectedBooking.clientName}'s Booking Details</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="p-4">
                                                        <p><strong>Email:</strong> {selectedBooking.email}</p>
                                                        <p><strong>Phone:</strong> {selectedBooking.phoneNumber}</p>
                                                        <p><strong>Address:</strong> {selectedBooking.address}</p>
                                                        <p><strong>Event Type:</strong> {selectedBooking.eventType}</p>
                                                        <p><strong>Event Date:</strong> {selectedBooking.eventDate}</p>
                                                        <p><strong>Location:</strong> {selectedBooking.location}</p>
                                                        <p><strong>Duration:</strong> {selectedBooking.duration}</p>
                                                        <p><strong>Guest Count:</strong> {selectedBooking.guestCount}</p>
                                                        <p><strong>Budget:</strong> {selectedBooking.budgetRange}</p>
                                                        <p><strong>Know Us:</strong> {selectedBooking.knowUs}</p>
                                                        <p><strong>Services:</strong> {selectedBooking.videography === "true" ? "Videography, " : ""}
                                                            {selectedBooking.drone === "true" ? "Drone Photography, " : ""}
                                                            {selectedBooking.live === "true" ? "Live Streaming" : ""}
                                                        </p>
                                                    </div>
                                                </DialogContent>
                                            )}
                                        </Dialog>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    );
};

export default UpComingEvents;
