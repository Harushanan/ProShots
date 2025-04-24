import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import CheckAddPackage from './CheckAddPackage';
import { Toaster } from 'sonner';

const AddPackages = () => {
  const [formDetails, setFormDetails] = useState({
    packageHead: '',
    packageSubhead: '',
    price: '',
    sessionPeriod: '',
    noOfCameraman: '',
    photoCount: '',
    albumDetails: ''
  });

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <nav className="bg-blue-500 p-4 shadow-lg mt-10 mb-10 w-10/12 mx-auto">
                      <div className="container mx-auto flex justify-between items-center">
                          <h1 className="text-white text-xl font-bold">Package Management</h1>
                          <div className="space-x-6 flex items-center">
                              <Link to="/admin/newPackages" className="text-white hover:text-gray-200">
                                  Add New Packages
                              </Link>
                              <Link to="/admin/deletePackages" className="text-white hover:text-gray-200">
                                  Delete Packages
                              </Link>
                          </div>
                      </div>
                  </nav>

      <div className="relative z-0 cardShape rounded-xl w-6/12">
      <div className="bg-white/85 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
         <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    style={{
                        zIndex: 9999,
                    }}
                /> 
        <Toaster position='bottom-center' />
        <h1 className="text-3xl text-center font-extrabold text-gray-800 mb-6">Add New Package</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center space-y-5"
        >
          <input
            type="text"
            name="packageHead"
            placeholder="Heading"
            value={formDetails.packageHead}
            onChange={handleChange}
            className="w-full text-lg p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="packageSubhead"
            placeholder="Subheading"
            value={formDetails.packageSubhead}
            onChange={handleChange}
            className="w-full text-lg p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Package Price"
            value={formDetails.price}
            onChange={handleChange}
            className="w-full text-lg p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="number"
            name="sessionPeriod"
            placeholder="Session Period (e.g. 4)"
            value={formDetails.sessionPeriod}
            onChange={handleChange}
            className="w-full text-lg p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="number"
            name="noOfCameraman"
            placeholder="No. of Cameramen"
            value={formDetails.noOfCameraman}
            onChange={handleChange}
            className="w-full text-lg p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="number"
            name="photoCount"
            placeholder="No. of Photos"
            value={formDetails.photoCount}
            onChange={handleChange}
            className="w-full text-lg p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="albumDetails"
            placeholder="Album Details"
            value={formDetails.albumDetails}
            onChange={handleChange}
            className="w-full text-lg p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow-md transition"
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
