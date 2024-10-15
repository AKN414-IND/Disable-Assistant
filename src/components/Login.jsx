import React from 'react';
import Auth from './Auth'; 
import "./Login.css";

export const Login = () => {
  const handleAuthChange = () => {
    console.log('Authentication state changed');
  };

  return (
    <div className="ent1">
      <Auth onAuthChange={handleAuthChange} />
    </div>
  );
};
