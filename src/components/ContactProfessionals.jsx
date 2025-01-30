import React, { useState, useEffect } from 'react';
import { database } from '../Firebase';  
import { ref, onValue } from 'firebase/database';
import './ContactProfessionals.css';

const ContactProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const professionalsRef = ref(database, 'professionals');

    const unsubscribe = onValue(professionalsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const professionalsArray = Object.entries(data).map(([id, professional]) => ({
            id,
            ...professional
          }));
          setProfessionals(professionalsArray);
        } else {
          setProfessionals([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Error loading professionals');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading professionals...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="professionals-page">
      <div className="container">
        <h1>Contact Professionals</h1>
        <p className="subtitle">Connect with our healthcare professionals</p>

        <div className="professionals-grid">
          {professionals.map((professional) => (
            <div key={professional.id} className="professional-card">
              <div className="professional-info">
                <h3>{professional.name}</h3>
                <p className="designation">{professional.designation}</p>
                
                <div className="contact-buttons">
                  <button 
                    onClick={() => window.open(`https://wa.me/${professional.whatsapp}`, '_blank')}
                    className="whatsapp-button"
                  >
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => window.open(`mailto:${professional.email}`, '_blank')}
                    className="email-button"
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactProfessionals;