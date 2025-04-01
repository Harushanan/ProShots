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
        <div className='w-10/12 mx-auto'>
            <ToastContainer 
                position = "top-center"
                autoClose = {4000}
                hideProgressBar = {false}
                closeOnClick = {true}
                pauseOnHover = {false}
                draggable = {true}
                progress = {undefined}
                newestOnTop = {true}
                rtl = {false}
                style={{ zIndex: 9999, position: 'fixed', top: 0 }} 
            />

            <h1 className="text-4xl mt-8 mb-8 text-center text-blue-900 underline font-bold">PAST EVENT DETAILS</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-5 gap-y-20">
                {OldEvent.length > 0 ? (
                    OldEvent.map((Events, idx) => {
                        const imageUrl = Events.EventURLs?.[0]?.url;

                        return (
                            <div key={idx} onClick={() => handleNavigate(Events._id)} className="bg-gray-200 rounded-lg h-auto shadow-lg hover:shadow-xl p-[1.5px] hover:border-2 hover:border-gray-400 hover:rounded-lg flex flex-col justify-between">

                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="Event Image"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Image Available
                                    </div>
                                )}
                                <h2 className="text-center text-2xl text-blue-900 font-semibold mt-4 mb-5 font-[Noto Sans JP]">
                                    {Events.Place}
                                </h2>
                                <h2 className="text-center text-lg text-gray-500 font-medium underline hover:text-red-600 hover:cursor-pointer mt-auto pb-4">
                                    See More
                                </h2>
                                <button
                                    type="button"
                                    className="bg-red-500 text-white rounded-full px-1 py-2 hover:bg-red-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEventRemove(Events._id, Events.Place);
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })
                ) : ( <h1>No Events are here!</h1>) }
            </div>
        </div>
    );
};

export default OldEvents;

