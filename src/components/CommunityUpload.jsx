import React, { useState } from 'react';
import { database } from '../Firebase';  
import { ref, push } from 'firebase/database';
import './CommunityUpload.css';

const CommunityUpload = () => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    link: '',
    category: '',
    language: '',
    members: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate WhatsApp link
      if (!groupData.link.includes('chat.whatsapp.com')) {
        setMessage('Please enter a valid WhatsApp group link');
        return;
      }

      // Create a reference to the 'whatsappGroups' node
      const groupsRef = ref(database, 'whatsappGroups');
      
      // Push new group data
      await push(groupsRef, {
        ...groupData,
        members: Number(groupData.members),
        createdAt: new Date().toISOString()
      });

      // Clear form and show success message
      setGroupData({
        name: '',
        description: '',
        link: '',
        category: '',
        language: '',
        members: ''
      });
      setMessage('Group added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      setMessage('Error adding group: ' + error.message);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Add New WhatsApp Group</h1>
        
        {message && <div className="message">{message}</div>}
        
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="name">Group Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={groupData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={groupData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">WhatsApp Group Link</label>
            <input
              type="url"
              id="link"
              name="link"
              value={groupData.link}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={groupData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Support">Support</option>
                <option value="Activities">Activities</option>
                <option value="Discussion">Discussion</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={groupData.language}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="members">Current Members</label>
            <input
              type="number"
              id="members"
              name="members"
              value={groupData.members}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Add Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunityUpload;