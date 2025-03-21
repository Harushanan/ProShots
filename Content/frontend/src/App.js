import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import GalleryPage from "./pages/GalleryPage";

const App = () => {
  return (
    <Router>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full p-3 z-50 bg-transparent">
        {/*fixed top-0 left-0 w-full bg-transparent p-3 shadow-md z-50 */}
        <Link
          to="/"
          className="text-gray-800 font-bold mx-2 no-underline hover:text-emerald-700"
        >
          Upload
        </Link>
        <span className="text-gray-800">|</span>
        <Link
          to="/gallery"
          className="text-gray-800 font-bold mx-2 no-underline  hover:text-emerald-700"
        >
          Gallery
        </Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
