import Cookies from 'js-cookie'; 
import Swal from 'sweetalert2';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const customername = userSession ? userSession.user.username : "Guest";

    function logout() {
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
        <div>
            <a onClick={(logout)}><p className='cursor-pointer hover:text-black'>Logout</p></a>
        </div>
    )
}

export default Logout;