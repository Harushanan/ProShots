import StockList from "@/components/admin-view/inventory/StockList";
import DeleteConfirmation from "@/components/admin-view/inventory/DeleteConfirmation";
import { validateStockForm } from "@/components/admin-view/inventory/FormValidations";
import StockForm from "@/components/admin-view/inventory/StockForm";
import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const API_URL = "http://localhost:5000/items";

function Stock() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isAddItemVisible, setIsAddItemVisible] = useState(true);
  const [editItemData, setEditItemData] = useState({});
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [notifiedItems, setNotifiedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Wrap fetchItems in 
  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);

      data.forEach((item) => {
        if (item.current_quantity === 0 && !notifiedItems.has(item._id)) {
          toast.warning(`⚠️ ${item.name} is out of stock!`, {
            position: "top-left",
            autoClose: false,
            closeOnClick: false,
            draggable: true,
          });

          setNotifiedItems((prev) => new Set(prev).add(item._id));
        }
      });
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Error fetching items.");
    }
  }, [notifiedItems]); 

  
  useEffect(() => {
    fetchItems();
  }, [fetchItems]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateStockForm(name, price, currentQuantity);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const itemData = {
      name,
      price: parseFloat(price),
      current_quantity: parseInt(currentQuantity),
    };

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });
        setEditingId(null);
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });
      }

      setName("");
      setPrice("");
      setCurrentQuantity("");
      fetchItems();
      toast.success("Item added/updated successfully");
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Error saving item.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchItems();
      toast.success("Item deleted successfully");
      setDeleteItemId(null);
      setDeleteItemName("");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item.");
    }
  };

  const handleEdit = (item) => {
    setEditItemData(item);
    setEditingId(item._id);
    setDeleteItemId(null);
  };

  const handleSaveEdit = async () => {
    const validationError = validateStockForm(
      editItemData.name,
      editItemData.price,
      editItemData.current_quantity
    );
    if (validationError) {
      toast.error(validationError);
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
      setEditingId(null);
      fetchItems();
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Error updating item.");
    }
  };

  const handleInputChange = (e, field) => {
    setEditItemData({
      ...editItemData,
      [field]: e.target.value,
    });
  };

  const toggleView = (view) => {
    if (view !== isAddItemVisible) {
      setIsAddItemVisible(view);
    }
  };

  const openDeleteConfirmation = (id, name) => {
    setDeleteItemId(id);
    setDeleteItemName(name);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="flex flex-col items-center p-8 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">Inventory</h1>

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

      {isAddItemVisible ? (
        <StockForm
          name={name}
          setName={setName}
          price={price}
          setPrice={setPrice}
          currentQuantity={currentQuantity}
          setCurrentQuantity={setCurrentQuantity}
          editingId={editingId}
          handleSubmit={handleSubmit}
        />
      ) : (
        <StockList
          sortedItems={sortedItems}
          editingId={editingId}
          editItemData={editItemData}
          handleInputChange={handleInputChange}
          handleSaveEdit={handleSaveEdit}
          handleEdit={handleEdit}
          openDeleteConfirmation={openDeleteConfirmation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      )}

      {deleteItemId && (
        <DeleteConfirmation
          deleteItemId={deleteItemId}
          deleteItemName={deleteItemName}
          handleDelete={handleDelete}
          setDeleteItemId={setDeleteItemId}
        />
      )}

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

export default Stock;
