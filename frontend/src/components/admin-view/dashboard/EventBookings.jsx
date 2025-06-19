import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from "react-router-dom";


const EventBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [sortOrder, setSortOrder] = useState("default");
    const [sortedBookings, setSortedBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [matchEvent, setMatchEvent] = useState([]);
    const [matchEventDisplay, setMatchEventDisplay] = useState([]);
    const [finalBudget, setFinalBudget] = useState('');
    const [errors, setErrors] = useState(false);

    const [voiceSearch, setVoiceSearch] = useState("");



    const commands = [
        {
            command: "search for *",            
            callback: (spokenQuery) => {
                setVoiceSearch("");
                handleSearchListen("");
                setSearchQuery("");

                setTimeout(() => {
                    console.log("Transcript : "+transcript);
                    console.log("Search text : "+spokenQuery);
                    setVoiceSearch(spokenQuery);
                    resetTranscript();
                    SpeechRecognition.startListening({ continuous: true });
                }, 100)
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.7,
            matchInterim: false,
            bestMatchOnly: true
          }, 
    ]

    const { 
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        console.log("Transcript: " + transcript);
        console.log("Search text: " + transcript);
        const lowerTranscript = transcript.toLowerCase();

        if (lowerTranscript.startsWith("search for")) {
            const query = lowerTranscript.replace("search for", "").trim();

            if (query) {
                console.log("Transcript: " + transcript);
                console.log("Search text: " + query);
                setSearchQuery(query);
                handleSearchListen(query);

                setTimeout(() => {
                    resetTranscript();
                    SpeechRecognition.startListening({ continuous: true });
                }, 1000); 
            }
        }
    }, [transcript, voiceSearch])
        

    const handleSearchListen = (e) => {
        setSearchQuery(e);
        const query = e.toLowerCase();
       
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
    };

    
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const query = e.target.value.toLowerCase();
       
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
    

    const handleAccept = (id, clientName, email, eDate, eType, location, budgetRng) => {
        setConfirmAction({
            type: "accept",
            id,
            clientName,
            email,
            eDate,
            eType,
            location,
            budgetRng
        });
    };

    const handleReject = (id, clientName, email, eDate, eType, location, budgetRng) => {
        setConfirmAction({
            type: "reject",
            id,
            clientName,
            email,
            eDate,
            eType,
            location,
            budgetRng
        });
    };

    const confirmActionHandler = () => {
        const { type, id, clientName, email, eDate, eType, location, budgetRng } = confirmAction;
        let finalSend = 0;
        if (!confirmAction) return;
        if( confirmAction.type == "accept" ) {
            if( finalBudget< 3000 || finalBudget>1000000 ) {
                setErrors(true);
                return;
            }
        } 
        setIsProcessing(true);

        

        const status = type === "accept" ? "Accepted" : "Rejected";

        if( status == "Accepted") {
            finalSend = finalBudget;
        } else if( status == "Rejected" ) {
            finalSend = budgetRng;
        } else {
            return;
        } 

        fetch(`http://localhost:5000/api/updatebookings/${id}/${email}/${finalSend}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, clientName, eventDate: eDate, eventType: eType, eventLocation: location }),
        }).then(res => {
            if (res.ok) {
                toast.success(`${clientName}'s booking ${status.toLowerCase()} successfully!`);
                setSortedBookings(prev => prev.filter(book => book._id !== id));
                setBookings(prev => prev.filter(book => book._id !== id));
                setSelectedBooking(null);
                setUpcomingBookings(prev => [
                    ...prev,
                    {
                        _id: id,
                        clientName,
                        email,
                        eventDate: eDate,
                        eventType: eType,
                        location,
                    }
                ]);
            } else {
                toast.error("Unable to update");
            }
        }).catch(() => toast.error("Error updating booking"))
        .finally(() => {
            setConfirmAction(null) ;
            setIsProcessing(false);
        });
    };

    useEffect(() => {
        setFinalBudget('');
        setErrors(false);
        if (confirmAction) {
            var matchDisplay = "";
            setMatchEventDisplay([]);
            setMatchEvent([]);
            const matched = upcomingBookings.filter(event => 
                new Date(event.eventDate).toISOString().split("T")[0] === 
                new Date(confirmAction.eDate).toISOString().split("T")[0]
            );
    
            if (matched.length > 0) {
                matchDisplay = matched.map(event =>
                    `<p>${event.clientName}'s ${event.eventType} booking.</p>`
                );
                setMatchEventDisplay((prev) => matchDisplay)
            }
        }
    }, [confirmAction, upcomingBookings]);

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

    useEffect(() => {
        fetch("http://localhost:5000/api/getUpcomingBookings", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => response.json())
          .then((data) => setUpcomingBookings(data || []))
          .catch(() => toast.error("Failed to fetch upcoming bookings"));
      }, []);
 
    if (loading) {
        return <h1 className="text-center text-green-800 p-10 border-black border-4 m-10 text-4xl">Loading...</h1>;
    }

    return (
        <div className="w-9/12 mx-auto p-4 mb-4">
            <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    style={{
                        zIndex: 9999,  // Make sure the toast is on top of the header
                        marginTop: '60px', // Add some margin to push the toast down below the header
                        backgroundColor: 'white !important',
                    }}
            />
            
            <h1 className="text-4xl mt-8 mb-8 text-center text-white underline font-bold">Event Booking Details</h1>

            <div className="flex justify-between items-center mb-10 w-10/12 m-auto">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by Name or Event Type"
                    className="w-9/12 p-2 border-2  border-sky-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />

                <select 
                    value={sortOrder} 
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-3/12 px-4 py-2 text-lg  border-sky-500 border-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                    <option value="default">🔄 Reset to Default</option>
                    <option value="asc">⬆ Sort Ascending</option>
                    <option value="desc">⬇ Sort Descending</option>
                </select>
            </div>


            {bookings.length === 0 ? (
                <p className="text-4xl text-center text-red-600">No bookings available.</p>
            ) : (
                <div className="relative z-0 cardShape rounded-xl"> 
                <table className="w-full border-collapse border border-gray-300 bg-white rounded-xl relative z-10">
                    <thead>
                        <tr className="bg-blue-200">
                            <th className="border border-gray-400 p-2 text-center">No</th>
                            <th className="border border-gray-400 p-2 text-center">Name</th>
                            <th className="border border-gray-400 p-2 text-center">Event Type</th>
                            <th className="border border-gray-400 p-2 text-center">Event Date</th>
                            <th className="border border-gray-400 p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sortedBookings.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center text-red-500 text-lg font-bold p-4">
                                No Bookings Matched!
                            </td>
                        </tr>
                    ) : (
                        sortedBookings.map((book, index) => { 
                            const formattedDate = new Date(book.eventDate).toISOString().split("T")[0];
                            return (
                                <tr key={book._id} className="bg-white cursor-pointer hover:bg-gray-300">
                                    <td className="border border-gray-400 p-2 text-center">{index+1}</td>
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
                                                <DialogContent className="max-h-[80vh] overflow-y-auto w-[600px] bg-gray-50 rounded-2xl shadow-2xl p-6 space-y-6">
                                                <DialogHeader>
                                                  <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
                                                    {selectedBooking.clientName}'s Booking
                                                  </DialogTitle>
                                                </DialogHeader>

                                                {/* Client Information Box */}
                                                <div className="bg-white rounded-xl shadow p-4 space-y-1 border border-gray-200">
                                                  <h3 className="text-lg font-semibold mb-2 text-blue-600">Client Information</h3>
                                                  <p><strong>Email:</strong> {selectedBooking.email}</p>
                                                  <p><strong>Phone:</strong> {selectedBooking.phoneNumber}</p>
                                                  <p><strong>Address:</strong> {selectedBooking.address}</p>
                                                </div>
                                              
                                                {/* Event Details Box */}
                                                <div className="bg-white rounded-xl shadow p-4 space-y-1 border border-gray-200">
                                                  <h3 className="text-lg font-semibold mb-2 text-green-600">Event Details</h3>
                                                  <p><strong>Type:</strong> {selectedBooking.eventType}</p>
                                                  <p><strong>Date:</strong> {formattedDate}</p>
                                                  <p><strong>Location:</strong> {selectedBooking.location}</p>
                                                  <p><strong>Duration:</strong> {selectedBooking.duration}</p>
                                                </div>
                                              
                                                {/* Preferences Box */}
                                                <div className="bg-white rounded-xl shadow p-4 space-y-1 border border-gray-200">
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
                                              
                                                {/* Action Buttons */}
                                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-300">
                                                  <Button 
                                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
                                                    onClick={() => handleReject(
                                                      selectedBooking._id, selectedBooking.clientName, selectedBooking.email, 
                                                      selectedBooking.eventDate, selectedBooking.eventType, selectedBooking.location, selectedBooking.budgetRange
                                                    )}
                                                  >
                                                    Reject
                                                  </Button>
                                                  <Button 
                                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
                                                    onClick={() => handleAccept(
                                                      selectedBooking._id, selectedBooking.clientName, selectedBooking.email, 
                                                      selectedBooking.eventDate, selectedBooking.eventType, selectedBooking.location, selectedBooking.budgetRange
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
                        })
                      )}
                    </tbody>
                </table>
                </div>
            )}

            {confirmAction && (
                <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                    <DialogContent className="w-[400px] bg-white rounded-xl shadow-2xl border border-gray-200">
                        <DialogHeader>
                            <DialogTitle className="text-lg ps-5 font-semibold text-gray-900">
                                {confirmAction.type === "accept"
                                    ? `Confirm Acceptance`
                                    : `Confirm Rejection`}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-5 pt-0 text-gray-700">
                        {matchEventDisplay.length > 0 && (
                            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md border border-yellow-300">
                                <p className="font-medium"><strong className="font-bold text-lg">Warning:<br/></strong> There are existing bookings on this date!</p>
                                <div className="pt-2">
                                    {matchEventDisplay.map((msg, index) => (
                                        <p className="text-red-700 font-medium" key={index} dangerouslySetInnerHTML={{ __html: msg }} />
                                    ))}
                                </div>
                                </div>
                        )}
                            <p className="pt-4">
                                Are you sure you want to{" "}
                                <strong className={confirmAction.type === "accept" ? "text-green-600" : "text-red-600"}>
                                    {confirmAction.type}
                                </strong>{" "}
                                the booking for <strong className="text-gray-900">{confirmAction.clientName}</strong>?
                            </p>
                        </div>
                        <DialogFooter className="flex justify-between gap-4 p-5 ps-0 border-t border-gray-200">
                            <Button className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-4 py-2 rounded-lg transition-all" 
                                onClick={() => setConfirmAction(null)}
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>

                            <div className="flex gap-2 border-t border-gray-200">
                                {confirmAction.type === "accept" &&
                                    <input 
                                        type="number" 
                                        name="finalBudget" 
                                        onChange={(e) => setFinalBudget(e.target.value)} 
                                        value={finalBudget} 
                                        placeholder="Final Budget"
                                        className="border border-gray-700 bg-indigo-100 rounded-lg px-3 py-2 w-full sm:w-40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                    />
                                }
                                <Button className={`px-4 py-2 font-medium rounded-lg transition-all ${
                                        confirmAction.type === "accept"
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-red-600 hover:bg-red-700 text-white"
                                    }`} 
                                    onClick={confirmActionHandler}
                                    disabled={isProcessing}
                                >
                                    {confirmAction.type === "accept" ? "Accept" : "Reject"}
                                </Button>
                            </div>
                        </DialogFooter>
                        { errors && <p className="text-center text-red-600">Please Enter the correct amount.</p> }
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
};

export default EventBookings;
