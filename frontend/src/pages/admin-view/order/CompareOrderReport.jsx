import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart,
  LineChart,
  AreaChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  FiArrowLeft, 
  FiAlertTriangle, 
  FiTrendingUp, 
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiCalendar,
  FiPieChart
} from 'react-icons/fi';

export default function CompareOrderReport() {
  // State declarations
  const navigate = useNavigate();
  const [compareMode, setCompareMode] = useState(null);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [showForm, setShowForm] = useState(true);
  const [dataType, setDataType] = useState('quantity');
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearsData, setYearsData] = useState({});
  const [aiInsights, setAiInsights] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [summaryReport, setSummaryReport] = useState(null);

  // Constants
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const availableYears = Object.keys(yearsData).sort((a, b) => b - a);

  // Event handlers
  const handleCompareModeSelect = (mode) => {
    setCompareMode(mode);
    setSelectedYears([]);
    setSelectedMonths([]);
    setShowForm(true);
  };

  const handleYearSelect = (year) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year) 
        : [...prev, year]
    );
  };

  const handleMonthSelect = (month) => {
    setSelectedMonths(prev =>
      prev.includes(month)
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
  };

  const resetComparison = () => {
    setCompareMode(null);
    setSelectedYears([]);
    setSelectedMonths([]);
    setShowForm(true);
  };

  // Data processing functions
  const processOrdersData = (orders) => {
    const processedData = {};
    
    orders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const year = orderDate.getFullYear();
      const month = months[orderDate.getMonth()];

      if (!processedData[year]) {
        processedData[year] = months.reduce((acc, m) => {
          acc[m] = { quantity: 0, price: 0 };
          return acc;
        }, {});
      }

      const orderQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
      const orderPrice = order.items.reduce((sum, item) => sum + item.total, 0);

      processedData[year][month].quantity += orderQuantity;
      processedData[year][month].price += orderPrice;
    });

    setYearsData(processedData);
  };

  const generateSummaryReport = (orders) => {
    const report = {
      totalOrders: orders.length,
      totalItems: orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0), 0),
      totalRevenue: orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + item.total, 0), 0),
      popularProducts: {},
      monthlyTrends: {}
    };

    report.averageOrderValue = report.totalRevenue / report.totalOrders;

    orders.forEach(order => {
      order.items.forEach(item => {
        report.popularProducts[item.productName] = 
          (report.popularProducts[item.productName] || 0) + item.quantity;
      });
    });

    report.popularProducts = Object.entries(report.popularProducts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    report.monthlyTrends = {
      currentMonth: {
        name: new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }),
        revenue: orders
          .filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate.getFullYear() === currentYear && 
                   orderDate.getMonth() === currentMonth;
          })
          .reduce((sum, order) => sum + order.items.reduce((s, item) => s + item.total, 0), 0)
      },
      previousMonth: {
        name: new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' }),
        revenue: orders
          .filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate.getFullYear() === currentYear && 
                   orderDate.getMonth() === currentMonth - 1;
          })
          .reduce((sum, order) => sum + order.items.reduce((s, item) => s + item.total, 0), 0)
      }
    };

    setSummaryReport(report);
  };

  const generateInsights = () => {
    setProcessing(true);
    
    setTimeout(() => {
      const insights = [];
      
      if (availableYears.length >= 2) {
        const currentYear = availableYears[0];
        const prevYear = availableYears[1];
        const currentTotal = Object.values(yearsData[currentYear]).reduce((sum, month) => sum + month[dataType], 0);
        const prevTotal = Object.values(yearsData[prevYear]).reduce((sum, month) => sum + month[dataType], 0);
        const change = ((currentTotal - prevTotal) / prevTotal * 100).toFixed(1);
        
        if (Math.abs(change) > 5) {
          insights.push({
            type: change >= 0 ? 'positive' : 'negative',
            icon: change >= 0 ? <FiTrendingUp className="text-green-500" /> : <FiTrendingDown className="text-red-500" />,
            text: `Year-over-year ${dataType} ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(change)}% (${currentYear} vs ${prevYear})`
          });
        }
      }

      if (compareMode === 'months-same-year' && selectedYears.length === 1) {
        const year = selectedYears[0];
        const monthsData = Object.entries(yearsData[year])
          .map(([month, data]) => ({ month, value: data[dataType] }))
          .sort((a, b) => b.value - a.value);
        
        if (monthsData.length > 0 && monthsData[0].value > 0) {
          insights.push({
            type: 'positive',
            icon: <FiTrendingUp className="text-green-500" />,
            text: `Best month for ${dataType} in ${year}: ${monthsData[0].month} (${monthsData[0].value})`
          });
        }
      }

      if (compareMode === 'years' && selectedYears.length >= 2) {
        const seasonalPatterns = months.map(month => {
          const avg = selectedYears.reduce((sum, year) => sum + (yearsData[year]?.[month]?.[dataType] || 0), 0) / selectedYears.length;
          return { month, avg };
        });

        const peakMonth = [...seasonalPatterns].sort((a, b) => b.avg - a.avg)[0];
        const lowMonth = [...seasonalPatterns].sort((a, b) => a.avg - b.avg)[0];

        if (peakMonth.avg > 0 && (peakMonth.avg - lowMonth.avg) / peakMonth.avg > 0.3) {
          insights.push({
            type: 'info',
            icon: <FiAlertTriangle className="text-yellow-500" />,
            text: `Seasonal trend: ${peakMonth.month} is typically the strongest month (avg ${Math.round(peakMonth.avg)})`
          });
        }
      }

      setAiInsights(insights);
      setProcessing(false);
    }, 1500);
  };

  // Effects
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/orders');
        const completedOrders = response.data.filter(order => order.status === 'Completed');
        setOrdersData(completedOrders);
        processOrdersData(completedOrders);
        generateSummaryReport(completedOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (Object.keys(yearsData).length > 0) {
      generateInsights();
    }
  }, [yearsData, compareMode, selectedYears, selectedMonths, dataType]);

  // Render functions
  const renderComparisonForm = () => {
    if (!compareMode || !showForm) return null;

    return (
      <div className="max-w-2xl mx-auto my-6 p-6 bg-gray-50 rounded-lg shadow-sm">
        <button
          onClick={resetComparison}
          className="flex items-center text-blue-600 mb-4"
        >
          <FiArrowLeft className="mr-1" /> Back to Comparison Options
        </button>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setDataType('quantity')}
            className={`px-4 py-2 rounded-lg ${dataType === 'quantity' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Compare Quantity
          </button>
          <button
            onClick={() => setDataType('price')}
            className={`px-4 py-2 rounded-lg ${dataType === 'price' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Compare Price
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {compareMode === 'years' && (
            <>
              <h3 className="text-lg font-semibold mb-4">Compare Years</h3>
              <div className="mb-4">
                <label className="block mb-2">Select years to compare (select 2 or more):</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableYears.map(year => (
                    <label key={year} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedYears.includes(year)}
                        onChange={() => handleYearSelect(year)}
                        className="mr-2"
                      />
                      {year}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {compareMode === 'months-same-year' && (
            <>
              <h3 className="text-lg font-semibold mb-4">Compare Months Within Same Year</h3>
              <div className="mb-4">
                <label className="block mb-2">Select year:</label>
                <select 
                  value={selectedYears[0] || ''}
                  onChange={(e) => setSelectedYears([e.target.value])}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Year</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Select months to compare (select 2 or more):</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {months.map(month => (
                    <label key={month} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={() => handleMonthSelect(month)}
                        className="mr-2"
                      />
                      {month}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {compareMode === 'months-cross-year' && (
            <>
              <h3 className="text-lg font-semibold mb-4">Compare Months Across Years</h3>
              <div className="mb-4">
                <label className="block mb-2">Select months to compare:</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {months.map(month => (
                    <label key={month} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={() => handleMonthSelect(month)}
                        className="mr-2"
                      />
                      {month}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Select years to compare (select 2 or more):</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableYears.map(year => (
                    <label key={year} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedYears.includes(year)}
                        onChange={() => handleYearSelect(year)}
                        className="mr-2"
                      />
                      {year}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={
                (compareMode === 'years' && selectedYears.length < 2) ||
                (compareMode === 'months-same-year' && (!selectedYears[0] || selectedMonths.length < 2)) ||
                (compareMode === 'months-cross-year' && (selectedYears.length < 2 || selectedMonths.length < 1))
              }
              className="flex-1 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              Generate Comparison
            </button>
            <button
              type="button"
              onClick={resetComparison}
              className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderAIInsights = () => {
    if (processing) return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Analyzing data patterns...</p>
      </div>
    );

    if (aiInsights.length === 0) return null;

    return (
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI-Powered Insights
        </h3>
        <div className="space-y-3">
          {aiInsights.map((insight, index) => (
            <div key={index} className={`p-3 rounded-md flex items-start ${
              insight.type === 'positive' ? 'bg-green-50' : 
              insight.type === 'negative' ? 'bg-red-50' : 'bg-yellow-50'
            }`}>
              <div className="mr-3 mt-1">
                {insight.icon}
              </div>
              <p className="text-sm">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSummaryReport = () => {
    if (!summaryReport || loading) return null;

    const monthChange = summaryReport.monthlyTrends.currentMonth.revenue - 
                      summaryReport.monthlyTrends.previousMonth.revenue;
    const monthChangePercent = (monthChange / summaryReport.monthlyTrends.previousMonth.revenue * 100).toFixed(1);

    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FiPieChart className="mr-2 text-blue-500" />
          Summary Report
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FiShoppingCart className="text-blue-500 mr-2" />
              <h4 className="font-medium">Total Orders</h4>
            </div>
            <p className="text-2xl font-bold">{summaryReport.totalOrders}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FiDollarSign className="text-green-500 mr-2" />
              <h4 className="font-medium">Total Revenue</h4>
            </div>
            <p className="text-2xl font-bold">Rs. {summaryReport.totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FiDollarSign className="text-purple-500 mr-2" />
              <h4 className="font-medium">Avg. Order Value</h4>
            </div>
            <p className="text-2xl font-bold">Rs. {Math.round(summaryReport.averageOrderValue).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-3 flex items-center">
              <FiCalendar className="mr-2 text-yellow-500" />
              Monthly Trend
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{summaryReport.monthlyTrends.currentMonth.name}</span>
                <span className="font-medium">Rs. {summaryReport.monthlyTrends.currentMonth.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{summaryReport.monthlyTrends.previousMonth.name}</span>
                <span className="font-medium">Rs. {summaryReport.monthlyTrends.previousMonth.revenue.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between mt-2 ${monthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <span>Change</span>
                <span className="font-medium">
                  {monthChange >= 0 ? '+' : ''}{monthChangePercent}%
                  {monthChange >= 0 ? <FiTrendingUp className="inline ml-1" /> : <FiTrendingDown className="inline ml-1" />}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-3 flex items-center">
              <FiShoppingCart className="mr-2 text-blue-500" />
              Top Products
            </h4>
            <div className="space-y-2">
              {summaryReport.popularProducts.map(([product, quantity], index) => (
                <div key={index} className="flex justify-between">
                  <span>{product}</span>
                  <span className="font-medium">{quantity} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    if (!compareMode || showForm || loading) return null;

    let chartData = [];
    let chartTitle = '';
    let xAxisKey = 'name';

    if (compareMode === 'years') {
      chartTitle = `Monthly ${dataType === 'quantity' ? 'Quantity' : 'Price'} Comparison: ${selectedYears.join(' vs ')}`;
      xAxisKey = 'month';
      
      months.forEach(month => {
        const monthData = { month };
        selectedYears.forEach(year => {
          monthData[year] = yearsData[year]?.[month]?.[dataType] || 0;
        });
        chartData.push(monthData);
      });
    } 
    else if (compareMode === 'months-same-year') {
      const year = selectedYears[0];
      chartTitle = `Monthly ${dataType === 'quantity' ? 'Quantity' : 'Price'} Comparison for ${year}: ${selectedMonths.join(' vs ')}`;
      xAxisKey = 'month';
      
      selectedMonths.forEach(month => {
        chartData.push({
          month,
          value: yearsData[year]?.[month]?.[dataType] || 0
        });
      });
    }
    else if (compareMode === 'months-cross-year') {
      chartTitle = `${selectedMonths.join(' & ')} ${dataType === 'quantity' ? 'Quantity' : 'Price'} Comparison Across Years: ${selectedYears.join(' vs ')}`;
      xAxisKey = 'year';
      
      selectedYears.forEach(year => {
        const yearData = { year };
        selectedMonths.forEach(month => {
          yearData[month] = yearsData[year]?.[month]?.[dataType] || 0;
        });
        chartData.push(yearData);
      });
    }

    const ChartComponent = chartType === 'bar' ? BarChart : chartType === 'line' ? LineChart : AreaChart;
    const DataComponent = chartType === 'bar' ? Bar : chartType === 'line' ? Line : Area;

    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center text-blue-600"
          >
            <FiArrowLeft className="mr-1" /> Back to Selection
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setDataType(dataType === 'quantity' ? 'price' : 'quantity')}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Show {dataType === 'quantity' ? 'Price' : 'Quantity'}
            </button>
            <button
              onClick={() => setChartType(chartType === 'bar' ? 'line' : chartType === 'line' ? 'area' : 'bar')}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Switch to {chartType === 'bar' ? 'Line' : chartType === 'line' ? 'Area' : 'Bar'} Chart
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6 bg-blue-50 p-4 rounded-lg">
          {chartTitle}
        </h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {compareMode === 'years' ? (
                selectedYears.map(year => (
                  <DataComponent
                    key={year}
                    dataKey={year}
                    name={year}
                    fill={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                    stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                  />
                ))
              ) : compareMode === 'months-same-year' ? (
                <DataComponent
                  dataKey="value"
                  name={selectedYears[0]}
                  fill={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                  stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                />
              ) : (
                selectedMonths.map(month => (
                  <DataComponent
                    key={month}
                    dataKey={month}
                    name={month}
                    fill={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                    stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                  />
                ))
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>

        {renderAIInsights()}
      </div>
    );
  };

  // Main component render
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-center gap-4 mb-6 mt-4">
        <button
          onClick={() => navigate('/admin/OrderReport')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Monthly Report
        </button>
        <button
          onClick={() => navigate('/admin/compareOrderReport')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Compare Report
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        {!compareMode && (
          <>
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Compare Order Reports
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div 
                onClick={() => handleCompareModeSelect('years')}
                className="p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-center"
              >
                <h3 className="text-lg font-semibold mb-2">Compare Years</h3>
                <p className="text-gray-600">Compare performance across multiple years</p>
              </div>
              <div 
                onClick={() => handleCompareModeSelect('months-same-year')}
                className="p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-center"
              >
                <h3 className="text-lg font-semibold mb-2">Compare Months (Same Year)</h3>
                <p className="text-gray-600">Compare different months within one year</p>
              </div>
              <div 
                onClick={() => handleCompareModeSelect('months-cross-year')}
                className="p-6 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors text-center"
              >
                <h3 className="text-lg font-semibold mb-2">Compare Months (Cross Year)</h3>
                <p className="text-gray-600">Compare months across different years</p>
              </div>
            </div>
          </>
        )}

        {renderComparisonForm()}
        {renderChart()}
        {renderSummaryReport()}
      </div>
    </div>
  );
}