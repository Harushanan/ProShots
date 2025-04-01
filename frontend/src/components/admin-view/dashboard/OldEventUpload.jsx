import OldEventUploadPage from "@/pages/admin-view/oldEvent/OldEventUpload";
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify";

const OldEventUpload = () => {
    const [formDetails, setFormDetails] = useState({
        clientName: "",
        description: "",
        place: "",
        eventType: ""
        
    });
    const [image, setImage] = useState([]);


    const onSubmit = async(e) => {
        e.preventDefault();
        if (image.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }

        try {
            const toastId = toast.loading("Wait until upload details.");
            const imageURLs = await Promise.all(image.map(async(img) => {
                const formData = new FormData();
                formData.append("file", img);

                formData.append("upload_preset", "proshots_event_management");
                formData.append("cloud_name", "proshots");
                
                const response = await fetch("https://api.cloudinary.com/v1_1/proshots/image/upload", {
                    method: "POST",
                    body: formData
                })

                if( !response.ok ) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const ImageData = await response.json();
                console.log(ImageData.url);
                return ImageData.secure_url;
            }))
            imageURLs.forEach((urls) => {
                console.log("Image URLS : "+urls);
            })
   
            const formData1 = {
                ClientName: formDetails.clientName,
                Place: formDetails.place,
                EventType: formDetails.eventType,
                Description: formDetails.description,
                EventURLs: imageURLs
            }
            console.log("Final Data Sent:", JSON.stringify(formData1, null, 2));
            await fetch("http://localhost:5000/api/oldEvents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData1),
            }).then(response => {
                toast.dismiss(toastId);
                if(response.ok) {
                    toast.success("Details submitted successfully!"); 
    
                    setImage([]);
                    setFormDetails({
                        clientName: "",
                        description: "",
                        place: "",
                        eventType: ""
                        
                    });
                } else{
                    toast.error("Details submit failed.");
                }
            }).catch(error => {
                toast.dismiss(toastId);
                toast.error("Failed to submit details. Server unreachable.");
                console.error("Error submitting form:", error);
            });
        } catch (error) {
            console.log(error);
        }
    }

 
    const handleImageChange = (e) => {
        const Selectedimages = Array.from(e.target.files);
        setImage((pre) => [...pre, ...Selectedimages]);

    }

    const handleImageRemove = (index) => {
        const updatedImage = image.filter((current, idx)=> idx !== index);
        setImage(updatedImage);
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-9/12 bg-black/10 h-auto m-4 p-7 rounded-2xl">
                <ToastContainer
                    position="top-center"
                    hideProgressBar={false}
                    closeOnClick={true}
                    pauseOnHover={false}
                    draggable={true}
                    progress={undefined}
                    newestOnTop={true}
                    rtl={false}
                    style={{ zIndex: 9999, position: 'fixed', top: 0 }}
                />
                <form onSubmit={onSubmit}>
                    <h1 className="text-4xl mt-8 mb-8 text-center text-blue-900 underline font-bold">Upload Old Event Details Here...</h1>
                    <input 
                        type="text" 
                        name="clientName"
                        className="p-4 rounded-lg border-black text-black flex w-11/12 m-5" 
                        placeholder="Enter the Client Name"
                        onChange={(e) => setFormDetails({...formDetails, clientName: e.target.value })}
                        value={formDetails.clientName}
                        required
                    />
                    <input 
                        type="text" 
                        name="place"
                        className="p-4 rounded-lg border-black text-black flex w-11/12 m-5" 
                        placeholder="Enter the event place"
                        onChange={(e) => setFormDetails({...formDetails, place: e.target.value })}
                        value={formDetails.place}
                        required
                    />
                    
                    <textarea 
                        type="text" 
                        name="description"
                        className="p-4 rounded-lg border-black text-black flex w-11/12 m-5" 
                        placeholder="Enter the description"
                        onChange={(e) => {
                            setFormDetails({ ...formDetails, description: e.target.value });
                        }}
                        value={formDetails.description}
                        required
                    />

                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 ml-5'>
                        <div className='flex flex-col'>
                            <select className='w-full p-2 border rounded-lg' 
                                onChange={(e)=> {setFormDetails({...formDetails, eventType: e.target.value})}} 
                                name= 'eventType'
                                value={formDetails.eventType}
                                required
                            >
                                <option value="" disabled>Select Event Type</option>
                                <option value='Wedding'>Wedding</option>
                                <option value='Pre-Wedding'>Pre-Wedding</option>
                                <option value='Engagement'>Engagement</option>
                                <option value='BirthDay'>BirthDay</option>
                                <option value='School Event'>School Event</option>
                                <option value='Mehndi'>Mehndi</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>
                    </div>

                    <h2 className="text-4xl text-blue-900 text-center mt-4">Event Photos</h2>
                    
                    <div className="flex flex-wrap gap-12 mt-7 ml-11">
                            { image.map((images,idx) => {  
                                return <div key={idx} className="w-3/12 h-auto overflow-hidden relative">
                                            <img src={URL.createObjectURL(images)} className="object-cover cursor-move" alt="Selectedimage" />

                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1"
                                                onClick={() => handleImageRemove(idx)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                
                            })}
                        </div>


                    <div className="mt-5 flex justify-center">
                        <label className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
                            Add Images
                            <input
                                type="file"
                                name="images"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                multiple
                            />
                        </label>
                    </div>

                    <br />
                    <div className="flex justify-center items-center w-11/12">
                        <button
                            type="submit"
                            className="px-5 py-2 bg-green-500 text-white rounded-md w-9/12 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            Submit
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default OldEventUpload;