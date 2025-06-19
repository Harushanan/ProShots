import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import blogBG from "@/assets/blogBG.jpg";
import Footer from "@/components/customer-view/common/Footer";


const DisplayOldFullEvent = () => {
    const { id } = useParams();
    console.log(id);
    const [specificEvent, setspecificEvent] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [validImage, setValidImage] = useState(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchSpecificEvent = async() => {
            try {
                const res = await fetch(`http://localhost:5000/api/getSpecificEvent/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                
                if(res.ok) {
                    const response = await res.json();  
                    setspecificEvent(response.data);
                    console.log(response.data)
                } else {
                    alert("Event not found.");
                }
            } catch (error) {
                console.log(error); 
            }
        }

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

    if (!specificEvent) {
        return <div className="text-center text-xl font-semibold mt-10">Loading...</div>;
    }

    const handleNavigate = () => {
        navigate('/admin/oldEventDelete')
    }

    return (
        <div> 
            <img src={assets.backward} 
                className="absolute top-2 left-2 w-12 rotate-180 h-10 hover:opacity-[0.5]" 
                alt="back" 
                onClick={handleNavigate}
            />
            
            <div className="w-full flex justify-center">
                {validImage ? (
                    <img
                        src={validImage}
                        alt="Event Cover"
                        className="w-full h-auto max-h-[100vh] shadow-lg"
                    />
                ) : (
                    <img
                        src={blogBG}
                        alt="Event Image not set"
                        className="w-full h-auto max-h-[90vh] shadow-lg"
                    />
                )}
            </div>

            <div className="absolute right-auto left-auto top-1 md:top-12 lg:top-44">
                <h1 className="text-lg md:text-3xl lg:text-4xl text-center m-5 text-white/90 font-medium">--- {specificEvent?.ClientName} ---</h1>
                <h1 className="text-xl md:text-4xl lg:text-5xl text-center m-5 text-white font-medium">{specificEvent?.Place} {specificEvent?.EventType} Shoot</h1>
                <h1 className="hidden md:block text-xl text-center m-5 text-white/90 font-medium w-2/3 mx-auto">{specificEvent?.Description}</h1>
            </div>


            {specificEvent?.EventURLs?.length > 0 ? (
                <div className="columns-2 md:columns-3 lg:columns-4 gap-7 space-y-6 ml-20 mr-20 mt-32">
                {specificEvent.EventURLs.map((imageUrls, idx) => {
                    if(!imageUrls) {
                        return (
                            <div key={idx} className="h-auto border-2 border-black">
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                    No Image Available
                                </div>
                            </div>
                        );
                    }

                    return (
                                <img
                                    src={imageUrls.url}
                                    alt="Image"
                                    key={idx}
                                    className="w-full break-inside-avoid rounded-lg shadow-lg"
                                    onClick={() => setSelectedImage(imageUrls.url)}
                                />
                        
                    )
                })}
                </div>
            ): null }            
            
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="relative">
                        <img src={selectedImage} alt="Full View" className="max-w-[90vw] max-h-[90vh] rounded-lg" />
                        <button
                            className="absolute top-2 right-3 text-white text-6xl font-normal hover:text-red-600"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-32">
                <Footer />
            </div>
        </div>
    );
};

export default DisplayOldFullEvent;
