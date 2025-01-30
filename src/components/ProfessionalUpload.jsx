import React, { useState } from 'react';
import { database } from '../Firebase';
import { ref as dbRef, push } from 'firebase/database';
import './ProfessionalUpload.css';

const ProfessionalUpload = () => {
  const [professionalData, setProfessionalData] = useState({
    name: '',
    designation: '',
    whatsapp: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfessionalData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save professional data to database
      const professionalsRef = dbRef(database, 'professionals');
      await push(professionalsRef, {
        ...professionalData,
        createdAt: new Date().toISOString()
      });

      // Reset form
      setProfessionalData({
        name: '',
        designation: '',
        whatsapp: '',
        email: '',
      });
      setMessage('Professional added successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Add New Professional</h1>
        
        {message && <div className="message">{message}</div>}
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={professionalData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={professionalData.designation}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp Number</label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={professionalData.whatsapp}
              onChange={handleInputChange}
              required
              placeholder="Include country code (e.g., +1234567890)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={professionalData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Professional'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalUpload;