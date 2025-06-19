import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      Cookies.remove('user');

      navigate('/');
    }, 5000);
  })


  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-center">
      <div className="bg-red-500 animate-pulse text-xl text-black p-10 rounded-lg shadow-xl">
        <h1 className="text-6xl font-extrabold mb-4">403</h1>
        <p className="text-2xl mb-6">You don't have access to this page.</p>
        <p className="text-lg">Please contact the admin if you believe this is an error.</p>
      </div>
    </div>
  );
};

export default UnauthPage;
