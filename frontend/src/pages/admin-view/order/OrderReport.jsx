import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  format,
  parseISO,
  getYear,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell,
  ReferenceLine,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "./NavBar";
import autoTable from "jspdf-autotable";
import TextToSpeechButton from "./TextToSpeechButton";

// Custom Components
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const LightningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
      clipRule="evenodd"
    />
  </svg>
);

const ExclamationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const AnalysisResults = React.forwardRef(({ analysis, summary }, ref) => {
  if (!analysis) return null;

  const convertedAnalysis = analysis.replace(/\$\s*(\d+)/g, "Rs $1");
  const sections = convertedAnalysis
    .split("\n\n")
    .filter((section) => section.trim());

  return (
    <div
      ref={ref}
      className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-lg transition-all duration-300 transform hover:scale-[1.005]"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-blue-800">AI Analysis Report</h2>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => {
          const [heading, ...content] = section.split("\n");
          const isHeading = (text) =>
            text.endsWith(":**") || text.endsWith(":** ");

          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2 text-indigo-700 border-b pb-1">
                {heading}
              </h3>
              <div className="text-black">
                {content.map((line, i) => (
                  <p
                    key={i}
                    className={`mb-1 ${
                      isHeading(line.trim()) ? "font-medium text-gray-800" : ""
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="font-semibold text-lg mb-2 text-indigo-700">
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Total Products" value={summary.productCount} />
          <StatCard label="Units Sold" value={summary.totalQuantity} />
          <StatCard
            label="Total Revenue"
            value={`Rs ${summary.totalRevenue.toLocaleString()}`}
          />
        </div>
      </div>
    </div>
  );
});

const StatCard = React.memo(({ label, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
));

const SalesChart = React.forwardRef(({ data, view, onBarClick }, ref) => {
  const barColor = view === "quantity" ? "#4CAF50" : "#6366F1";

  const cleanedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        name: item.name.replace(/\(undefined\)/gi, ""),
      })),
    [data]
  );

  const handleClick = (data, index) => {
    if (onBarClick) {
      onBarClick(data, index);
    }
  };

  return (
    <div
      ref={ref}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        {view === "quantity" ? "Units Sold" : "Revenue"} by Product
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={cleanedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                view === "quantity" ? value : `Rs ${value}`
              }
            />
            <YAxis
              dataKey="name"
              type="category"
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [
                view === "quantity" ? `${value} units` : `Rs ${value}`,
                view === "quantity" ? "Quantity" : "Revenue",
              ]}
              contentStyle={{
                background: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                border: "none",
              }}
            />
            <Legend />
            <Bar
              dataKey={view}
              name={view === "quantity" ? "Quantity" : "Revenue"}
              radius={[0, 4, 4, 0]}
              onClick={handleClick}
            >
              {cleanedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColor} cursor="pointer" />
              ))}
              <LabelList
                dataKey={view}
                position="right"
                formatter={(value) =>
                  view === "quantity" ? value : `Rs ${value}`
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

const ProductTable = React.forwardRef(
  ({ data, selectedMonth, onRowClick }, ref) => {
    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <p className="text-gray-500">No data available for {selectedMonth}</p>
        </div>
      );
    }

    const totalQuantity = data.reduce((sum, p) => sum + p.quantity, 0);
    const totalRevenue = data.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
      <div
        ref={ref}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mt-7"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {selectedMonth} Product Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border-b border-gray-300">
                  Product
                </th>
                <th className="p-3 text-left border-b border-gray-300">Size</th>
                <th className="p-3 text-left border-b border-gray-300">
                  Quantity
                </th>
                <th className="p-3 text-left border-b border-gray-300">
                  Unit Price
                </th>
                <th className="p-3 text-left border-b border-gray-300">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 border-b border-gray-200 transition-colors cursor-pointer"
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.size}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">Rs {item.price.toFixed(2)}</td>
                  <td className="p-3 font-medium">
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="p-3 border-t border-gray-300" colSpan="2">
                  Totals
                </td>
                <td className="p-3 border-t border-gray-300">
                  {totalQuantity}
                </td>
                <td className="p-3 border-t border-gray-300"></td>
                <td className="p-3 border-t border-gray-300">
                  Rs {totalRevenue.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
);

const DailySalesChart = React.forwardRef(
  ({ data, productName, size, onClearSelection }, ref) => {
    // Process data to include week information
    const chartData = useMemo(() => {
      if (!data || data.length === 0) return [];

      return data.map((item) => ({
        ...item,
        dayName: item.dayName || format(new Date(item.date), "EEE"),
        fullDayName: item.fullDayName || format(new Date(item.date), "EEEE"),
        weekNumber: `Week ${
          item.week || Math.ceil(new Date(item.date).getDate() / 7)
        }`,
      }));
    }, [data]);

    // Calculate statistics
    const totalSales = chartData.reduce(
      (sum, day) => sum + (day.sales || 0),
      0
    );
    const averageSales = chartData.length ? totalSales / chartData.length : 0;
    const bestDay = chartData.reduce(
      (max, day) => (day.sales > max.sales ? day : max),
      { sales: 0, fullDayName: "N/A" }
    );

    if (chartData.length === 0) {
      return (
        <div ref={ref} className="bg-white p-4 rounded-lg border shadow">
          <p>No sales data available</p>
        </div>
      );
    }

    return (
      <div ref={ref} className="bg-white p-4 rounded-lg border shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold">
              {productName} ({size}) - Daily Sales (Quantity)
            </h3>
            <p className="text-sm text-gray-600">{totalSales} total units</p>
          </div>
          <button
            onClick={onClearSelection}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            X
          </button>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 30, left: 20, bottom: 60 }}
              barCategoryGap={5}
            >
              <CartesianGrid strokeDasharray="3 3" />

              {/* Week labels on top */}
              <XAxis
                dataKey="weekNumber"
                xAxisId="week"
                orientation="top"
                height={20}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              {/* Day labels on bottom */}
              <XAxis 
                dataKey="dayName" 
                axisLine={false} 
                tickLine={false}
                interval={0}
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={40}
              />

              <YAxis
                label={{ value: "Units", angle: -90, position: "insideLeft" }}
              />

              <Tooltip
                formatter={(value) => [`${value} units`, "Quantity"]}
                labelFormatter={(day) =>
                  chartData.find((d) => d.dayName === day)?.fullDayName || day
                }
              />

              <Bar
                dataKey="sales"
                name="Daily Sales"
                fill="#22c55e"
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["Sat", "Sun"].includes(entry.dayName)
                        ? "#16a34a" // Darker green for weekends
                        : "#22c55e" // Standard green for weekdays
                    }
                  />
                ))}
                
                {/* Quantity labels above bars (excluding zero values) */}
                <LabelList 
                  dataKey="sales" 
                  position="top" 
                  formatter={(value) => value > 0 ? value : null}
                  fill="#000"
                  fontSize={10}
                  offset={5}
                />
              </Bar>

              <ReferenceLine
                y={averageSales}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: `Avg: ${averageSales.toFixed(1)}`,
                  position: "right",
                  fill: "#ef4444",
                  fontSize: 10,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-blue-800 font-medium">Total Sold</div>
            <div className="font-bold">{totalSales} units</div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-purple-800 font-medium">Best Day</div>
            <div className="font-bold">{bestDay.fullDayName}</div>
          </div>
        </div>
      </div>
    );
  }
);

const MonthlyProductReport = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [view, setView] = useState("quantity");
  const [analysis, setAnalysis] = useState(null);
  const [summary, setSummary] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingRequests, setRemainingRequests] = useState(30);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPDFOptions, setShowPDFOptions] = useState(false);
  const analysisCache = useRef({});
  const pdfOptionsRef = useRef();

  // Refs for PDF generation and text-to-speech
  const analysisRef = useRef(null);
  const chartRef = useRef(null);
  const dailySalesRef = useRef(null);
  const productTableRef = useRef(null);
  const reportContentRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/orders");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      //console.log(data); 
      const completedOrders = data.filter(
        (order) => order.status === "Completed"
      );
      setOrders(completedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load order data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const { groupedByYearMonth, availableYears } = useMemo(() => {
    const grouped = {};
    const years = new Set();

    orders.forEach((order) => {
      const date = parseISO(order.orderDate);
      const year = getYear(date);
      const monthYear = format(date, "MMMM yyyy");
      const monthOnly = format(date, "MMMM");
        const dayName = format(date, "EEEE");
        console.log(dayName);
      years.add(year);

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][monthYear])
        grouped[year][monthYear] = {
          monthName: monthOnly,
          items: [],
        };

      order.items.forEach((item) => {
        const existing = grouped[year][monthYear].items.find(
          (product) =>
            product.productName === item.productName &&
            product.size === item.size
        );

        if (existing) {
          existing.quantity += item.quantity;
        } else {
          grouped[year][monthYear].items.push({
            productName: item.productName,
            price: item.price,
            size: item.size,
            quantity: item.quantity,
            date: order.orderDate,
          });
        }
      });
    });

    return {
      groupedByYearMonth: grouped,
      availableYears: Array.from(years).sort((a, b) => b - a),
    };
  }, [orders]);

  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      const newestYear = availableYears[0];
      setSelectedYear(newestYear);

      const months = Object.keys(groupedByYearMonth[newestYear]);
      if (months.length > 0) {
        setSelectedMonth(months[0]);
      }
    }
  }, [groupedByYearMonth, availableYears, selectedYear]);

  const availableMonths = useMemo(() => {
    if (!selectedYear) return [];
    return Object.entries(groupedByYearMonth[selectedYear] || {})
      .map(([monthYear, data]) => ({
        key: monthYear,
        name: data.monthName,
      }))
      .sort((a, b) => {
        return new Date(b.key) - new Date(a.key);
      });
  }, [selectedYear, groupedByYearMonth]);

  const chartData = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];
    const monthData =
      groupedByYearMonth[selectedYear]?.[selectedMonth]?.items || [];
    if (!monthData) return [];

    return monthData.map((item) => ({
      name: `${item.productName} (${item.size})`,
      quantity: item.quantity,
      price: item.price * item.quantity,
      productName: item.productName,
      size: item.size,
    }));
  }, [selectedYear, selectedMonth, groupedByYearMonth]);

  useEffect(() => {
    if (!selectedProduct || !selectedMonth || !selectedYear) {
      setDailySalesData([]);
      return;
    }

    // 1. Filter orders for the selected month/year
    const monthOrders = orders.filter((order) => {
      const orderDate = parseISO(order.orderDate);
      return (
        order.status === "Completed" &&
        getYear(orderDate) === selectedYear &&
        format(orderDate, "MMMM yyyy") === selectedMonth
      );
    });

    // 2. Get date range for the month
    const monthStart =
      monthOrders.length > 0
        ? startOfMonth(parseISO(monthOrders[0].orderDate))
        : startOfMonth(
            new Date(
              selectedYear,
              new Date(selectedMonth + " 1, " + selectedYear).getMonth(),
              1
            )
          );
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // 3. Aggregate sales by day
    const dailySales = daysInMonth.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      let daySales = 0;

      monthOrders.forEach((order) => {
        if (format(parseISO(order.orderDate), "yyyy-MM-dd") === dayStr) {
          order.items.forEach((item) => {
            if (
              item.productName === selectedProduct.productName &&
              item.size === selectedProduct.size
            ) {
              daySales += item.quantity;
            }
          });
        }
      });

      return {
        date: dayStr,
        sales: daySales,
        dayName: format(day, "EEE"),
        fullDayName: format(day, "EEEE"),
      };
    });

    // 4. Calculate and verify total
    const calculatedTotal = dailySales.reduce((sum, day) => sum + day.sales, 0);
    console.log(
      `Calculated total for ${selectedProduct.productName}:`,
      calculatedTotal
    );

    setDailySalesData(dailySales);
  }, [selectedProduct, selectedMonth, selectedYear, orders]);

  useEffect(() => {
    setAnalysis(null);
    setSelectedProduct(null);
  }, [selectedYear, selectedMonth, view]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingRequests((prev) => Math.min(prev + 1, 30));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pdfOptionsRef.current &&
        !pdfOptionsRef.current.contains(event.target)
      ) {
        setShowPDFOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const analyzeData = useCallback(
    debounce(async () => {
      const now = Date.now();
      const cacheKey = `${selectedYear}-${selectedMonth}-${view}`;

      if (analysisCache.current[cacheKey]) {
        setAnalysis(analysisCache.current[cacheKey].analysis);
        setSummary(analysisCache.current[cacheKey].summary);
        return;
      }

      if (remainingRequests <= 0) {
        setError(
          `Rate limit exceeded (30 requests/minute). Try again in ${Math.ceil(
            (60000 - (now - lastRequestTime)) / 1000
          )} seconds.`
        );
        return;
      }

      setIsAnalyzing(true);
      setError(null);
      setRemainingRequests((prev) => prev - 1);
      setLastRequestTime(now);

      try {
        const response = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products:
              groupedByYearMonth[selectedYear]?.[selectedMonth]?.items || [],
            selectedMonth,
            view,
          }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setAnalysis(data.analysis);
        setSummary(data.summary);

        analysisCache.current[cacheKey] = {
          analysis: data.analysis,
          summary: data.summary,
        };
      } catch (err) {
        console.error("Analysis failed:", err);
        setError(
          err.message.includes("429")
            ? "Rate limit exceeded (30 requests/minute). Please wait."
            : err.message
        );
        setRemainingRequests((prev) => prev + 1);
      } finally {
        setIsAnalyzing(false);
      }
    }, 300),
    [
      selectedYear,
      selectedMonth,
      view,
      remainingRequests,
      lastRequestTime,
      groupedByYearMonth,
    ]
  );

  const handleBarClick = (data, index) => {
    setSelectedProduct({
      productName: data.productName,
      size: data.size,
    });
  };

  const handleRowClick = (item) => {
    setSelectedProduct({
      productName: item.productName,
      size: item.size,
    });
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF("p", "pt", "a4");
      const margin = 40;
      let position = margin;
      const pageHeight = doc.internal.pageSize.height;

      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text(`Monthly Product Report - ${selectedMonth}`, margin, position);
      position += 30;

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        margin,
        position
      );
      position += 40;

      const addSectionToPDF = async (element, title) => {
        if (!element) return position;

        const canvas = await html2canvas(element, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = doc.internal.pageSize.getWidth() - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (position + imgHeight > pageHeight - margin) {
          doc.addPage();
          position = margin;
        }

        doc.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        return position + imgHeight + 20;
      };

      position = await addSectionToPDF(analysisRef.current, "AI Analysis");
      position = await addSectionToPDF(chartRef.current, "Product Performance");

      if (selectedProduct && dailySalesRef.current) {
        position = await addSectionToPDF(dailySalesRef.current, "Daily Sales");
      }

      if (productTableRef.current) {
        await addSectionToPDF(productTableRef.current, "Product Details");
      }

      doc.save(`report-${selectedMonth.replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateDataPDF = useCallback(() => {
    try {
      const doc = new jsPDF();

      doc.setProperties({
        title: `Product Report - ${selectedMonth}`,
        subject: "Monthly Product Analysis",
        author: "Your App Name",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text(`Monthly Product Report - ${selectedMonth}`, 105, 20, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 30, {
        align: "center",
      });

      let yPos = 40;

      doc.setFontSize(14);
      doc.text("Product Performance", 14, yPos);
      yPos += 10;

      const performanceData = chartData.map((item) => [
        item.name.length > 25 ? `${item.name.substring(0, 22)}...` : item.name,
        view === "quantity" ? item.quantity : `Rs ${item.price.toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [
          ["Product", view === "quantity" ? "Units Sold" : "Revenue (Rs)"],
        ],
        body: performanceData,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: "auto", halign: "right" },
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      yPos = doc.lastAutoTable.finalY + 15;

      const monthData =
        groupedByYearMonth[selectedYear]?.[selectedMonth]?.items || [];
      if (monthData.length > 0) {
        doc.setFontSize(14);
        doc.text("Detailed Product Data", 14, yPos);
        yPos += 10;

        const productData = monthData.map((item) => [
          item.productName.length > 20
            ? `${item.productName.substring(0, 17)}...`
            : item.productName,
          item.size || "-",
          item.quantity,
          `Rs ${item.price.toFixed(2)}`,
          `Rs ${(item.price * item.quantity).toFixed(2)}`,
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [["Product", "Size", "Qty", "Unit Price", "Total"]],
          body: productData,
          styles: {
            fontSize: 8,
            cellPadding: 2,
            overflow: "linebreak",
          },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 30 },
            2: { cellWidth: 20, halign: "right" },
            3: { cellWidth: 30, halign: "right" },
            4: { cellWidth: 30, halign: "right" },
          },
          headStyles: {
            fillColor: [128, 0, 128],
            textColor: 255,
            fontStyle: "bold",
          },
        });
      }

      doc.save(`product-report-${selectedMonth.replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  }, [chartData, groupedByYearMonth, selectedMonth, selectedYear, view]);

  if (isLoading) {
    return (
      <div className="relative max-w-7xl mx-auto p-6 min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900">
        {/* Background with built-in pulse animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300/30 via-purple-300/30 to-pink-300/30 animate-pulse opacity-30 blur-2xl z-0" />

        {/* Foreground content */}
        <div className="relative text-center z-10 space-y-6">
          {/* Spinner using built-in spin animation */}
          <div className="relative inline-flex justify-center items-center">
            <div className="w-16 h-16 rounded-full border-4 border-blue-200/50 dark:border-gray-700/50" />
            <div className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin" />
            <div className="absolute w-20 h-20 rounded-full border-2 border-blue-400/20 dark:border-gray-600/20 animate-ping" />
          </div>

          {/* Text with animated dots using delay utilities */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Loading order data
              <span className="inline-flex ml-1">
                <span className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards_0.3s]">
                  .
                </span>
                <span className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards_0.6s]">
                  .
                </span>
                <span className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards_0.9s]">
                  .
                </span>
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Please wait while we process your request
            </p>
          </div>

          {/* Progress bar using built-in pulse animation */}
          <div className="w-48 mx-auto h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-full animate-pulse duration-2000" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationIcon />
            <h3 className="font-bold">Error Loading Data</h3>
          </div>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Navbar />
      <div className="flex justify-center gap-4 mb-6 mt-4">
        <button
          onClick={() => navigate("/admin/OrderReport")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Monthly Report
        </button>
        <button
          onClick={() => navigate("/admin/compareOrderReport")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Compare Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Monthly Product Analytics
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Analyze your product sales performance by month
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedYear}
            >
              {availableMonths.map((month) => (
                <option key={month.key} value={month.key}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setView("quantity")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              view === "quantity"
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>Quantity View</span>
          </button>

          <div className="relative" ref={pdfOptionsRef}>
            <button
              onClick={() => setShowPDFOptions(!showPDFOptions)}
              disabled={isGeneratingPDF}
              className={`flex items-center gap-2 px-6 py-3 ${
                isGeneratingPDF
                  ? "bg-gray-400"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white rounded-lg transition-all shadow-md hover:shadow-lg`}
            >
              {isGeneratingPDF ? (
                <>
                  <Spinner />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download PDF
                </>
              )}
            </button>

            {showPDFOptions && !isGeneratingPDF && (
              <div className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => {
                      generatePDF();
                      setShowPDFOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Full Report (Visual)
                  </button>
                  <button
                    onClick={() => {
                      generateDataPDF();
                      setShowPDFOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Data-Only Report
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setView("price")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              view === "price"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>Revenue View</span>
          </button>

          <button
            onClick={analyzeData}
            disabled={isAnalyzing || remainingRequests <= 0 || !selectedMonth}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isAnalyzing ? (
              <>
                <Spinner />
                <span className="ml-2">Analyzing...</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <LightningIcon />
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    AI
                  </span>
                </div>
                <span className="ml-2">Get AI Insights</span>
                <span className="ml-2 text-xs bg-white text-blue-600 px-2 py-1 rounded-full">
                  {remainingRequests}/30
                </span>
              </>
            )}
          </button>
          {/* Text-to-Speech Button - Placed at the bottom */}
          {analysis && (
            <div className="mt-4 flex justify-center">
              <TextToSpeechButton contentRef={reportContentRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ExclamationIcon />
              <h3 className="font-bold">Please Note</h3>
            </div>
            <p>{error}</p>
          </div>
        )}
      </div>

      <div ref={reportContentRef}>
        <AnalysisResults
          ref={analysisRef}
          analysis={analysis}
          summary={summary}
        />
        <SalesChart
          ref={chartRef}
          data={chartData}
          view={view}
          onBarClick={handleBarClick}
        />

        {selectedProduct && (
          <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
            <DailySalesChart
              ref={chartRef} 
              data={dailySalesData}
              productName={selectedProduct.productName}
              size={selectedProduct.size}
              onClearSelection={handleClearSelection}
            />
          </div>
        )}

        {selectedMonth && (
          <ProductTable
            ref={productTableRef}
            data={
              groupedByYearMonth[selectedYear]?.[selectedMonth]?.items || []
            }
            selectedMonth={selectedMonth}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </div>
  ); 
};

export default MonthlyProductReport; 
