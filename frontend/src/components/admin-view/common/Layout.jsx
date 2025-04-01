import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import Cookies from 'js-cookie'; 
import Swal from 'sweetalert2';
import React from 'react'
import { assets } from "@/assets/assets";
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const customername = userSession ? userSession.user.username : "Guest";

    const logout = () => {
        Swal.fire({
            html: `
                <div class="text-white">
                    <h2 class="text-lg font-semibold text-yellow-400">Are you sure?</h2>
                    <p>You will be logged out!</p>
                </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            customClass: {
                popup: "bg-gray-800 rounded-xl p-6 shadow-lg",
                confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
                cancelButton: "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Cookies.remove("user");
                navigate("/");
            }
        });
        
    }


  return (
    <div className="bg-gray-200">
        <div className="w-full bg-blue-950 h-auto sticky z-50 shadow-lg">
            <header>
                <h1 className="text-center text-white text-5xl p-4">ProShots Photography Studio</h1>
                <SideBar />
                <div className="absolute top-1 right-4"><img src={assets.logout} alt="" className="h-[70px]" onClick={(logout)}/></div>
            </header>
        </div>
        
        <div className="min-h-screen">
            <main>
                <Outlet />
            </main>
        </div>

        { !location.pathname.includes('/admin/gallery') &&
            <div className="w-full bg-black h-24 mt-10">
                <footer className="flex items-center justify-center h-full text-center text-white">
                    <div>
                        <p className="text-lg mt-2">© {new Date().getFullYear()} All rights reserved. | Made by ProShots</p>
                    </div>
                </footer>
            </div>
        }

    </div>
  )
}

export default AdminLayout;