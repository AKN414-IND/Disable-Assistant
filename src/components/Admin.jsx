import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; 

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p>Select an option to manage:</p>
      <div className="options-container">
        <div className="option" onClick={() => navigate('/upload-video')}>
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
}
