import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const PackageScroll = ({ allPackage, setAllPackage }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:5000/api/deleteOnePackage/${id}`, {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json"
                    }
                });

                if (res.ok) {
                    setAllPackage((prev) => prev.filter(pkg => pkg._id !== id));
                    toast.success("Package deleted successfully!");
                }
            } catch (error) {
                console.error("Delete failed:", error);
                toast.error("Failed to delete package");
            }
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="z-50"
                toastClassName="bg-white text-gray-800 shadow-lg rounded-lg border border-gray-200"
            />
            
            {/* Navigation */}
            <nav className="bg-blue-600 shadow-md rounded-lg mb-10 w-full max-w-7xl mx-auto">
                <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-white text-xl font-bold mb-3 sm:mb-0">Package Management</h1>
                    <div className="flex space-x-4">
                        <Link 
                            to="/admin/newPackages" 
                            className="text-white hover:text-blue-100 px-3 py-1 rounded transition-colors"
                        >
                            Add New Packages
                        </Link>
                        <Link 
                            to="/admin/deletePackages" 
                            className="text-white px-3 py-1 rounded font-medium"
                        >
                            Delete Packages
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Packages Grid */}
            <div className="w-full max-w-7xl mx-auto">
                {allPackage.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-16 w-16 mx-auto text-gray-400 mb-4" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                            />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Packages Available</h2>
                        <p className="text-gray-500 mb-4">Add new packages to get started</p>
                        <Link 
                            to="/admin/newPackages" 
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add New Package
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allPackage.map((pkg, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col"
                            >
                                <div className="p-6 flex-grow">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.packageHead}</h3>
                                    <p className="text-gray-500 italic mb-4">{pkg.packageSubhead}</p>
                                    
                                    <div className="text-blue-600 text-2xl font-bold mb-4">
                                        {pkg.price} <span className="text-sm text-gray-500">Rs</span>
                                    </div>
                                    
                                    <ul className="text-gray-700 space-y-2 mb-6 text-sm">
                                        <li className="flex items-start">
                                            <svg className="w-4 h-4 mt-1 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span><strong>{pkg.sessionPeriod}</strong> Hour Photoshoot</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-4 h-4 mt-1 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span><strong>{pkg.noOfCameraman}</strong> Cameramen Included</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-4 h-4 mt-1 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span><strong>{pkg.photoCount}</strong> Digital Photos</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-4 h-4 mt-1 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>{pkg.albumDetails}</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                    <button
                                        onClick={() => handleDelete(pkg._id)}
                                        className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        Delete Package
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const DeletePackages = () => {
    const [allPackage, setAllPackage] = useState([]);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/getAllPackages', {
                    method: "GET",
                    headers: {
                        "content-type": "application/json"
                    }
                });
                const result = await res.json();
                setAllPackage(result.data);
            } catch (error) {
                console.error("Error fetching packages:", error);
                setAllPackage([]);
            }
        };

        fetchPackage();
    }, []);

    return <PackageScroll allPackage={allPackage} setAllPackage={setAllPackage} />;
};

export default DeletePackages;