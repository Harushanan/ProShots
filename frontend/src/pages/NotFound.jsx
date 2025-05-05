import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-300 text-white text-center">
      <h1 className="text-6xl font-extrabold text-red-500">404</h1>
      <p className="text-4xl text-black mt-4">Oops! Page not found.</p>
      <Link to="/" className="mt-6 text-xl text-black bg-blue-600 hover:bg-blue-500 hover:text-black border-2 border-black py-2 px-6 rounded-lg transition-all duration-300">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
