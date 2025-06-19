import OldEventUploadPage from "@/pages/admin-view/oldEvent/OldEventUpload";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";


const OldEvents = () => {
    const [OldEvent, setOldEvent] = useState([]);
    const navigate = useNavigate();

    const handleNavigate = (id) => {
        navigate(`/admin/DisplayOldFullEvent/${id}`)
    }
    
   

    const handleEventRemove = async (index, place) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you really want to delete ${place}'s event?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
            const res = await fetch(`http://localhost:5000/api/deleteOldEvent/${index}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success(`${place}'s event deleted successfully!`);
                setOldEvent((prevEvent) => prevEvent.filter((event) => event._id !== index));
            } else {
                Swal.fire("Error", "Unable to delete the event.", "error");
            }
            } catch (error) {
            Swal.fire("Oops!", "Something went wrong.", "error");
            console.error(error);
            }
        }
    };



    useEffect(() => {
        const fetchOldEvents = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/getOldEvents", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const result = await res.json();
                setOldEvent(result.data);
                console.log(result.data);
            } catch (error) {
                console.error("Error fetching old events:", error);
                setOldEvent([]);
            }
        };

        fetchOldEvents();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
          <ToastContainer 
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover={false}
            draggable
            newestOnTop
            rtl={false}
            className="z-[9999] fixed top-4"
            toastClassName="bg-white shadow-lg rounded-lg border border-gray-200"
          />
      
          <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10 pb-2 border-b-2 border-blue-100">
            PAST EVENT DETAILS
          </h1>
      
          {OldEvent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {OldEvent.map((Events, idx) => {
                const imageUrl = Events.EventURLs?.[0]?.url;
      
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleNavigate(Events._id)}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer border border-gray-200 hover:border-blue-300"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Event"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <span>No Image Available</span>
                        </div>
                      )}
                    </div>
      
                    {/* Event Details */}
                    <div className="p-4 flex-grow flex flex-col">
                      <h2 className="text-xl font-semibold text-blue-800 text-center mb-3 line-clamp-2">
                        {Events.Place}
                      </h2>
                      
                      <div className="mt-auto flex justify-between items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(Events._id);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors"
                        >
                          See More
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventRemove(Events._id, Events.Place);
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block bg-gray-100 rounded-full p-6 mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-600">
                No past events available
              </h2>
            </div>
          )}
        </div>
      );
    }
      
      export default OldEvents;