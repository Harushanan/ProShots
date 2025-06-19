import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import blogBG from "@/assets/blogBG.jpg";
import BookingForm from "@/components/customer-view/home/BookingForm";
import Footer from "@/components/customer-view/common/Footer";

const DisplayOldFullEvent = () => {
    const { id } = useParams();
    const [specificEvent, setSpecificEvent] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [validImage, setValidImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSpecificEvent = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`http://localhost:5000/api/getSpecificEvent/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                if (res.ok) {
                    const response = await res.json();  
                    setSpecificEvent(response.data);
                } else {
                    alert("Event not found.");
                }
            } catch (error) {
                console.error(error); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpecificEvent();
    }, [id]);

    useEffect(() => {
        const checkImageSizes = async () => {
            if (!specificEvent?.EventURLs?.length) return;

            for (const image of specificEvent.EventURLs) {
                const img = new Image();
                img.src = image.url;

                await new Promise((resolve) => {
                    img.onload = () => {
                        if (img.width >= 1920 && img.height >= 600) {
                            setValidImage(image.url);
                        }
                        resolve();
                    };
                    img.onerror = resolve;
                });

                if (validImage) break;
            }
        };

        checkImageSizes();
    }, [specificEvent]);

    const handleNavigate = () => {
        window.history.back();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!specificEvent) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700">Event not found</h2>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Back Button */}
            <button 
                onClick={handleNavigate}
                className="fixed top-4 left-4 z-50 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition"
            >
                <img 
                    src={assets.backward} 
                    className="w-8 h-8 rotate-180 hover:opacity-75" 
                    alt="Go back" 
                />
            </button>
            
            {/* Hero Section */}
            <div className="relative w-full h-[70vh] max-h-[800px] overflow-hidden">
                {validImage ? (
                    <img
                        src={validImage}
                        alt="Event Cover"
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    <img
                        src={blogBG}
                        alt="Default Event Cover"
                        className="w-full h-full object-cover object-center"
                    />
                )}
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                        {specificEvent?.ClientName}
                    </h1>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4 drop-shadow-lg">
                        {specificEvent?.Place} {specificEvent?.EventType} Shoot
                    </h2>
                    <p className="hidden md:block text-lg text-white/90 max-w-3xl mx-auto drop-shadow-md">
                        {specificEvent?.Description}
                    </p>
                </div>
            </div>

            {/* Booking Form */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-48 relative z-10">
                <div className="rounded-xl p-6 md:p-8 max-w-4xl mx-auto">
                    <BookingForm />
                </div>
            </div>

            {/* Gallery Section */}
            {specificEvent?.EventURLs?.length > 0 ? (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
                        Event Gallery
                    </h2>
                    
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
                        {specificEvent.EventURLs.map((imageUrls, idx) => (
                            imageUrls ? (
                                <div 
                                    key={idx} 
                                    className="relative group break-inside-avoid rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                                    onClick={() => setSelectedImage(imageUrls.url)}
                                >
                                    <img
                                        src={imageUrls.url}
                                        alt={`Event ${idx + 1}`}
                                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="text-white text-lg font-medium">View</span>
                                    </div>
                                </div>
                            ) : (
                                <div key={idx} className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                    No Image Available
                                </div>
                            )
                        ))}
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">No images available for this event</p>
                </div>
            )}
            
            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                    <button
                        className="absolute top-0 right-2 text-white text-6xl hover:text-red-500 transition"
                        onClick={() => setSelectedImage(null)}
                    >
                        &times;
                    </button>
                    <div className="h-full flex items-center justify-center">
                        <img 
                        src={selectedImage} 
                        alt="Full View" 
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" 
                        />
                    </div>
                    </div>
                </div>
                )}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default DisplayOldFullEvent;