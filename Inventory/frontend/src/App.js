import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineSearch } from "react-icons/ai";

const API_URL = "http://localhost:5000/items"; // API URL for your backend

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isAddItemVisible, setIsAddItemVisible] = useState(true);
  const [editItemData, setEditItemData] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [notifiedItems, setNotifiedItems] = useState(new Set()); // Track notified items
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [sortBy, setSortBy] = useState("name"); // Sort by state

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);

      // Check for items with current_quantity === 0 and show notifications
      data.forEach((item) => {
        if (item.current_quantity === 0 && !notifiedItems.has(item._id)) {
          toast.warning(`⚠️ ${item.name} is out of stock!`, {
            position: "top-left",
            autoClose: false, // Ensure this toast does not auto-close
            closeOnClick: false, // Optional: Disable closing on click
            draggable: true, // Allow dragging to dismiss
          });

          // Add the item ID to the notifiedItems set
          setNotifiedItems((prev) => new Set(prev).add(item._id));
        }
      });
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Error fetching items.");
    }
  };

  // Load items when the component is mounted
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form submission (add or update an item)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the input values
    if (!name || !isNaN(name)) {
      toast.error("Item name must be a valid string, not a number.");
      return;
    }

    if (parseFloat(price) <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    if (parseInt(currentQuantity) < 0) {
      toast.error("Current quantity must be 0 or greater.");
      return;
    }

    // Prepare item data to send to the backend
    const itemData = {
      name,
      price: parseFloat(price),
      current_quantity: parseInt(currentQuantity),
    };

    try {
      if (editingId) {
        // If we're editing an existing item, send a PUT request to update it
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });
        setEditingId(null); // Clear the editing state after saving
      } else {
        // If we're adding a new item, send a POST request
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });
      }

      // Reset form values after submission
      setName("");
      setPrice("");
      setCurrentQuantity("");
      fetchItems(); // Refresh the list of items

      toast.success("Item added/updated successfully");
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Error saving item.");
    }
  };

  // Handle delete item with confirmation
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchItems(); // Refresh the list after deletion
      toast.success("Item deleted successfully");
      setDeleteItemId(null); // Clear the popup after deletion
      setDeleteItemName(""); // Clear the item name after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item.");
    }
  };

  // Handle edit item (enable inline editing)
  const handleEdit = (item) => {
    setEditItemData(item); // Set the item data to be edited
    setEditingId(item._id); // Set the editing ID to track the item being edited
    setDeleteItemId(null); // Remove the delete popup if editing
  };

  // Handle save edited item
  const handleSaveEdit = async () => {
    // Validate the edited item data
    if (!editItemData.name || !isNaN(editItemData.name)) {
      toast.error("Item name must be a valid string, not a number.");
      return;
    }

    if (parseFloat(editItemData.price) <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    if (parseInt(editItemData.current_quantity) < 0) {
      toast.error("Current quantity must be 0 or greater.");
      return;
    }

    try {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editItemData),
      });
      setEditingId(null); // Clear the editing state after saving
      fetchItems(); // Refresh the list of items
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Error updating item.");
    }
  };

  // Handle input change for inline editing
  const handleInputChange = (e, field) => {
    setEditItemData({
      ...editItemData,
      [field]: e.target.value,
    });
  };

  // Toggle between the Add Item form and the Inventory List
  const toggleView = (view) => {
    // Only toggle if it's different from the current view
    if (view !== isAddItemVisible) {
      setIsAddItemVisible(view);
    }
  };

  // Open delete confirmation popup and set item ID and name
  const openDeleteConfirmation = (id, name) => {
    setDeleteItemId(id);
    setDeleteItemName(name);
  };

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort items based on the selected criteria
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "price") {
      return a.price - b.price;
    } else if (sortBy === "quantity") {
      return a.current_quantity - b.current_quantity;
    }
    return 0;
  });

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">Inventory</h1>

      {/* Toggle between Add Item form and Inventory List */}
      <div className="mb-6 space-x-4">
        <button
          onClick={() => toggleView(true)}
          className={`py-2 px-4 rounded-lg ${
            isAddItemVisible
              ? "bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-md"
              : "bg-gray-300 hover:bg-gray-400"
          } transition-all duration-300`}
        >
          Add Item
        </button>
        <button
          onClick={() => toggleView(false)}
          className={`py-2 px-4 rounded-lg ${
            !isAddItemVisible
              ? "bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-md"
              : "bg-gray-300 hover:bg-gray-400"
          } transition-all duration-300`}
        >
          Inventory List
        </button>
      </div>

      {/* Search Bar and Sort Button */}
      {!isAddItemVisible && (
        <div className="w-full max-w-4xl mb-6 flex space-x-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 border border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gradient-to-r from-[#93C5FD] via-[#D8B4FE] to-[#F9A8D4] hover:from-[#D8B4FE] hover:to-[#F9A8D4] transition-all duration-300 placeholder:text-black"
            />
            <AiOutlineSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600"
              style={{ fontSize: "24px" }} // Increase the size of the icon here
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gradient-to-r from-[#93C5FD] via-[#D8B4FE] to-[#e478b3] hover:from-[#A5B4FC] hover:via-[#E0A7F9] hover:to-[#FBCFE8] transition-all duration-300 shadow-md text-indigo-900 font-semibold"
          >
            <option
              value="name"
              className="bg-white text-gray-800 hover:bg-indigo-200"
            >
              🔤 Sort by Name
            </option>
            <option
              value="price"
              className="bg-white text-gray-800 hover:bg-yellow-200"
            >
              💰 Sort by Price
            </option>
            <option
              value="quantity"
              className="bg-white text-gray-800 hover:bg-green-200"
            >
              📦 Sort by Quantity
            </option>
          </select>
        </div>
      )}

      {/* Add/Edit Item Form */}
      {isAddItemVisible && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6 hover:shadow-xl transition-all duration-300"
        >
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500 hover:shadow-sm transition-all duration-300"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500 hover:shadow-sm transition-all duration-300"
          />
          <input
            type="number"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(e.target.value)}
            placeholder="Enter quantity"
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500 hover:shadow-sm transition-all duration-300"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {editingId ? "Update Item" : "Add Item"}
          </button>
        </form>
      )}

      {/* Inventory List */}
      {!isAddItemVisible && (
        <div className="overflow-x-auto mt-8 w-full max-w-4xl">
          <table className="min-w-full bg-white border border-gray-500 rounded-lg shadow-md">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-3 px-4 border border-gray-400">Item Name</th>
                <th className="py-3 px-4 border border-gray-400">Price</th>
                <th className="py-3 px-4 border border-gray-400">
                  Current Quantity
                </th>
                <th className="py-3 px-4 border border-gray-400">
                  Order Quantity
                </th>
                <th className="py-3 px-4 border border-gray-400 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr
                  key={item._id}
                  className={`hover:bg-gray-100 transition-all duration-300 ${
                    item.current_quantity === 0 ? "bg-red-200" : ""
                  }`}
                >
                  <td className="py-3 px-4 border border-gray-400">
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editItemData.name}
                        onChange={(e) => handleInputChange(e, "name")}
                        className="w-full p-2 border border-gray-300 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all duration-300"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="py-3 px-4 border border-gray-400">
                    {editingId === item._id ? (
                      <input
                        type="number"
                        value={editItemData.price}
                        onChange={(e) => handleInputChange(e, "price")}
                        className="w-full p-2 border border-gray-400 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all duration-300"
                      />
                    ) : (
                      item.price
                    )}
                  </td>
                  <td className="py-3 px-4 border border-gray-400">
                    {editingId === item._id ? (
                      <input
                        type="number"
                        value={editItemData.current_quantity}
                        onChange={(e) =>
                          handleInputChange(e, "current_quantity")
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all duration-300"
                      />
                    ) : (
                      item.current_quantity
                    )}
                  </td>
                  <td className="py-3 px-4 border border-gray-400">
                    {item.order_quantity}
                  </td>
                  <td className="py-3 px-4 border border-gray-400 text-center space-x-2">
                    {editingId === item._id ? (
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() =>
                        openDeleteConfirmation(item._id, item.name)
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteItemId && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-lg shadow-xl max-w-sm w-full hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-300">{deleteItemName}</span>?
            </h2>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => handleDelete(deleteItemId)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteItemId(null)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
