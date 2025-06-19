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
                <div id="swal-content">
                    <h2 class="swal-title">Are you sure?</h2>
                    <p class="swal-text">You will be logged out!</p>
                </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
            customClass: {
                popup: "bg-gray-800 rounded-xl p-6 shadow-lg",
                confirmButton: "swal-confirm-button",
                cancelButton: "swal-cancel-button",
            },
            didOpen: () => {
                // Apply text color manually
                document.querySelector('.swal2-popup').style.backgroundColor = "#36454F"; // Gray background
                
                const title = document.querySelector(".swal-title");
                if (title) {
                    title.style.color = "#FACC15"; // Yellow title
                    title.style.fontSize = "1.25rem"; // Equivalent to Tailwind text-lg
                    title.style.fontWeight = "600"; // Equivalent to font-semibold
                }

                const text = document.querySelector(".swal-text");
                if (text) {
                    text.style.color = "#FFFFFF"; // White text
                }

                // Custom confirm button styling
                const confirmBtn = document.querySelector('.swal-confirm-button');
                if (confirmBtn) {
                    confirmBtn.style.backgroundColor = "#1E40AF"; // Blue
                    confirmBtn.style.color = "#fff";
                    confirmBtn.style.padding = "10px 20px";
                    confirmBtn.style.borderRadius = "6px";
                    confirmBtn.style.fontWeight = "bold";
                    confirmBtn.style.transition = "background 0.3s";
                    confirmBtn.onmouseover = () => confirmBtn.style.backgroundColor = "#1E3A8A"; // Darker blue on hover
                    confirmBtn.onmouseout = () => confirmBtn.style.backgroundColor = "#1E40AF";
                }

                // Custom cancel button styling
                const cancelBtn = document.querySelector('.swal-cancel-button');
                if (cancelBtn) {
                    cancelBtn.style.backgroundColor = "#B91C1C"; // Red
                    cancelBtn.style.color = "#fff";
                    cancelBtn.style.padding = "10px 20px";
                    cancelBtn.style.borderRadius = "6px";
                    cancelBtn.style.fontWeight = "bold";
                    cancelBtn.style.transition = "background 0.3s";
                    cancelBtn.onmouseover = () => cancelBtn.style.backgroundColor = "#991B1B"; // Darker red on hover
                    cancelBtn.onmouseout = () => cancelBtn.style.backgroundColor = "#B91C1C";
                }
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
            <a onClick={logout}><p className='cursor-pointer hover:text-black'>Logout</p></a>
        </div>
    );
}

export default Logout;
