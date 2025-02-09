import React, { useState, useEffect } from 'react';
import { database } from '../Firebase';
import { ref as dbRef, push, onValue, update, remove } from 'firebase/database';
import './ProfessionalUpload.css';

const ProfessionalUpload = () => {
  const [professionalData, setProfessionalData] = useState({
    name: '',
    designation: '',
    whatsapp: '',
    email: '',
  });
  const [professionals, setProfessionals] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const professionalsRef = dbRef(database, 'professionals');
    onValue(professionalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const professionalsList = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setProfessionals(professionalsList);
      } else {
        setProfessionals([]);
      }
    });
  }, []);

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
      const professionalsRef = dbRef(database, 'professionals');
      if (editId) {
        await update(dbRef(database, `professionals/${editId}`), professionalData);
        setMessage('Professional updated successfully!');
      } else {
        await push(professionalsRef, {
          ...professionalData,
          createdAt: new Date().toISOString()
        });
        setMessage('Professional added successfully!');
      }
      setProfessionalData({ name: '', designation: '', whatsapp: '', email: '' });
      setEditId(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (professional) => {
    setProfessionalData({
      name: professional.name,
      designation: professional.designation,
      whatsapp: professional.whatsapp,
      email: professional.email,
    });
    setEditId(professional.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this professional?')) {
      await remove(dbRef(database, `professionals/${id}`));
      setMessage('Professional removed successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>{editId ? 'Edit Professional' : 'Add New Professional'}</h1>
        {message && <div className="message">{message}</div>}
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={professionalData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <input type="text" id="designation" name="designation" value={professionalData.designation} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp Number</label>
            <input type="text" id="whatsapp" name="whatsapp" value={professionalData.whatsapp} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={professionalData.email} onChange={handleInputChange} required />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Processing...' : editId ? 'Update Professional' : 'Add Professional'}
          </button>
        </form>
      </div>
      <div className="list-container">
        <h2>Professionals List</h2>
        {professionals.length === 0 ? <p>No professionals added yet.</p> : (
          <ul className="professional-list">
            {professionals.map(prof => (
              <li key={prof.id} className="professional-item">
                <div>
                  <strong>{prof.name}</strong> - {prof.designation}<br/>
                  <small>{prof.whatsapp} | {prof.email}</small>
                </div>
                <div className="actions">
                  <button onClick={() => handleEdit(prof)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(prof.id)} className="delete-button">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfessionalUpload;