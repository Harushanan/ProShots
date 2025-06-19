import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import userprofile from '../../../assets/userimge.png';
import logo from '../../../assets/Logo.png';
import Cookies from 'js-cookie';
import axios from 'axios';
import "./css/profile.css";
import Swal from "sweetalert2";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'; // Importing Chart.js

const AdminviewProfile = () => {
  const navigate = useNavigate();
  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
  const myemail = userSession.user?.email || "";

  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [event, setEvent] = useState([]);
  const [order, setOder] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // 🔹 NEW: filter state
  const [loading, setLoading] = useState(true);  // Loading state for data fetching

  useEffect(() => {
    axios.get("http://localhost:5000/getuserdeatiles", { params: { id } })
      .then((result) => {
        setUser(result.data.user);
        setEvent(result.data.eventbooking);
        setOder(result.data.order);
        setLoading(false);  // Data loaded, stop the loading state
       
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);  // Even if error occurs, stop loading
      });
  }, [id]);

  // 🔹 Filter utility function
  const filterByStatus = (data, status) => {
    if (!status) return data;
    return data.filter((item) => item.status.toLowerCase() === status.toLowerCase());
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'processing':
      case 'Completed':
        return 'green';
      case 'canceled':
      case 'rejected':
        return 'red';
      case 'pending':
        return 'blue';
      default:
        return 'black';
    }
  };

  // 🔹 Graph Data Preparation
const getStatusCounts = (data) => {
  const counts = {
    accepted: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    canceled: 0,
    rejected: 0
  };

  data.forEach((item) => {
    const status = item.status.toLowerCase();
    if (counts.hasOwnProperty(status)) {
      counts[status]++;
    }
  });

  return counts;
};

  const eventCounts = getStatusCounts(event);
  const orderCounts = getStatusCounts(order);

  console.log("Event count : " , eventCounts)
  console.log("order count : " , orderCounts)

  // 🔹 Chart Data
  const chartData = {
    labels: ['Accepted', 'Pending', 'Processing', 'Completed', 'Canceled', 'Rejected'],
    datasets: [
      {
        label: 'Event Bookings',
        data: Object.values(eventCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Orders',
        data: Object.values(orderCounts),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 🔹 Conditional Rendering for Loading
  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("event:", event);

  return (
    <div className="profile-container" style={{ background: "linear-gradient(to right,rgba(51, 51, 51, 0.48),rgba(238, 238, 238, 0.81))" }}>
      <header className="profile-header">
        <Link
          to={userSession.user?.role === "admin" ? "/admin/dashboard" : "/client/home"}
          className="back-button"
          style={{ backgroundColor: "rgb(59, 74, 122)" }}
        >
          <b>Back</b>
        </Link>
      </header>

      <div className="profile-content">
        <div className="orders-container">
          <div>
            <h1 style={{ color: "white" }}>
              <b>{user.username}</b> Orders & Photography Bookings
            </h1>
          </div>

{/* 🔹 Chart Display for Events and Orders */}
<div style={{ 
  marginBottom: "30px", 
  marginTop: "30px", 
  textAlign: "center",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
}}>
  <h2 style={{ 
    color: "#2c3e50",
    marginBottom: "20px",
    fontWeight: "600"
  }}>
    Event & Order Status
  </h2>
  
  <div className="chart-container" style={{ 
    width: '100%', 
    height: '300px',
    position: 'relative'
  }}>
    <Bar 
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#2c3e50',
              font: {
                size: 14,
                weight: '500'
              },
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff'
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#2c3e50',
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(0,0,0,0.05)'
            },
            ticks: {
              color: '#2c3e50',
              font: {
                size: 12
              },
              precision: 0
            }
          }
        },
        elements: {
          bar: {
            borderRadius: 4
          }
        }
      }}
    />
  </div>
</div>


          <div style={{ marginBottom: 15, background: "#fff", padding: 10, borderRadius: 5, display: "inline-flex", alignItems: "center", maxWidth: 300 }}>
            <label htmlFor="statusFilter" style={{ color: "#000", marginRight: 10, fontWeight: "bold", whiteSpace: "nowrap" }}>Filter by Status:</label>
            <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 120, padding: 5, borderRadius: 4 }}>
              <option value="">All</option>
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>


        

          <h2 style={{ color: "white" }}>Event Photography</h2>
          <div className="table-wrapper">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(event) && filterByStatus(event, statusFilter).length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>
                      No event booking found
                    </td>
                  </tr>
                ) : (
                  filterByStatus(event, statusFilter).map((ob, index) => (
                    <tr
                      key={`${ob.email}-${index}`}
                      style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}
                    >
                      <td>{ob.eventType}</td>
                      <td>{ob.duration}</td>
                      <td>{Number(ob.budgetRange).toLocaleString()}</td>
                      <td>{ob.eventDate.slice(0, 10)}</td>
                      <td style={{ color: getStatusColor(ob.status) }}>
                        {ob.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h2 style={{ color: "white" }}>Orders</h2>
          <div className="table-wrapper">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Products Cart Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(order) && filterByStatus(order, statusFilter).length === 0 ? (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', color: 'red' }} >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filterByStatus(order, statusFilter).map((ob, index) => (
                    <tr
                      key={`${ob._id || ob.email || index}`}
                      style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}
                    >
                      <td>
                        <table className="styled-table2" style={{ width: '95%', margin: '10px auto', borderCollapse: 'collapse' }}>
                          <thead style={{ background: "linear-gradient(to right, #6a82fb, #fc5c7d)" }}>
                            <tr>
                              <th>Product</th>
                              <th>Size</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(ob.items) &&
                              ob.items.map((item, idx) => (
                                <tr
                                  key={item._id || idx}
                                  style={{
                                    backgroundColor: idx % 2 === 0 ? '#fafafa' : '#fff',
                                  }}
                                >
                                  <td>{item.productName}</td>
                                  <td>{item.size}</td>
                                  <td>{item.quantity}</td>
                                  <td>{Number(item.total).toLocaleString()}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </td>
                      <td style={{ color: getStatusColor(ob.status) }}>
                        {ob.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminviewProfile;
