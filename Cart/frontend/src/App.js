import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListForm from "./Pages/ListForm";
import ItemList from "./Pages/ItemList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListForm />} /> {/* Default Route */}
        <Route path="/create-product" element={<ListForm />} />{" "}
        {/* Create Product Route */}
        <Route path="/product-list" element={<ItemList />} />{" "}
        {/* Product List Route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
