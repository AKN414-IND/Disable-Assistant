import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // If you are using an Auth context or state

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Replace this with your actual authentication check
  const isAdmin = currentUser && currentUser.email === 'appukuttan673@gmail.com';

  return isAdmin ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
