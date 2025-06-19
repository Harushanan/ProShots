import { assets } from "@/assets/assets";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const OldEvents = () => {
    const [OldEvent, setOldEvent] = useState([]);
    const [filterSearch, setFilterSearch] = useState([]);
    const navigate = useNavigate();
    const [visibleSort, setVisibleSort] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const location = useLocation();


    const userData = Cookies.get('user');
    const user = userData ? JSON.parse(userData) : null;
    const userEmails = user && user.user ? user.user.email : null;

    let currentTheme;

if (userEmails != null) {
    currentTheme = useOutletContext().currentTheme;
} else {
    currentTheme = "bg-blue-50";
}

    // Define theme to background color mappings
  const themeBackgrounds = {
    ocean: "from-blue-100 to-blue-100",
    forest: "from-green-100 to-green-100",
    royal: "from-purple-100 to-purple-100",
    blossom: "from-rose-100 to-rose-100",
    tropical: "from-emerald-100 to-emerald-100",
    golden: "from-amber-100 to-amber-100",
    berry: "from-fuchsia-100 to-fuchsia-100",
    misty: "from-gray-100 to-gray-100",
    sunset: "from-orange-100 to-orange-100",
    midnight: "from-indigo-100 to-indigo-100",
    coral: "from-rose-100 to-rose-100",
    sapphire: "from-blue-100 to-blue-100",
    emerald: "from-emerald-100 to-emerald-100",
    lavender: "from-purple-100 to-purple-100",
    amber: "from-amber-100 to-amber-100"
  };

  // Default to ocean theme if currentTheme is not found
  const bgClasses = themeBackgrounds[currentTheme] || themeBackgrounds.ocean;



    const handleNavigation = (id) => {
        navigate(`/client/DisplayOldFullEvent/${id}`);
    };

    useEffect(() => {
        const fetchOldEvents = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/getOldEvents', {
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
        <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 dark:text-gray-100">
            {location.pathname == '/client/blog' && (
                <div className="mb-8">
                    <div className="fixed z-50 rounded-full bottom-10 right-5">
                        <DarkModeToggle />
                    </div>
                    {/* Desktop Filter */}
                    <div className="hidden md:block">
                        <div className="flex flex-wrap justify-center gap-4 py-4 bg-white rounded-lg shadow-sm border border-gray-100">
                            {["All", "Wedding", "Pre-Wedding", "Engagement", "BirthDay", "School Event", "Mehndi", "Other"].map((category, index) => (
                                <div key={index}>
                                    <button
                                        className={`px-4 py-2 rounded-full text-sm md:text-base transition-all duration-200 ${
                                            selectedCategory === category 
                                                ? "bg-red-500 text-white font-semibold shadow-md transform scale-105" 
                                                : "text-gray-600 hover:text-red-500 hover:bg-red-50 border border-gray-200"
                                        }`}
                                        onClick={handleFilter}
                                    >
                                        {category}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    

                    {/* Mobile Filter */}
                    <div className="md:hidden">
                        <div 
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => setVisibleSort(!visibleSort)}
                        >
                            <span className="text-base font-medium text-gray-700 dark:text-gray-300">Filter by: {selectedCategory}</span>
                            <svg 
                                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${visibleSort ? "rotate-180" : ""}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {visibleSort && (
                            <div className="mt-2 bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-600">
                                {["All", "Wedding", "Pre-Wedding", "Engagement", "BirthDay", "School Event", "Mehndi", "Other"].map((category, index) => (
                                    <div 
                                        key={index} 
                                        className={`p-4 border-b border-gray-100 dark:border-gray-600 last:border-b-0 flex items-center gap-3 cursor-pointer transition-colors duration-150 ${
                                            selectedCategory === category ? "bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400" : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                        }`}
                                        onClick={handleFilter}
                                    >
                                        <span className={`w-2.5 h-2.5 rounded-full ${
                                            selectedCategory === category ? "bg-red-500 dark:bg-red-400" : "bg-gray-300 dark:bg-gray-500"
                                        }`}></span>
                                        <span className={`text-sm font-medium ${
                                            selectedCategory === category ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-300"
                                        }`}>{category}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {filterSearch.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filterSearch.slice(0, maxEvents).map((Events, idx) => {
                        const imageUrl = Events.EventURLs?.[0]?.url;

                        return (
                            <div 
                                key={idx} 
                                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-red-100 dark:hover:border-red-900"
                                onClick={() => handleNavigation(Events._id)}
                            >
                                <div className="relative h-56 overflow-hidden">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt="Event Image"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 line-clamp-1">
                                        {Events.Place}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {Events.EventType}
                                    </p>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <button className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors duration-300 flex items-center">
                                            View Details
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-inner">
                    <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-5 text-xl font-medium text-gray-700 dark:text-gray-300">No events found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">We couldn't find any events matching your criteria. Try adjusting your filters.</p>
                    {selectedCategory !== "All" && (
                        <button 
                            onClick={() => {
                                setSelectedCategory("All");
                                setFilterSearch(OldEvent);
                            }}
                            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium text-sm"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OldEvents;