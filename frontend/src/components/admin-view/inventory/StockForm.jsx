import React from "react";

const StockForm = ({
  name,
  setName,
  price,
  setPrice,
  currentQuantity,
  setCurrentQuantity,
  editingId,
  handleSubmit,
}) => {
  return (
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
  );
};

export default StockForm;
