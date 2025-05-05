import React from 'react';
import { useEffect , useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'; 
import userprofile from '../../../assets/userimge.png'

import logo from '../../../assets/Logo.png'
import axios from 'axios';

function DeleteUser() {
  const [user, setuser] = useState([]);
  const [usercount, setusercount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  
    const navigate = useNavigate()
  
    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const customername = userSession ? userSession.user.username : "Guest";
  

  useEffect(() => {
       axios.get("http://localhost:5000/deletuserdeatiles").then(
        (result) => {
           setuser(result.data);
           setSearchResults(result.data); 
        console.log(user)
     })
      .catch((error) => console.error("Error fetching data:", error));
    }, [usercount]);

  useEffect(() => {
    if (user) {
      setusercount(user.length);  
      console.log(user.length); 
    }
  }, [user]);  //

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
      const logoutconform = window.confirm("Are you sure you want to logout this account ?");
      if (logoutconform) {
        Cookies.remove("user");
        navigate('/'); 
    }
  }

  
return (
    <div className='w-11/12 mx-auto'>     
       <nav className="bg-blue-500 p-4 shadow-lg mt-10 w-10/12 mx-auto">
                   <div className="container mx-auto flex justify-between items-center">
                     <h1 className="text-white text-xl font-bold">User Management</h1>
                     <div className="space-x-6 flex items-center">
                         <Link to="/admin/dashboard" className="text-white hover:text-gray-200">
                           Current customers
                       </Link>
                       <Link to="/admin/delet-user" className="text-white hover:text-gray-200">
                           Deleted customers
                       </Link>
                     </div>
                   </div>
        </nav>
       



      <h1 className='text-4xl mt-8 mb-8 text-center text-white underline font-bold'>Deleted Customers</h1>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <input
          type="text"
          placeholder="Search....."
          value={searchQuery}
          onChange={handleSearch} 
          style={{ width: '300px', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
        />
      </div>

    </div>

  <h2 className='inline-block text-blue-600 bg-white bg-w-cover font-bold text-xl ml-5 py-3 px-5'>Total Customers Removed: {searchResults.length}</h2>

  <div className="relative z-0 cardShape rounded-xl">
  <table className="w-full border-collapse border border-gray-300 bg-white rounded-xl relative z-10">
  <thead style={{ color: '#333' }} className='bg-blue-50'>
    <tr>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Address</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Phone Number</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Number of Photoshoots</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Number of Orders</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Delete Reason</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Remove By</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Remove Date</th>
    </tr>
  </thead>
  <tbody>
    {searchResults.map((ob) => (
      <tr key={ob._id} style={{ backgroundColor: ob % 2 === 0 ? '#fafafa' : '#fff' }}>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.username}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.email}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.address}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.phone}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>10</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>12</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.reason}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.removeby}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.date}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>

    </div>
  );
}

export default DeleteUser;
