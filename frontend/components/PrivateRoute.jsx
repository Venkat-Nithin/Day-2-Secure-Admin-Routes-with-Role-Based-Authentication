import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null; // Decode JWT to get user role

  // If no token or user is not an admin, redirect to the home page
  if (!token || userRole !== 'admin') {
    return <Navigate to="/" />; // Redirect to home page
  }

  // If token is valid and user is an admin, allow access to the route
  return <Route {...rest} element={element} />;
};

export default PrivateRoute;
