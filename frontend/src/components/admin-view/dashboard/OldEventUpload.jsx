import OldEventUploadPage from "@/pages/admin-view/oldEvent/OldEventUpload";
import { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const OldEventUpload = () => {
    const speechTimeout = useRef(null);
    const [activeSpeechField, setActiveSpeechField] = useState(null);
    const [formDetails, setFormDetails] = useState({
        clientName: "",
        description: "",
        place: "",
        eventType: ""
        
    });
    const [image, setImage] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);


    // Text-to-speech function
    const speak = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    };


    const commands = [
      {
        command: 'set client Name',
        callback: () => {
          speak("Please say the client Name now");
          resetTranscript();
          setActiveSpeechField('clientName');
          SpeechRecognition.startListening({ continuous: true });
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.8
      },
      {
        command: 'set description',
        callback: () => {
          speak("Please say the description now");
          resetTranscript();
          setActiveSpeechField('description');
          SpeechRecognition.startListening({ continuous: true });
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.8
      },
      {
        command: 'set event place',
        callback: () => {
          speak("Please say the place now");
          resetTranscript();
          setActiveSpeechField('place');
          SpeechRecognition.startListening({ continuous: true });
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.8
      },
      {
        command: 'upload event',
        callback: () => {
          resetTranscript();
          const fakeEvent = { preventDefault: () => {} };
          onSubmit(fakeEvent)       
          SpeechRecognition.startListening({ continuous: true });
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.8
      },
    ]


    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });
  
    useEffect(() => {
      console.log('Transcript changed:', transcript);
      console.log('Active field:', activeSpeechField);
    
      if (activeSpeechField && transcript) {
        console.log('Updating field:', activeSpeechField, 'with:', transcript);
    
        // Clear any previous timeout
        if (speechTimeout.current) {
          clearTimeout(speechTimeout.current);
        }
    
        // Start 1 second timer to finalize input
        speechTimeout.current = setTimeout(() => {
          setFormDetails((prev) => ({
            ...prev,
            [activeSpeechField]: transcript
          }));
          setActiveSpeechField(null);
          resetTranscript();
          
          // Restart continuous listening after field input
          if (!listening) {
            SpeechRecognition.startListening({ continuous: true });
          }
        }, 1000);
      }
    
      // Cleanup timeout on unmount
      return () => {
        if (speechTimeout.current) {
          clearTimeout(speechTimeout.current);
        }
      };
    }, [transcript, activeSpeechField, listening, resetTranscript]);
    
  
  
    if (!browserSupportsSpeechRecognition) {
        toast.error("Your browser doesn't support speech recognition.")
    }



    const onSubmit = async(e) => {
        e.preventDefault();
        if (image.length < 5 ) {
            toast.error("Please upload at least five image.");
            return;
        }

        if (formDetails.description.length < 50) {
            toast.error("Description must be at least 50 characters.");
            return;
        }

        setIsSubmit(true);
    

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
                setIsSubmit(false);
            }).catch(error => {
                toast.dismiss(toastId);
                toast.error("Failed to submit details. Server unreachable.");
                console.error("Error submitting form:", error);
                setIsSubmit(false);
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
        <div className="min-h-screen py-8 px-4">
          <div className="cardShape max-w-4xl">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <ToastContainer
                position="top-center"
                autoClose={3000}
                toastClassName="bg-white shadow-lg rounded-lg border border-gray-200"
                style={{ zIndex: 9999 }}
              />
      
              <form onSubmit={onSubmit} className="space-y-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-8 pb-2 border-b-2 border-blue-100">
                  Upload Old Event Details
                </h1>
      
                {/* Client Name */}
                <div className="space-y-1">
                  <label className="block text-gray-700 ml-1">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    className="w-full p-3 border-2 border-blue-100 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    placeholder="Enter the Client Name"
                    onChange={(e) => setFormDetails({...formDetails, clientName: e.target.value})}
                    value={formDetails.clientName}
                    required
                  />
                </div>
      
                {/* Event Place */}
                <div className="space-y-1">
                  <label className="block text-gray-700 ml-1">Event Place</label>
                  <input
                    type="text"
                    name="place"
                    className="w-full p-3 border-2 border-blue-100 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    placeholder="Enter the event place"
                    onChange={(e) => setFormDetails({...formDetails, place: e.target.value})}
                    value={formDetails.place}
                    required
                  />
                </div>
      
                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-gray-700 ml-1">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    className="w-full p-3 border-2 border-blue-100 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    placeholder="Enter the description"
                    onChange={(e) => setFormDetails({...formDetails, description: e.target.value})}
                    value={formDetails.description}
                    required
                  />
                </div>
      
                {/* Event Type */}
                <div className="space-y-1">
                  <label className="block text-gray-700 ml-1">Event Type</label>
                  <select
                    className="w-full p-3 border-2 border-blue-100 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    onChange={(e) => setFormDetails({...formDetails, eventType: e.target.value})}
                    name="eventType"
                    value={formDetails.eventType}
                    required
                  >
                    <option value="" disabled>Select Event Type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="BirthDay">BirthDay</option>
                    <option value="School Event">School Event</option>
                    <option value="Mehndi">Mehndi</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Event Date */}
                <div className="space-y-1">
                  <label className="block text-gray-700 ml-1">Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    className="w-full p-3 border-2 border-blue-100 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
      
                {/* Event Photos */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-blue-800 text-center mt-8 mb-4">Event Photos</h2>
                  
                  {image.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {image.map((images, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden shadow-md h-48">
                          <img 
                            src={URL.createObjectURL(images)} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            alt="Selected preview" 
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                            onClick={() => handleImageRemove(idx)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <p className="text-gray-500">No images selected</p>
                    </div>
                  )}
      
                  <div className="flex justify-center">
                    <label className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      Add Images
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        multiple
                        disabled={isSubmit}
                      />
                    </label>
                  </div>
                </div>
      
                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${isSubmit ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-400'}`}
                    disabled={isSubmit}
                  >
                    {isSubmit ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : 'Upload Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          </div>
        </div>
      );
    }
      export default OldEventUpload;