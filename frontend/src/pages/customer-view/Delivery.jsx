import { useState, useEffect, useRef } from "react";
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
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const userData = Cookies.get('user');
  const user = userData ? JSON.parse(userData) : null;
  const userEmails = user && user.user ? user.user.email : null;

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
        parseFloat(location.lat),
        parseFloat(location.lng)
      );
      console.log(dist);
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
          const addressText = data.address?.county || data.address?.state || "";
          setDistrict(addressText);
        })
        .catch((err) => console.error("Reverse geocode error:", err));
    }
  }, [location]);

  useEffect(() => {
    if (searchQuery.length > 3) {
      const delay = setTimeout(() => {
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`
        )
          .then((res) => res.json())
          .then((data) => setSearchResults(data))
          .catch((err) => console.log("Search error", err));
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [searchQuery]);

  const ClickToSetMarker = () => {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
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
      return toast.warn("⚠️ Please select a delivery method.", {
        position: "top-right",
      });
    }

    if (selectedType === "Online Delivery") {
      if (!location) {
        return toast.error("📍 Location is required for online delivery.", {
          position: "top-right",
        });
      }
      if (!address.trim()) {
        return toast.error("🏠 Extra Address Info is required.", {
          position: "top-right",
        });
      }
    }

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
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Order saved!");
        setTimeout(() => navigate("/client/products"), 5000);
      })
      .catch((err) => {
        console.error(err);
        toast.error("❌ Failed to save order.");
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">🚚 Select Delivery Method</h2>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="deliveryType"
            value="Normal Delivery"
            checked={selectedType === "Normal Delivery"}
            onChange={() => setSelectedType("Normal Delivery")}
            className="h-4 w-4"
          />
          Normal Delivery (Pickup from Store)
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="deliveryType"
            value="Online Delivery"
            checked={selectedType === "Online Delivery"}
            onChange={() => setSelectedType("Online Delivery")}
            className="h-4 w-4"
          />
          Door Delivery (Delivered to your location)
        </label>
      </div>

      {selectedType === "Online Delivery" && (
        <>
          <input
            type="text"
            className="w-full border mt-4 p-2 rounded"
            placeholder="🔍 Search location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchResults.length > 0 && (
            <ul className="border rounded bg-white mt-1 max-h-40 overflow-y-auto shadow-sm">
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    const lat = parseFloat(result.lat);
                    const lng = parseFloat(result.lon);
                    setLocation({ lat, lng });
                    setSearchQuery(result.display_name);
                    setSearchResults([]);
                  }}
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}

          <textarea
            placeholder="🏠 Extra Address Info (floor, apartment)"
            className="w-full mt-4 p-2 border rounded-md"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="mt-4 rounded-md overflow-hidden border">
            <MapContainer
              center={SHOP_LOCATION}
              zoom={13}
              scrollWheelZoom={true}
              ref={mapRef}
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

          {formattedAddress && (
            <p className="text-sm text-gray-600 mt-2">
              📌 <strong>Detected:</strong> {formattedAddress}
            </p>
          )}

          {deliveryFee !== null && (
            <p className="mt-2 text-base font-medium text-green-700">
              🚚 <strong>Delivery Fee:</strong> Rs. {deliveryFee}
            </p>
          )}

          <p className="mt-4 text-sm text-gray-700 bg-gray-50 p-3 border rounded">
            📢 <strong>Note:</strong> Once you confirm your order, a confirmation email will be sent. Your product will be delivered within <strong>3 to 5 days</strong> from today.
          </p>
        </>
      )}

      <div className="flex justify-center items-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default DeliveryMethodPage;
