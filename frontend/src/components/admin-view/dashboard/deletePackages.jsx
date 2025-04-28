import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

// 👉 Child Component
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
                    toast.success("You have successfully deleted the package.")
                }
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <ToastContainer
            position="top-center"
            autoClose={3000}
            style={{
                zIndex: 9999,
            }}
        /> 
            <nav className="bg-blue-500 p-4 shadow-lg w-10/12 mx-auto">
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

            <div className="w-11/12 mt-10 grid gap-8 grid-cols-4">
                {allPackage.length == 0 && <h1 className="text-center text-4xl text-red-600 font-bold mt-10 col-span-full">No Packages Available</h1> }
                {allPackage.map((pkg, index) => (
                    <div
                        key={index}
                        className="transition-all duration-500 transform bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl border border-gray-200"
                    >
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{pkg.packageHead}</h3>
                        <p className="text-lg text-gray-500 italic mb-4">{pkg.packageSubhead}</p>
                        <div className="text-blue-600 text-3xl font-bold mb-4">
                            {pkg.price} <span className="text-sm text-gray-500">Rs</span>
                        </div>
                        <ul className="text-gray-700 space-y-2 mb-6 text-base">
                            <li><strong>{pkg.sessionPeriod}</strong> Hour Photoshoot</li>
                            <li><strong>{pkg.noOfCameraman}</strong> Cameramen Included</li>
                            <li><strong>{pkg.photoCount}</strong> Digital Photos</li>
                            <li>{pkg.albumDetails}</li>
                        </ul>
                        <button
                            onClick={() => handleDelete(pkg._id)}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition w-full"
                        >
                            DELETE
                        </button>
                    </div>
                ))}
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
