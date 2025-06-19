import React from "react";
import SearchBar from "./SearchBar";
import Sort from "./Sort";

const StockList = ({
  sortedItems,
  editingId,
  editItemData,
  handleInputChange,
  handleSaveEdit,
  handleEdit,
  openDeleteConfirmation,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="overflow-x-auto mt-8 w-full max-w-4xl">
      <div className="w-full max-w-4xl mb-6 flex space-x-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Sort sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <table className="min-w-full bg-white border border-gray-500 rounded-lg shadow-md">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="py-3 px-4 border border-gray-400">Item Name</th>
            <th className="py-3 px-4 border border-gray-400">Price</th>
            <th className="py-3 px-4 border border-gray-400">
              Current Quantity
            </th>
            <th className="py-3 px-4 border border-gray-400">Order Quantity</th>
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
                    onChange={(e) => handleInputChange(e, "current_quantity")}
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
                  onClick={() => openDeleteConfirmation(item._id, item.name)}
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
  );
};

export default StockList;
