import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartArea, 
  FaMoneyBillWave, 
  FaCalendarCheck, 
  FaDollarSign 
} from 'react-icons/fa';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const BookingAnalytics = () => {
  const [bookings, setBookings] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:5000/api/getAllBookings');
        const result = await res.json();
        setBookings(result.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      const data = processBookingData();
      setAnalyticsData(data);
    }
  }, [bookings]);

  const processBookingData = () => {
    const monthlyData = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Initialize 24 months (12 before and 12 after current month)
    for (let i = -12; i < 13; i++) {
      const date = new Date(currentYear, currentMonth + i, 1);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyData[monthYear] = {
        revenue: 0,
        bookings: 0,
        validBookings: 0,
        validRevenue: 0
      };
    }

    // Process all bookings
    bookings.forEach(book => {
      const date = new Date(book.eventDate);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const budget = parseFloat(book.budgetRange) || 0;
      const isPast = date < currentDate;
      const displayStatus = isPast && book.status === "Accepted" ? "Completed" : book.status;

      if (monthlyData[monthYear]) {
        monthlyData[monthYear].bookings += 1;
        monthlyData[monthYear].revenue += budget;

        if (displayStatus === "Accepted" || displayStatus === "Completed") {
          monthlyData[monthYear].validBookings += 1;
          monthlyData[monthYear].validRevenue += budget;
        }
      }
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));

    // Format for ChartJS
    const labels = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      return new Date(year, monthNum - 1).toLocaleDateString('default', { month: 'short', year: 'numeric' });
    });

    // Calculate totals
    const totalValidBookings = bookings.filter(book => {
      const isPast = new Date(book.eventDate) < currentDate;
      const status = isPast && book.status === "Accepted" ? "Completed" : book.status;
      return status === "Accepted" || status === "Completed";
    }).length;

    const totalValidRevenue = bookings.reduce((sum, book) => {
      const isPast = new Date(book.eventDate) < currentDate;
      const status = isPast && book.status === "Accepted" ? "Completed" : book.status;
      if (status === "Accepted" || status === "Completed") {
        return sum + (parseFloat(book.budgetRange) || 0);
      }
      return sum;
    }, 0);

    return { 
      labels, 
      chartData: {
        revenue: sortedMonths.map(month => monthlyData[month].validRevenue),
        bookings: sortedMonths.map(month => monthlyData[month].validBookings)
      },
      totals: {
        bookings: totalValidBookings,
        revenue: totalValidRevenue,
        avgValue: totalValidRevenue / (totalValidBookings || 1)
      }
    };
  };

  const revenueChartData = {
    labels: analyticsData?.labels || [],
    datasets: [
      {
        label: 'Monthly Revenue (Rs)',
        data: analyticsData?.chartData.revenue || [],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        tension: 0.1,
        fill: chartType === 'line',
      },
    ],
  };

  const bookingsChartData = {
    labels: analyticsData?.labels || [],
    datasets: [
      {
        label: 'Monthly Bookings',
        data: analyticsData?.chartData.bookings || [],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        tension: 0.1,
        fill: chartType === 'line',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Inter, sans-serif',
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function(value) {
            if (value >= 1000) {
              return 'Rs.' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return 'Rs.' + value;
          }
        }
      },
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: 'bottom',
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: 'white',
        borderWidth: 2
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="gap-2" disabled>
        <FaChartLine className="animate-pulse" /> Loading Analytics...
      </Button>
    );
  }

  return (
    <div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <FaChartLine className="text-white" /> 
            <span className="hidden sm:inline">View Analytics</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="w-full h-[85vh] bg-gradient-to-b from-gray-50 to-white rounded-t-2xl p-0 overflow-hidden shadow-2xl"
        >
          <ScrollArea className="h-full w-full p-6">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaChartLine className="text-indigo-600" /> Booking Analytics Dashboard
              </SheetTitle>
            </SheetHeader>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border border-indigo-100 bg-indigo-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-indigo-600">
                    Total Revenue
                  </CardTitle>
                  <FaMoneyBillWave className="h-5 w-5 text-indigo-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-800">
                    Rs. {analyticsData?.totals.revenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-indigo-500 mt-1">
                    From {analyticsData?.totals.bookings} completed bookings
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-emerald-100 bg-emerald-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-600">
                    Total Bookings
                  </CardTitle>
                  <FaCalendarCheck className="h-5 w-5 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-800">
                    {analyticsData?.totals.bookings}
                  </div>
                  <p className="text-xs text-emerald-500 mt-1">
                    Accepted or completed events
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-purple-100 bg-purple-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-600">
                    Avg. Booking Value
                  </CardTitle>
                  <FaDollarSign className="h-5 w-5 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-800">
                    Rs. {analyticsData?.totals.avgValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-purple-500 mt-1">
                    Per completed booking
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart Controls */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Performance Trends</h3>
              <div className="flex gap-2">
                <Button 
                  variant={chartType === 'bar' ? 'default' : 'outline'} 
                  onClick={() => setChartType('bar')}
                  className="gap-2"
                >
                  <FaChartBar /> Bar
                </Button>
                <Button 
                  variant={chartType === 'line' ? 'default' : 'outline'} 
                  onClick={() => setChartType('line')}
                  className="gap-2"
                >
                  <FaChartArea /> Line
                </Button>
              </div>
            </div>

            {/* Charts */}
            <Tabs defaultValue="revenue" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="revenue" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  Revenue Analysis
                </TabsTrigger>
                <TabsTrigger value="bookings" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Booking Volume
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="revenue" className="mt-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-96">
                  {chartType === 'bar' ? (
                    <Bar data={revenueChartData} options={chartOptions} />
                  ) : (
                    <Line data={revenueChartData} options={chartOptions} />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="bookings" className="mt-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-96">
                  {chartType === 'bar' ? (
                    <Bar data={bookingsChartData} options={chartOptions} />
                  ) : (
                    <Line data={bookingsChartData} options={chartOptions} />
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Data Period Info */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Showing data for the past 12 months and next 12 months</p>
              <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BookingAnalytics;