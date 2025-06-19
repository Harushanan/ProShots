import React from 'react';
import { useEffect , useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import logo from '../../../assets/Logo.png'

import axios from 'axios';

function AddAdmin() {
  const [user, setuser] = useState([]);
  const [usercount, setusercount] = useState(0);
  

  useEffect(() => {
       axios.get("http://localhost:5000/displayadmin").then(
        (result) => { setuser(result.data);
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

  

  

  return (
    <>
     
     <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px 30px' }}>
    <img src={logo} alt="Logo" style={{ width: '260px', height: '100px' }} />
    
    <nav style={{ display: 'flex', gap: '20px' }}>
        <Link to="/customer" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Customer</b></Link>
                  <Link to="/order" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Order</b></Link>
                  <Link to="/inventory" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Photography</b></Link>
                  <Link to="/feedback" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Feedback</b></Link>
                  <Link to="/feedback" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Delivery</b></Link>
    </nav>

    <Link to="/" style={{ display: 'inline-block', padding: '10px 20px', fontSize: '18px', backgroundColor: 'rgb(20, 190, 190)', color: 'white', textDecoration: 'none', borderRadius: '25px', textAlign: 'center' }}><b>Login</b></Link>
</header>

      <h1>Admin</h1>

       <nav style={{ backgroundColor: 'rgb(0, 0, 0)', padding: '10px', display: 'inline-block' }}>
                <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                     <li style={{ display: 'inline', marginRight: '20px' }}><Link to ="/admin-deatiles" style={{ textDecoration: 'none', color: 'rgb(0, 255, 255)' }}>Admin</Link></li>
                                     <li style={{ display: 'inline', marginRight: '20px' }}><Link  to="/Home" style={{ textDecoration: 'none', color: 'rgb(0, 255, 255)' }}>Current customers</Link></li>
                                     <li style={{ display: 'inline' }}><Link to ="/auth/delet-user" style={{ textDecoration: 'none', color: 'rgb(0, 255, 255)' }}>Past customers</Link></li>
                     
               </ul>
     </nav>



      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
      <input
        type="text"
        //value={searchQuery}
        //onChange={handleSearchChange}
        placeholder="Search..."
        style={{
          width: '300px',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          marginRight: '10px',
        }}
      />
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>

  <h2>Total Customers Removed: {usercount}</h2>

<table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
  <thead style={{ backgroundColor: '#f4f4f4', color: '#333' }}>
    <tr>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Address</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Phone Number</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Add Date</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>

    </tr>
  </thead>
  <tbody>
    {user.map((ob) => (
      <tr key={ob.email} style={{ backgroundColor: ob % 2 === 0 ? '#fafafa' : '#fff' }}>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.username}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.email}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.address}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.phone}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.date}</td>
        <td>
        <button
                    style={{ padding: '8px 15px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}
                    onClick={() => deleteUser(ob.email)}
                  >
                    Remove Admin
                  </button>
        </td>

      </tr>
    ))}
  </tbody>
</table>


    </>
  );
}

export default AddAdmin;