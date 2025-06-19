import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";
import { FiCheck, FiTruck, FiHome, FiMapPin, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";
import CirclerFill from "./order/CirclerFill";
import Confetti from "react-confetti"; // Import Confetti

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Northern Province boundaries (approximate)
const NORTHERN_BOUNDS = {
  north: 9.8,
  south: 8.5,
  west: 79.5,
  east: 81.0,
};

const SHOP_LOCATION = {
  lat: 9.6838372,
  lng: 80.0145296,
};

function DeliveryMethodPage() {
  const [selectedType, setSelectedType] = useState("");
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [district, setDistrict] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti
  const [windowSize, setWindowSize] = useState({
    // State for window size
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const userData = Cookies.get("user");
  const user = userData ? JSON.parse(userData) : null;
  const userEmails = user && user.user ? user.user.email : null;

  const isInNorthernProvince = (lat, lng) => {
    return (
      lat >= NORTHERN_BOUNDS.south &&
      lat <= NORTHERN_BOUNDS.north &&
      lng >= NORTHERN_BOUNDS.west &&
      lng <= NORTHERN_BOUNDS.east
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (location) {
      const dist = calculateDistance(
        SHOP_LOCATION.lat,
        SHOP_LOCATION.lng,
        location.lat,
        location.lng
      );
      setDeliveryFee(dist > 2 ? Math.round((dist - 2) * 60) : 0);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          setFormattedAddress(data.display_name);
          setDistrict(data.address?.county || data.address?.state || "");
        })
        .catch((err) => console.error("Reverse geocode error:", err));
    } 
  }, [location]);

  useEffect(() => {
    if (searchQuery.length > 3) {
      const delay = setTimeout(() => {
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&bounded=1&viewbox=${NORTHERN_BOUNDS.west},${NORTHERN_BOUNDS.north},${NORTHERN_BOUNDS.east},${NORTHERN_BOUNDS.south}`
        )
          .then((res) => res.json())
          .then((data) => {
            const filteredResults = data.filter((result) =>
              isInNorthernProvince(
                parseFloat(result.lat),
                parseFloat(result.lon)
              )
            );
            setSearchResults(filteredResults);
          })
          .catch((err) => console.log("Search error", err));
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [searchQuery]);

  const ClickToSetMarker = () => {
    useMapEvents({
      click(e) {
        if (isInNorthernProvince(e.latlng.lat, e.latlng.lng)) {
          setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        } else {
          toast.error(
            "Please select a location within Northern Province of Sri Lanka"
          );
        }
      },
    });
    return null;
  };

  const CenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], 15);
    }, [lat, lng, map]);
    return null;
  };

  const handleSubmit = () => {
    if (!selectedType) {
      return toast.warn("Please select a delivery method");
    }

    if (selectedType === "Online Delivery") {
      if (!location) {
        return toast.error("Location is required for online delivery");
      }
      if (!isInNorthernProvince(location.lat, location.lng)) {
        return toast.error("We only deliver to Northern Province");
      }
      if (!address.trim()) {
        return toast.error("Extra Address Info is required");
      }
    }

    setIsSubmitting(true);

    fetch("http://localhost:5000/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userEmails,
        deliveryType: selectedType,
        location,
        address,
        formattedAddress,
        deliveryFee,
        district,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(() => {
        toast.success("Order confirmed! Redirecting...");
        setShowConfetti(true); // Show confetti on success
        setTimeout(() => {
          setShowConfetti(false); // Hide confetti after a delay
          navigate("/client/products");
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to save order. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen p-6">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      {/* Progress stepper */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <CirclerFill />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Delivery Method</h1>
            <p className="text-indigo-100 mt-1">
              Choose how you want to receive your order
            </p>
          </div>

          {/* Main content */}
          <div className="p-6 md:p-8">
            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="deliveryType"
                  value="Normal Delivery"
                  checked={selectedType === "Normal Delivery"}
                  onChange={() => setSelectedType("Normal Delivery")}
                  className="h-5 w-5 text-indigo-600"
                />
                <div>
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <FiHome className="mr-2 text-indigo-600" />
                    Store Pickup
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Collect your order from our store location
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="deliveryType"
                  value="Online Delivery"
                  checked={selectedType === "Online Delivery"}
                  onChange={() => setSelectedType("Online Delivery")}
                  className="h-5 w-5 text-indigo-600"
                />
                <div>
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <FiTruck className="mr-2 text-indigo-600" />
                    Door Delivery
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll deliver to your location (Northern Province only)
                  </p>
                </div>
              </label>
            </div>

            {selectedType === "Online Delivery" && (
              <>
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-gray-700  items-center">
                    <FiMapPin className="mr-2 text-indigo-600" />
                    Delivery Location
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Search location in Northern Province"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  {searchResults.length > 0 && (
                    <ul className="mt-2 border border-gray-200 rounded-lg bg-white shadow-sm max-h-48 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <li
                          key={index}
                          className="p-3 cursor-pointer hover:bg-indigo-50 transition"
                          onClick={() => {
                            setLocation({
                              lat: parseFloat(result.lat),
                              lng: parseFloat(result.lon),
                            });
                            setSearchQuery(result.display_name);
                            setSearchResults([]);
                          }}
                        >
                          {result.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium text-gray-700  items-center">
                    <FiHome className="mr-2 text-indigo-600" />
                    Additional Address Details
                  </label>
                  <textarea
                    placeholder="Floor, apartment number, or other details"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium text-gray-700  items-center">
                    <FiMapPin className="mr-2 text-indigo-600" />
                    Select Location on Map
                  </label>
                  <div className="rounded-lg overflow-hidden border border-gray-300">
                    <MapContainer
                      center={SHOP_LOCATION}
                      bounds={[
                        [NORTHERN_BOUNDS.south, NORTHERN_BOUNDS.west],
                        [NORTHERN_BOUNDS.north, NORTHERN_BOUNDS.east],
                      ]}
                      zoom={10}
                      minZoom={9}
                      maxBounds={[
                        [NORTHERN_BOUNDS.south, NORTHERN_BOUNDS.west],
                        [NORTHERN_BOUNDS.north, NORTHERN_BOUNDS.east],
                      ]}
                      scrollWheelZoom={true}
                      style={{ height: "300px", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                      />
                      <ClickToSetMarker />
                      {location && (
                        <>
                          <Marker position={[location.lat, location.lng]} />
                          <CenterMap lat={location.lat} lng={location.lng} />
                        </>
                      )}
                    </MapContainer>
                  </div>
                </div>

                {formattedAddress && (
                  <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Detected Address:</span>{" "}
                      {formattedAddress}
                    </p>
                  </div>
                )}

                {deliveryFee !== null && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-green-700 font-medium">
                      Estimated Delivery Fee: Rs. {deliveryFee}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm text-amber-700 flex items-start">
                    <FiInfo className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      We currently only deliver to Northern Province. Your
                      product will be delivered within{" "}
                      <strong>3 to 5 days</strong>.
                    </span>
                  </p>
                </div>
              </>
            )}

            <div className="mt-8">
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white shadow-md transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    <span>Confirm Delivery Method</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DeliveryMethodPage;