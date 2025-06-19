import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UpComingEvents = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);


  useEffect(() => {
    fetch("http://localhost:5000/api/getUpcomingBookings", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setBookings(data || []))
      .catch(() => toast.error("Failed to fetch upcoming bookings"));
  }, []);

  const handleDeleteClick = (book) => {
    setBookingToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (bookingToDelete) {
      deleteEvent(bookingToDelete.email, bookingToDelete._id);
      setDeleteDialogOpen(false);
      setDeleteDialogOpen(false);
      setSelectedDateEvents([]); 
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const deleteEvent = (email, id) => {
    fetch(`http://localhost:5000/api/updatebookings/${id}/${email}/${bookingToDelete.budgetRange}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ status: "Canceled" }),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Event deleted successfully!");
          setBookings((prev) => prev.filter((booking) => booking._id !== id));
        } else {
          toast.error("Failed to delete event.");
        }
      })
      .catch(() => toast.error("Something went wrong!"));
  };

  return (
    <div className="w-10/12 mx-auto p-4">
      <h1 className="text-4xl mt-8 mb-8 text-center text-white underline font-bold">
        Upcoming Event Details
      </h1>

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          className="bg-white text-black border border-gray-400 hover:bg-blue-100"
          onClick={() => setViewMode(viewMode === "table" ? "calendar" : "table")}
        >
          Switch to {viewMode === "table" ? "Calendar View" : "Table View"}
        </Button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{
          zIndex: 9999, 
          marginTop: "60px",
        }}
      />

      {viewMode === "table" ? (
        bookings.length === 0 ? (
          <p className="text-4xl text-center text-red-600">No bookings available.</p>
        ) : (
          <div className="bg-black/10 p-4 mt-10 mx-auto rounded-xl shadow-md cardShape">
            <table className="w-full border-collapse border border-gray-300 bg-white rounded-xl">
              <thead>
                <tr className="bg-blue-200">
                  <th className="border p-2 text-black">Name</th>
                  <th className="border p-2 text-black">Event Type</th>
                  <th className="border p-2 text-black">Event Date</th>
                  <th className="border p-2 text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .slice()
                  .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                  .map((book) => {
                    const formattedDate = new Date(book.eventDate).toISOString().split("T")[0];
                    return (
                      <tr key={book._id} className="hover:bg-gray-300">
                        <td className="border p-2 text-center">{book.clientName}</td>
                        <td className="border p-2 text-center">{book.eventType}</td>
                        <td className="border p-2 text-center">{formattedDate}</td>
                        <td className="border p-2 text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={() => setSelectedBooking(book)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                View
                              </button>
                            </DialogTrigger>
                            {selectedBooking && selectedBooking._id === book._id && (
                              <DialogContent className="max-h-[80vh] overflow-y-auto w-[600px] bg-gray-50 rounded-2xl shadow-2xl p-6 space-y-6">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-bold text-center">
                                    {selectedBooking.clientName}'s Booking
                                  </DialogTitle>
                                </DialogHeader>
                                

                                <div className="bg-white rounded-xl shadow p-4 border">
                                  <h3 className="text-lg font-semibold mb-2 text-blue-600">Client Info</h3>
                                  <p><strong>Email:</strong> {selectedBooking.email}</p>
                                  <p><strong>Phone:</strong> {selectedBooking.phoneNumber}</p>
                                  <p><strong>Address:</strong> {selectedBooking.address}</p>
                                </div>

                                <div className="bg-white rounded-xl shadow p-4 border">
                                  <h3 className="text-lg font-semibold mb-2 text-green-600">Event Details</h3>
                                  <p><strong>Type:</strong> {selectedBooking.eventType}</p>
                                  <p><strong>Date:</strong> {new Date(book.eventDate).toISOString().split("T")[0]}</p>
                                  <p><strong>Location:</strong> {selectedBooking.location}</p>
                                  <p><strong>Duration:</strong> {selectedBooking.duration}</p>
                                </div>

                                <div className="bg-white rounded-xl shadow p-4 border">
                                  <h3 className="text-lg font-semibold mb-2 text-purple-600">Preferences</h3>
                                  <p><strong>Guest Count:</strong> {selectedBooking.guestCount}</p>
                                  <p><strong>Budget:</strong> {selectedBooking.budgetRange}</p>
                                  <p><strong>Heard From:</strong> {selectedBooking.knowUs}</p>
                                  <p><strong>Services:</strong> 
                                    {selectedBooking.videography === "true" && " Videography"}
                                    {selectedBooking.drone === "true" && ", Drone"}
                                    {selectedBooking.live === "true" && ", Live Streaming"}
                                  </p>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                  <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 mt-4 rounded-lg shadow-md"
                                    onClick={() => handleDeleteClick(book)}
                                  >
                                    Delete
                                  </button>
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
          </div>
        )
      ) : ( 
<div className="bg-white rounded-xl p-6 mt-6 shadow-md w-fit mx-auto cardShape">
  <Calendar className="w-full"
    tileClassName={({ date, view }) => {
      const isEventDay = bookings.some(
        (b) => new Date(b.eventDate).toDateString() === date.toDateString()
      );
      return isEventDay ? "event-day" : "";
    }}
    tileContent={({ date }) => {
      const hasEvent = bookings.some(
        (b) => new Date(b.eventDate).toDateString() === date.toDateString()
      );
      return hasEvent ? (
        <div className="w-full flex justify-center items-center mt-1">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
        </div>
      ) : null;
    }}
    onClickDay={(date) => {
        const dayEvents = bookings.filter(
            (b) => new Date(b.eventDate).toDateString() === date.toDateString()
          );
          setSelectedDate(date);
          setSelectedDateEvents(dayEvents);
    }}
  />
  <Dialog open={selectedDateEvents.length > 0} onOpenChange={() => setSelectedDateEvents([])}>
        <DialogContent className="max-h-[80vh] overflow-y-auto w-[600px] bg-white rounded-2xl shadow-2xl p-6 space-y-6">
            <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
                Events on {selectedDate?.toDateString()}
            </DialogTitle>
            </DialogHeader>

            {selectedDateEvents.map((selectedBookings, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 shadow border border-gray-200 space-y-2">
                <div className="bg-white rounded-xl shadow p-4 border">
                  <h3 className="text-lg font-semibold mb-2 text-blue-600">Client Info</h3>
                  <p><strong>Email:</strong> {selectedBookings.email}</p>
                  <p><strong>Phone:</strong> {selectedBookings.phoneNumber}</p>
                  <p><strong>Address:</strong> {selectedBookings.address}</p>
                </div>

                <div className="bg-white rounded-xl shadow p-4 border">
                  <h3 className="text-lg font-semibold mb-2 text-green-600">Event Details</h3>
                  <p><strong>Type:</strong> {selectedBookings.eventType}</p>
                  <p><strong>Date:</strong> {selectedBookings.eventDate}</p>
                  <p><strong>Location:</strong> {selectedBookings.location}</p>
                  <p><strong>Duration:</strong> {selectedBookings.duration}</p>
                </div>

                <div className="bg-white rounded-xl shadow p-4 border">
                 <h3 className="text-lg font-semibold mb-2 text-purple-600">Preferences</h3>
                 <p><strong>Guest Count:</strong> {selectedBookings.guestCount}</p>
                 <p><strong>Budget:</strong> {selectedBookings.budgetRange}</p>
                 <p><strong>Heard From:</strong> {selectedBookings.knowUs}</p>
                 <p><strong>Services:</strong> 
                  {selectedBookings.videography === "true" && " Videography"}
                  {selectedBookings.drone === "true" && ", Drone"}
                  {selectedBookings.live === "true" && ", Live Streaming"}
                  </p>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 mt-4 rounded-lg shadow-md"
                    onClick={() => handleDeleteClick(selectedBookings)}
                  >
                    Delete
                  </button>
                </div>
            </div>
            ))}
        </DialogContent>
      </Dialog>
    </div>

      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && bookingToDelete && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="w-[500px] bg-white rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-lg">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="mb-4">Are you sure you want to delete this event?</p>
              <DialogFooter>
                <Button variant="outline" onClick={handleDeleteCancel}>Cancel</Button>
                <Button className="bg-red-500 text-white" onClick={handleDeleteConfirm}>Yes, Delete</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UpComingEvents;
