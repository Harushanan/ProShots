import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import userprofile from '../../../assets/userimge.png';
import logo from '../../../assets/Logo.png';
import { ToastContainer, toast } from "react-toastify";

function AdminDashboard() {
  const [user, setUser] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [reason, setReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal state
  const [selectedEmail, setSelectedEmail] = useState(null); // Selected user email for delete

  const navigate = useNavigate();

  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
  const customername = userSession ? userSession.user.username : "Guest";

  useEffect(() => {
    axios.get("http://localhost:5000/studentdeatiles")
      .then((result) => { 
        setUser(result.data);
        setSearchResults(result.data); 
        console.log("Users : " , user);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [userCount]);

  useEffect(() => {
    if (user) {
      setUserCount(user.length);  
      console.log("Total User : " , userCount)
    }
  }, [user]);

  function deleteUser(e, email ,name) {
    e.preventDefault();
    if (reason === "") return;

      setShowConfirmModal(true);
      setSelectedEmail(email);

    
    toast.success(`${name} deleted successfully!`);
    
  }

  function handleConfirmDelete() {
    axios.post("http://localhost:5000/deleteuser", { email: selectedEmail, reason })
      .then((result) => {
        console.log("Response from server:", result);
        setUser((prev) => prev.filter((user) => user.email != selectedEmail));
        setShowConfirmModal(false); // Close modal on success
      })
      .catch((err) => {
        console.error("Delete Error:", err);
        setShowConfirmModal(false); // Close modal on error
      });
  }

  function handleCancelDelete() {
    setShowConfirmModal(false); // Close the modal if user cancels
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
  
    const filteredUsers = user.filter(user => 
      user.username.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query) || 
      user.address.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query)
    );



    setSearchResults(filteredUsers);
  };

  function logout(){
    const logoutconfirm = window.confirm("Are you sure you want to logout this account ?");
    if (logoutconfirm) {
      Cookies.remove("user");
      navigate('/'); 
    }
  }

  function ViewUser(e,id){
    navigate(`/admin/userdetails/${id}`); 
  }

  return (
    <div className='w-11/12 mx-auto'>
      <nav className="bg-blue-500 p-4 shadow-lg mt-10 w-10/12 m-auto">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-white text-xl font-bold">User Management</h1>
              <div className="space-x-6 flex items-center">
                  <Link to="/admin/dashboard" className="text-white hover:text-gray-200">
                      Current Customers
                </Link>
                <Link to="/admin/delet-user" className="text-white hover:text-gray-200">
                      Deleted Customers
                </Link>
              </div>
            </div>
          </nav>

          <h1 className='text-4xl mt-8 mb-8 text-center text-white underline font-bold'>Current Customers</h1>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
        
        <input
          type="text"
          placeholder="Search....."
          value={searchQuery}
          onChange={handleSearch} 
          style={{ width: '300px', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
        />
      </div>

      <h2 className='inline-block text-blue-600 bg-white bg-w-cover font-bold text-xl ml-5 py-3 px-5'>Total number of customers: {searchResults.length}</h2>

      <div className="relative z-0 cardShape rounded-xl">
      <table className="w-full border-collapse border border-gray-300 bg-white rounded-xl relative z-10">
        <thead style={{ color: '#333' }} className='bg-blue-50'>
          <tr>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Address</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Phone Number</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>View Details</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'center' }}>Reason</th>
            {/* <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Add Admin</th> */}
          </tr>
        </thead>
        <tbody>
          {searchResults.map((ob, index) => (
            <tr key={ob.email} style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.username}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.email}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.address}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.phone}</td>
              <td style={{ textAlign: 'center' }}>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bffb7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}  onClick={(e) => ViewUser(e, ob._id)} >
                  View
                </button>
              </td>
              
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <form 
                 onSubmit={
                (e) => { e.preventDefault(); 
                 deleteUser(e, ob.email) , ob.username }} style={{ display: 'flex', alignItems: 'center' }}>
                 <input  type="text" name="reason" onChange={(e) => setReason(e.target.value)} required
                  style={{ padding: '8px', width: '70%', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
               />
                 <button type="submit"
                  style={{ padding: '8px 15px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}
                 >
                 Delete
              </button>
             </form>
</td>

              {/* <td>
                <button style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                  Add Admin
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Are you sure you want to delete this user?</h2>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmDelete}>Yes, Delete</button>
              <button className="cancel-btn" onClick={handleCancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal CSS */}
      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 50;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .modal {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .modal-buttons {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
          }
          .confirm-btn {
            padding: 10px 20px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .cancel-btn {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .confirm-btn:hover, .cancel-btn:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </div>
  );
}

export default AdminDashboard;
