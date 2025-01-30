import React, { useState, useEffect } from 'react';
import { database } from '../Firebase'; 
import { ref, onValue } from 'firebase/database';
import './Community.css';

const Community = () => {
  const [whatsappGroups, setWhatsappGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a reference to the 'whatsappGroups' node
    const groupsRef = ref(database, 'whatsappGroups');

    // Set up the listener
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          // Convert the object of objects to an array of objects
          const groupsArray = Object.entries(data).map(([id, group]) => ({
            id,
            ...group
          }));
          setWhatsappGroups(groupsArray);
        } else {
          setWhatsappGroups([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Error loading groups');
        setLoading(false);
      }
    }, (error) => {
      setError('Error loading groups: ' + error.message);
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading groups...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="community-page">
      <div className="container">
        <h1>Community Groups</h1>
        <p className="subtitle">Join our WhatsApp support groups and connect with others</p>
        
        {whatsappGroups.length === 0 ? (
          <p className="no-groups">No groups available at the moment.</p>
        ) : (
          <div className="groups-grid">
            {whatsappGroups.map((group) => (
              <div key={group.id} className="group-card">
                <div className="group-content">
                  <h3>{group.name}</h3>
                  <p className="description">{group.description}</p>
                  
                  <div className="group-details">
                    <div className="info">
                      <span>Members: {group.members}</span>
                      <span>{group.language}</span>
                    </div>
                    
                    <div className="actions">
                      <span className="category">{group.category}</span>
                      <a
                        href={group.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="join-button"
                      >
                        Join Group
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;