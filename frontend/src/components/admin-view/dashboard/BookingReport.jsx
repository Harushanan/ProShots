import Navbar from '@/pages/admin-view/bookingsPage/NavBar';
import React, { useEffect, useState } from 'react';
import {
  FaCalendarAlt, FaUser, FaEnvelope, FaMapMarkerAlt,
  FaUsers, FaDollarSign, FaCameraRetro,
  FaPhone, FaSort, FaSortUp, FaSortDown,
  FaFilePdf, FaFileExcel, FaFilter, FaChartLine
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import BookingAnalytics from './BookingAnalytics';

const BookingReport = () => {
  const [allBooking, setAllBooking] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDate, setSortDate] = useState("default");
  const [sortBudget, setSortBudget] = useState("default");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [sortPastOrNew, setSortPastOrNew] = useState("all");
  const [selectedBookings, setSelectedBookings] = useState([]);
  const navigate = useNavigate();

  // Generate comprehensive PDF report
  const generateMonthlyPDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Monthly Booking Report", 14, 30);
    doc.setFontSize(12);
    doc.setTextColor(100);
  
    // Group bookings by month
    const bookingsByMonth = {};
  
    filteredBookings.forEach(book => {
      const isPast = new Date(book.eventDate) < new Date();
      const displayStatus = isPast && book.status === "Accepted" ? "Completed" : book.status;
  
      if (displayStatus === "Accepted" || displayStatus === "Completed") {
        const date = new Date(book.eventDate);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
  
        if (!bookingsByMonth[monthKey]) {
          bookingsByMonth[monthKey] = [];
        }
  
        bookingsByMonth[monthKey].push({ ...book, status: displayStatus });
      }
    });
  
    let currentY = 50;
  
    Object.entries(bookingsByMonth).forEach(([monthYear, bookings], index, arr) => {
      const tableRows = bookings.map((book) => [
        book.clientName,
        book.eventType,
        book.budgetRange,
        book.phoneNumber,
        book.location,
        new Date(book.eventDate).toLocaleDateString(),
        book.status,
      ]);
  
      // Convert month-year to readable format
      const readableMonth = new Date(`${monthYear}-01`).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
  
      // Add the month header
      doc.setFontSize(14);
      doc.text(`${readableMonth}`, 14, currentY);
      currentY += 8;
  
      // Calculate monthly totals
      const totalAmount = bookings.reduce((sum, b) => sum + (Number(b.budgetRange) || 0), 0);
      const totalCount = bookings.length;
  
      // Add summary
      doc.setFontSize(12);
      doc.text(`Total Bookings: ${totalCount}`, 14, currentY);
      currentY += 6;
      doc.text(`Total Revenue: Rs. ${totalAmount.toFixed(2)}`, 14, currentY);
      currentY += 7;
  
      // Add table
      autoTable(doc, {
        head: [['Client Name', 'Event Type', 'Budget', 'Phone', 'Location', 'Date', 'Status']],
        body: tableRows,
        startY: currentY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [52, 152, 219] },
      });

      currentY = doc.lastAutoTable.finalY + 30;
  
      // Add new page if needed
      if (currentY > 260 && index !== arr.length - 1) {
        doc.addPage();
        currentY = 30;
      }
    });
  
    doc.save(`monthly_booking_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Generate standard PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Booking Report", 14, 22);
  
    doc.setFontSize(12);
    doc.setTextColor(100);
  
    const totalBookings = filteredBookings.length;
    const totalBudget = filteredBookings
      .filter((book) => {
        const isPast = new Date(book.eventDate) < new Date();
        const displayStatus = isPast && book.status === "Accepted" ? "Completed" : book.status;
        return displayStatus === "Accepted" || displayStatus === "Completed";
      })
      .reduce((acc, book) => acc + parseFloat(book.budgetRange || 0), 0);
  
    doc.text(`Total Bookings: ${totalBookings}`, 14, 30);
    doc.text(`Total Revenue: Rs. ${totalBudget.toFixed(2)}`, 14, 38);
  
    const tableColumn = [
      "Client Name", "Event Type", "Phone", "Location", "Event Date", "Status", "Budget"
    ];
  
    const tableRows = filteredBookings.map((book) => {
      const isPast = new Date(book.eventDate) < new Date();
      const displayStatus = isPast && book.status === "Accepted" ? "Completed" : book.status;
  
      return [
        book.clientName,
        book.eventType,
        book.phoneNumber,
        book.location,
        new Date(book.eventDate).toLocaleDateString(),
        displayStatus,
        `Rs. ${book.budgetRange}`
      ];
    });
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        6: { cellWidth: 'auto', halign: 'right' } // Right-align budget column
      }
    });
  
    doc.save(`booking_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Fetch all bookings
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/getAllBookings', {
          method: "GET",
          headers: { "content-type": "application/json" }
        });
        const result = await res.json();
        setAllBooking(result.data);
      } catch (error) {
        console.log(error);
        setAllBooking([]);
      }
    };

    fetchAllBookings();
  }, []);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setEventTypeFilter('all');
    setSortDate('default');
    setSortBudget('default');
    setSortPastOrNew("all");
    setSelectedBookings([]);
  };

  // Toggle selection for a booking
  const toggleBookingSelection = (id) => {
    setSelectedBookings(prev => 
      prev.includes(id) 
        ? prev.filter(bookingId => bookingId !== id) 
        : [...prev, id]
    );
  };

  // Toggle select all bookings
  const toggleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(book => book._id));
    }
  };

  // Filter and sort bookings
  const filteredBookings = allBooking
    .filter((book) => {
      const isPast = new Date(book.eventDate) < new Date();
      const effectiveStatus = isPast && book.status === "Accepted" ? "Completed" : book.status;

      return (
        book.clientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === "all" || effectiveStatus === statusFilter) &&
        (eventTypeFilter === "all" || book.eventType === eventTypeFilter) &&
        (sortPastOrNew === "all" || (sortPastOrNew === "past" && isPast) || (sortPastOrNew === "upcoming" && !isPast))
      );
    })
    .sort((a, b) => {
      if (sortDate !== "default") {
        return sortDate === "asc"
          ? new Date(a.eventDate) - new Date(b.eventDate)
          : new Date(b.eventDate) - new Date(a.eventDate);
      }
      if (sortBudget !== "default") {
        const aBudget = parseFloat(a.budgetRange);
        const bBudget = parseFloat(b.budgetRange);
        return sortBudget === "asc" ? aBudget - bBudget : bBudget - aBudget;
      }
      return 0;
    });

  // Calculate total revenue
  const totalBudget = filteredBookings
    .filter((book) => {
      const isPast = new Date(book.eventDate) < new Date();
      const displayStatus = isPast && book.status === "Accepted" ? "Completed" : book.status;
      return displayStatus === "Accepted" || displayStatus === "Completed";
    })
    .reduce((acc, book) => acc + parseFloat(book.budgetRange || 0), 0);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Canceled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Report Actions */}
        <div className="flex flex-wrap justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-800">Booking Reports</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {filteredBookings.length} records
            </span>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
            <button
              onClick={generateMonthlyPDFReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaFilePdf className="mr-2" /> Monthly Report
            </button>
            <button
              onClick={generatePDFReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <BookingAnalytics />
            <button
              onClick={handleClearFilters}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaFilter className="mr-2" /> Clear Filters
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={sortPastOrNew}
            onChange={(e) => setSortPastOrNew(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Periods</option>
            <option value="past">Past Events</option>
            <option value="upcoming">Upcoming Events</option>
          </select>

          <select
            value={sortDate}
            onChange={(e) => setSortDate(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Sort by Date</option>
            <option value="asc">Date ↑</option>
            <option value="desc">Date ↓</option>
          </select>

          <select
            value={sortBudget}
            onChange={(e) => setSortBudget(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="default">Sort by Budget</option>
            <option value="asc">Budget ↑</option>
            <option value="desc">Budget ↓</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Canceled">Canceled</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Event Types</option>
            <option value="Wedding">Wedding</option>
            <option value="Pre-Wedding">Pre-Wedding</option>
            <option value="Engagement">Engagement</option>
            <option value="BirthDay">BirthDay</option>
            <option value="School Event">School Event</option>
            <option value="Mehndi">Mehndi</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Summary Stats */}
        {filteredBookings.length > 0 && (
          <div className="bg-white/25 text-gray-800 rounded-lg p-4 mb-8 shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-blue-600" /> Summary Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold">{filteredBookings.length}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">Rs. {totalBudget.toFixed(2)}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-600 font-medium">Average Booking Value</p>
                <p className="text-2xl font-bold">
                  Rs. {filteredBookings.length > 0 ? (totalBudget / filteredBookings.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Table */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white border-2 border-red-500 rounded-xl p-8 max-w-2xl mx-auto flex flex-col items-center justify-center shadow-lg space-y-4">
            <h2 className="text-2xl md:text-3xl text-blue-800 text-center font-semibold">
              No bookings match the current filters
            </h2>
            <div className="text-6xl">😔</div>
            <button 
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Client
                        {sortDate === 'asc' ? (
                          <FaSortUp className="ml-1 text-blue-600" />
                        ) : sortDate === 'desc' ? (
                          <FaSortDown className="ml-1 text-blue-600" />
                        ) : (
                          <FaSort className="ml-1 text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Date
                        {sortDate === 'asc' ? (
                          <FaSortUp className="ml-1 text-blue-600" />
                        ) : sortDate === 'desc' ? (
                          <FaSortDown className="ml-1 text-blue-600" />
                        ) : (
                          <FaSort className="ml-1 text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Budget
                        {sortBudget === 'asc' ? (
                          <FaSortUp className="ml-1 text-blue-600" />
                        ) : sortBudget === 'desc' ? (
                          <FaSortDown className="ml-1 text-blue-600" />
                        ) : (
                          <FaSort className="ml-1 text-gray-400" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((book) => {
                    const isPast = new Date(book.eventDate) < new Date();
                    const displayStatus = isPast && book.status === "Accepted" ? "Completed" : book.status;
                    const isSelected = selectedBookings.includes(book._id);

                    return (
                      <tr key={book._id} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => toggleBookingSelection(book._id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaUser className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{book.clientName}</div>
                              <div className="text-sm text-gray-500">{book.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaCameraRetro className="text-purple-500 mr-2" />
                            <span className="text-sm text-gray-900">{book.eventType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(book.eventDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {isPast ? 'Past event' : 'Upcoming'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <FaPhone className="inline mr-1 text-green-600" /> {book.phoneNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            <FaMapMarkerAlt className="inline mr-1 text-blue-600" /> {book.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Rs. {book.budgetRange}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(displayStatus)}`}>
                            {displayStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingReport;