import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import CheckAddPackage from './CheckAddPackage';
import { Toaster } from 'sonner';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const AddPackages = () => {
  const [error, setError] = useState("");
  const [activeSpeechField, setActiveSpeechField] = useState(null);
  const navigate = useNavigate();
  const speechTimeout = useRef(null);

  const [formDetails, setFormDetails] = useState({
    packageHead: '',
    packageSubhead: '',
    price: '',
    sessionPeriod: '',
    noOfCameraman: '',
    photoCount: '',
    albumDetails: ''
  });

    // Text-to-speech function
    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

      

  const commands = [
    {
      command: 'set heading',
      callback: () => {
        speak("Please say the package heading now");
        resetTranscript();
        setActiveSpeechField('packageHead');
        SpeechRecognition.startListening({ continuous: true });
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8
    },
    {
      command: 'set subheading',
      callback: () => {
        speak("Please say the package sub heading now");
        resetTranscript();
        setActiveSpeechField('packageSubhead');
        SpeechRecognition.startListening({ continuous: true });
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8
    },
    {
      command: 'set price',
      callback: () => {
        speak("Please say the package price now");
        resetTranscript();
        setActiveSpeechField('price');
        SpeechRecognition.startListening({ continuous: true });
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8
    },
    {
      command: 'set sessionPeriod',
      callback: () => {
        speak("Please say the package sessionPeriod now");
        resetTranscript();
        setActiveSpeechField('sessionPeriod');
        SpeechRecognition.startListening({ continuous: true });
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8
    },
    {
      command: 'set number Of Cameraman',
      callback: () => {
        speak("Please say the number Of Cameraman now");
        resetTranscript();
        setActiveSpeechField('noOfCameraman');
        SpeechRecognition.startListening({ continuous: true });
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.7,
      matchInterim: true
    },
    {
      command: 'set number Of photos',
      callback: () => {
        speak("Please say the number Of photos now");
        resetTranscript();
        setActiveSpeechField('photoCount');
        SpeechRecognition.startListening({ continuous: true });
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8
    },
    {
      command: 'set album details',
      callback: () => {
        speak("Please say the album details now");
        resetTranscript();
        setActiveSpeechField('albumDetails');
        SpeechRecognition.startListening({ continuous: true });
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.8
    },
    {
        command: 'submit package',
        callback: () => {
          resetTranscript();
          const fakeEvent = { preventDefault: () => {} };
          handleSubmit(fakeEvent);
        },
        isFuzzyMatch: true,
        fuzzyMatchingThreshold: 0.8
    },
  ];


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
  
      // Process the transcript based on field type
      let processedValue = transcript;
      
      // Special handling for number fields
      if (['noOfCameraman', 'photoCount', 'sessionPeriod', 'price'].includes(activeSpeechField)) {
        // Convert number words to digits
        const numberWords = {
          'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
          'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
          'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
          'fourteen': '14', 'fifteen': '15', 'twenty': '20', 'thirty': '30',
          'forty': '40', 'fifty': '50', 'hundred': '100'
        };
        
        // Find number words in the transcript
        const numberMatch = Object.keys(numberWords).find(word => 
          transcript.toLowerCase().includes(word)
        );
        
        // Extract digits from transcript
        const digitMatch = transcript.match(/\d+/);
        
        // Use number word if found, otherwise use digits
        processedValue = numberMatch ? numberWords[numberMatch] : 
                        digitMatch ? digitMatch[0] : 
                        transcript;
      }
  
      // Start 1 second timer to finalize input
      speechTimeout.current = setTimeout(() => {
        setFormDetails((prev) => ({
          ...prev, 
          [activeSpeechField]: processedValue
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!CheckAddPackage(formDetails)) {
        setError("Invalid Form Inputs. check the error message.");
        return;
    }
      
        const response = await fetch('http://localhost:5000/api/addPackages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
                body: JSON.stringify(formDetails)
        });
      
        if (!response.ok) {
            const datas = await response.json();
            if (datas.message) {
                toast.error(datas.message);
            } else {
                toast.error('Booking Failed');
            }
            return;
        } else {          
            toast.success("Package added successfully.") 
            setError("Package added successfully."); 
            setFormDetails({
                packageHead: '',
                packageSubhead: '',
                price: '',
                sessionPeriod: '',
                noOfCameraman: '',
                photoCount: '', 
                albumDetails: ''
            })
            
            console.log('Submitted Data:', formDetails);
        }
    }

    return (
      <div className="relative min-h-screen py-10 px-4">
        {/* Navigation */}
        <nav className="bg-blue-600 shadow-md mb-10 w-full max-w-6xl mx-auto rounded-lg">
          <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-white text-xl font-bold mb-2 sm:mb-0">Package Management</h1>
            <div className="flex space-x-4 sm:space-x-6">
              <Link 
                to="/admin/newPackages" 
                className="text-white hover:text-blue-100 transition-colors px-3 py-1 rounded-md"
              >
                Add New Packages
              </Link>
              <Link 
                to="/admin/deletePackages" 
                className="text-white hover:text-blue-100 transition-colors px-3 py-1 rounded-md"
              >
                Delete Packages
              </Link>
            </div>
          </div>
        </nav>


    
        {/* Form Container */}
        <div className="cardShape w-full max-w-2xl mx-auto">
          <div className="bg-white backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
            <ToastContainer
              position="top-center"
              autoClose={3000}
              toastClassName="!bg-white !text-gray-800 !shadow-lg !rounded-lg !border !border-gray-200"
              style={{ zIndex: 9999 }}
            />
            <Toaster position="bottom-center" />
    
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 pb-2 border-b border-gray-200">
              Add New Package
            </h1>
    
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="packageHead" className="block text-sm font-medium text-gray-700 mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    id="packageHead"
                    name="packageHead"
                    placeholder="Package Title"
                    value={formDetails.packageHead}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
    
                <div>
                  <label htmlFor="packageSubhead" className="block text-sm font-medium text-gray-700 mb-1">
                    Subheading
                  </label>
                  <input
                    type="text"
                    id="packageSubhead"
                    name="packageSubhead"
                    placeholder="Package Subtitle"
                    value={formDetails.packageSubhead}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Rs)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="0.00"
                      value={formDetails.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
    
                  <div>
                    <label htmlFor="sessionPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                      Session Period (hours)
                    </label>
                    <input
                      type="number"
                      id="sessionPeriod"
                      name="sessionPeriod"
                      placeholder="4"
                      value={formDetails.sessionPeriod}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="noOfCameraman" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Cameramen
                    </label>
                    <input
                      type="number"
                      id="noOfCameraman"
                      name="noOfCameraman"
                      placeholder="1"
                      value={formDetails.noOfCameraman}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
    
                  <div>
                    <label htmlFor="photoCount" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Photos
                    </label>
                    <input
                      type="number"
                      id="photoCount"
                      name="photoCount"
                      placeholder="50"
                      value={formDetails.photoCount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>
    
                <div>
                  <label htmlFor="albumDetails" className="block text-sm font-medium text-gray-700 mb-1">
                    Album Details
                  </label>
                  <input
                    type="text"
                    id="albumDetails"
                    name="albumDetails"
                    placeholder="e.g. 10x12 Premium Album"
                    value={formDetails.albumDetails}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
    
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Package
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
    export default AddPackages;