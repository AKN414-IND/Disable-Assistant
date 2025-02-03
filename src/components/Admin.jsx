import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css'; 

export default function Admin() {
  const navigate = useNavigate();

  const adminOptions = [
    { 
      title: 'Videos', 
      route: '/upload-video',
      icon: '🎥'
    },
    { 
      title: 'Exam', 
      route: '/exam-upload',
      icon: '📝'
    },
    { 
      title: 'Future Enhancement', 
      route: '/future-enhancement',
      icon: '🚀'
    },
    { 
      title: 'Community', 
      route: '/community-upload',
      icon: '👥'
    },
    { 
      title: 'Contact Professionals', 
      route: '/professional-upload',
      icon: '💼'
    },
    { 
      title: 'Kids Entertainment', 
      route: '/kids-entertainment-upload',
      icon: '🧸'
    }
  ];

  return (
    <div className="admin-container">
      <div className="admin-wrapper">
        <h1>Admin Dashboard</h1>
        <p>Select an option to manage:</p>
        
        <div className="admin-options">
          {adminOptions.map((option, index) => (
            <div 
              key={index} 
              className="admin-option" 
              onClick={() => navigate(option.route)}
            >
              <span className="admin-option-icon">{option.icon}</span>
              <h3>{option.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}