import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';  
import { auth } from '../Firebase'; 
import './LandingPage.css'; 

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);  
      console.log('User logged out from Firebase');
      navigate('/'); 
    } catch (error) {
      console.error('Error during logout:', error.message);
      alert('Error during logout. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'appukuttan673@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAdminRedirect = () => {
    navigate('/admin'); 
  };

  return (
    <div className="landing-page">
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        {isAdmin && (
          <button className="admin-btn" onClick={handleAdminRedirect}>
            Admin
          </button>
        )}
      </div>

      <h1>Welcome to the Platform</h1>
      <p>Select an option to get started:</p>
      <div className="options-container">
        <div className="option" onClick={() => navigate('/videos')}>
          <h3>Videos</h3>
        </div>
        <div className="option" onClick={() => navigate('/exam')}>  
          <h3>Exam</h3>
        </div>
        <div className="option" onClick={() => navigate('/future-enhancement')}>
          <h3>Future Enhancement</h3>
        </div>
        <div className="option" onClick={() => navigate('/community')}>
          <h3>Community</h3>
        </div>
        <div className="option" onClick={() => navigate('/contact-professional')}>
          <h3>Contact Professionals</h3>
        </div>
        <div className="option" onClick={() => navigate('/kids-entertainment')}>
          <h3>Kids Entertainment</h3>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
