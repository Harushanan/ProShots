import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div 
      style={{ 
        fontFamily: 'Arial, sans-serif', 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        margin: 0, 
        padding: 0, 
        boxSizing: 'border-box' 
      }}
    >
      <div>
        <Outlet />
      </div>
      <div id="footer"></div>
    </div>
  );
};

export default Layout;
