import React, { useState, useEffect } from 'react';
import { database } from '../Firebase';  
import { ref as dbRef, push, onValue, update, remove } from 'firebase/database';
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
  const [groups, setGroups] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const groupsRef = dbRef(database, 'whatsappGroups');
    onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const groupsList = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setGroups(groupsList);
      } else {
        setGroups([]);
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!groupData.link.includes('chat.whatsapp.com')) {
        setMessage('Please enter a valid WhatsApp group link');
        setLoading(false);
        return;
      }

      const groupsRef = dbRef(database, 'whatsappGroups');
      if (editId) {
        await update(dbRef(database, `whatsappGroups/${editId}`), groupData);
        setMessage('Group updated successfully!');
      } else {
        await push(groupsRef, { ...groupData, createdAt: new Date().toISOString() });
        setMessage('Group added successfully!');
      }

      setGroupData({ name: '', description: '', link: '', category: '', language: '', members: '' });
      setEditId(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (group) => {
    setGroupData({
      name: group.name,
      description: group.description,
      link: group.link,
      category: group.category,
      language: group.language,
      members: group.members
    });
    setEditId(group.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      await remove(dbRef(database, `whatsappGroups/${id}`));
      setMessage('Group removed successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>{editId ? 'Edit Group' : 'Add New WhatsApp Group'}</h1>
        {message && <div className="message">{message}</div>}
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="name">Group Name</label>
            <input type="text" id="name" name="name" value={groupData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={groupData.description} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="link">WhatsApp Group Link</label>
            <input type="url" id="link" name="link" value={groupData.link} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={groupData.category} onChange={handleInputChange} required>
              <option value="">Select Category</option>
              <option value="Support">Support</option>
              <option value="Activities">Activities</option>
              <option value="Discussion">Discussion</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select id="language" name="language" value={groupData.language} onChange={handleInputChange} required>
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="members">Current Members</label>
            <input type="number" id="members" name="members" value={groupData.members} onChange={handleInputChange} required />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Processing...' : editId ? 'Update Group' : 'Add Group'}
          </button>
        </form>
      </div>
      <div className="list-container">
        <h2>WhatsApp Groups</h2>
        {groups.length === 0 ? <p>No groups added yet.</p> : (
          <ul className="group-list">
            {groups.map(group => (
              <li key={group.id} className="group-item">
                <div>
                  <strong>{group.name}</strong> - {group.category} ({group.language})<br/>
                  <small>{group.description}</small><br/>
                  <a href={group.link} target="_blank" rel="noopener noreferrer">Join Group</a>
                </div>
                <div className="actions">
                  <button onClick={() => handleEdit(group)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(group.id)} className="delete-button">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommunityUpload;