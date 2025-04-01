import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EventBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null); // Track selected booking
    const [confirmAction, setConfirmAction] = useState(null); // Track action to confirm
    const [sortOrder, setSortOrder] = useState("default");
    const [sortedBookings, setSortedBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");


    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const query = e.target.value.toLowerCase();
        console.log(searchQuery);
       
        const filteredBookings = bookings.filter((book) => 
            book.clientName.toLowerCase().includes(query) ||
            book.eventType.toLowerCase().includes(query)
        );

        if (sortOrder === "asc") {
            filteredBookings.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        } else if (sortOrder === "desc") {
            filteredBookings.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        }

        setSortedBookings(filteredBookings);
        console.log(filteredBookings);
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    
        let sortedData = [...bookings]; // Copy original data
    
        if (order === "asc") {
            sortedData.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        } else if (order === "desc") {
            sortedData.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        } else {
            sortedData = bookings; // Reset to original
        }
    
        setSortedBookings(sortedData);
    };
    

    const handleAccept = (id, clientName, email, eDate, eType, location) => {
        setConfirmAction({
            type: "accept",
            id,
            clientName,
            email,
            eDate,
            eType,
            location
        });
    };

    const handleReject = (id, clientName, email, eDate, eType, location) => {
        setConfirmAction({
            type: "reject",
            id,
            clientName,
            email,
            eDate,
            eType,
            location
        });
    };

    const confirmActionHandler = () => {
        if (!confirmAction) return;

        const { type, id, clientName, email, eDate, eType, location } = confirmAction;
        const status = type === "accept" ? "Accepted" : "Rejected";

        fetch(`http://localhost:5000/api/updatebookings/${id}/${email}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, clientName, eventDate: eDate, eventType: eType, eventLocation: location }),
        }).then(res => {
            if (res.ok) {
                toast.success(`${clientName}'s booking ${status.toLowerCase()} successfully!`);
                setBookings(prev => prev.filter(book => book._id !== id));
                setSelectedBooking(null);
            } else {
                toast.error("Unable to update");
            }
        }).catch(() => toast.error("Error updating booking"))
        .finally(() => setConfirmAction(null));
    };

    useEffect(() => {
        fetch('http://localhost:5000/api/getbookings', {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(res => res.json())
        .then(bookings => {
            setBookings(bookings || []);
            setSortedBookings(bookings);
        })
        .catch(() => toast.error("Failed to fetch bookings"))
        .finally(() => setLoading(false));
    }, []);
 
    if (loading) {
        return <h1 className="text-center text-green-800 p-10 border-black border-4 m-10 text-4xl">Loading...</h1>;
    }

    return (
        <div className="w-full p-4">
            <ToastContainer position="top-center" autoClose={3000} />
            
            <h1 className="text-4xl mt-8 mb-8 text-center text-blue-900 underline font-bold">Event Booking Details</h1>

            <div className="flex justify-between items-center mb-10">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by Name or Event Type"
                    className="w-9/12 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />

                <select 
                    value={sortOrder} 
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-3/12 px-4 py-2 text-lg border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                    <option value="default">🔄 Reset to Default</option>
                    <option value="asc">⬆ Sort Ascending</option>
                    <option value="desc">⬇ Sort Descending</option>
                </select>
            </div>


            {bookings.length === 0 ? (
                <p className="text-4xl text-center text-red-600">No bookings available.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-blue-200">
                            <th className="border border-gray-400 p-2 text-center">Name</th>
                            <th className="border border-gray-400 p-2 text-center">Event Type</th>
                            <th className="border border-gray-400 p-2 text-center">Event Date</th>
                            <th className="border border-gray-400 p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBookings.map((book) => {
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
                                                    <div className="flex justify-end gap-4 p-4 border-t border-gray-200">
                                                        <Button 
                                                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200" 
                                                            onClick={() => handleReject(
                                                                selectedBooking._id, selectedBooking.clientName, selectedBooking.email, 
                                                                selectedBooking.eventDate, selectedBooking.eventType, selectedBooking.location
                                                            )}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button 
                                                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200" 
                                                            onClick={() => handleAccept(
                                                                selectedBooking._id, selectedBooking.clientName, selectedBooking.email, 
                                                                selectedBooking.eventDate, selectedBooking.eventType, selectedBooking.location
                                                            )}
                                                        >
                                                            Accept
                                                        </Button>
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

            {confirmAction && (
                <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                    <DialogContent className="w-[400px] bg-white rounded-xl shadow-2xl border border-gray-200">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                {confirmAction.type === "accept"
                                    ? `Confirm Acceptance`
                                    : `Confirm Rejection`}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-5 text-gray-700">
                            <p>
                                Are you sure you want to{" "}
                                <strong className={confirmAction.type === "accept" ? "text-green-600" : "text-red-600"}>
                                    {confirmAction.type}
                                </strong>{" "}
                                the booking for <strong className="text-gray-900">{confirmAction.clientName}</strong>?
                            </p>
                        </div>
                        <DialogFooter className="flex justify-end gap-4 p-5 border-t border-gray-200">
                            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-all" 
                                onClick={() => setConfirmAction(null)}>
                                Cancel
                            </Button>
                            <Button className={`px-4 py-2 font-medium rounded-lg transition-all ${
                                    confirmAction.type === "accept"
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                }`} 
                                onClick={confirmActionHandler}>
                                {confirmAction.type === "accept" ? "Accept" : "Reject"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
};

export default EventBookings;
