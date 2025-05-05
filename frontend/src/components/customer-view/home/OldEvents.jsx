import { assets } from "@/assets/assets";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OldEvents = () => {
    const [OldEvent, setOldEvent] = useState([]);
    const [filterSearch, setFilterSearch] = useState([]);
    const navigate = useNavigate();
    const [visibleSort, setVisibleSort] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const location = useLocation();


    const handleNavigation = (id) => {
        navigate(`/client/DisplayOldFullEvent/${id}`);
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

                console.log("User Data : "+Cookies.get('user'));

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


    useEffect(() => {
        setFilterSearch(OldEvent);
    }, [OldEvent]);


    const handleFilter = (event) => {
        console.log(event.target.textContent);
        const category = event.target.textContent;
        const eventcpy = OldEvent;
        setSelectedCategory(category);
        
        
        if( category == "All" ) {
            setFilterSearch(OldEvent);
        } else if( category ) {
            setFilterSearch(
                eventcpy.filter((event) => event.EventType == category)
            );
        }
    }

    const maxEvents = location.pathname == "/client/home" ? 4 : filterSearch.length;


    return (
        <div className='w-10/12 mx-auto my-7'>
            {location.pathname == '/client/blog' ? 
                <div>
                    <p className="hidden md:flex justify-center items-center gap-4 flex-wrap py-4 bg-white shadow-md rounded-xl">
                        {["All", "Wedding", "Pre-Wedding", "Engagement", "BirthDay", "School Event", "Mehndi", "Other"].map((category, index) => (
                        <span 
                            key={index} 
                            className={`text-base md:text-lg px-3 rounded-full transition-all duration-300 cursor-pointer  ${selectedCategory === category ? "bg-red-100 text-red-600 font-semibold shadow-md" : "text-gray-600 hover:text-red-500 hover:bg-gray-100 cursor-pointer"}`} 
                            onClick={handleFilter}
                        >
                            {category}
                        </span>
                        )).reduce((prev, curr) => prev.length ? [...prev, <span key={`sep-${prev.length}`}>🚀</span>, curr] : [curr], [])}
                    </p>

        

                    <div className="block md:hidden">
                        <div className="flex items-center gap-2 hover:bg-gray-200 py-1 hover:cursor-pointer" onClick={() => setVisibleSort(!visibleSort)}>
                            <span className="text-2xl font-semibold mr-5 ml-5">Filter Category</span>
                            <img src={assets.adminDropdown} alt="" className={`w-6 h-auto transition-transform duration-300 ${visibleSort ? "rotate-0" : "-rotate-90"}`} />
                        </div>

                        { visibleSort && 
                            <div className="ml-7 text-lg">
                            {["All", "Wedding", "Pre-Wedding", "Engagement", "BirthDay", "School Event", "Mehndi", "Other"].map((category, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                                    <span>📌</span>
                                    <p className="m-0" onClick={handleFilter}>{category}</p>
                                </div>
                            ))}
                        </div>
                        }
                    </div>
                </div> : null
            
            }




            
            {filterSearch.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-5 gap-y-10 md:gap-y-20">
                { filterSearch.slice(0, maxEvents).map((Events, idx) => {
                        const imageUrl = Events.EventURLs?.[0]?.url;

                        return (
                            <div key={idx} className="h-auto bg-white rounded-lg shadow-lg hover:shadow-xl p-[2.5px] hover:border-2 hover:border-gray-400 hover:rounded-lg flex flex-col justify-between"
                                onClick={() => handleNavigation(Events._id)}
                            >
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
                            </div>
                        );
                    })}
                </div>
            ) : ( <h1 className="text-center texl-2xl md:text-4xl font-bold p-4 m-4 bg-gray-200 text-red-600">No Events are here!</h1>) }
        </div>
    );
};

export default OldEvents;
