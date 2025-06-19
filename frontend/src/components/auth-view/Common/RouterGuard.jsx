import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const RouteGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;

  useEffect(() => {
    if (userSession == null) {
        if (location.pathname.includes('/admin') || location.pathname.includes('/client')) {
            navigate('/auth/login');
        }
    } else {
        if (location.pathname.includes('/admin')) {
            if (userSession.user.role !== 'admin') {
                navigate('/unauth-page');
            }
        }

        if (location.pathname.includes('/client')) {
            if (userSession.user.role === 'admin') {
                navigate('/admin/gallery');
            }
        }
        
        if (location.pathname === '/auth/login' && userSession.user.role === 'customer') {
            navigate('/client/home');
        } else if (location.pathname === '/auth/login' && userSession.user.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }
  }, [location, userSession, navigate]);



  return null;
};

export default RouteGuard;
