import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';
import { Modal, Avatar, Button } from 'antd';
import './LandingPage.css';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [username, setUsername] = useState(''); 

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email === 'appukuttan673@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

  
        if (currentUser.providerData[0]?.providerId === 'google.com' && currentUser.photoURL) {
          setUsername(currentUser.displayName);
          const emailFirstLetter = currentUser.email.charAt(0).toUpperCase()+currentUser.email.charAt(1).toUpperCase();
          const textColor = 'ffffff'; 
          const blackBackground = '000000'; 
          setProfileImageUrl(
            `https://ui-avatars.com/api/?name=${emailFirstLetter}&background=${blackBackground}&color=${textColor}&size=150`
          );
        } else {

          const emailFirstLetter = currentUser.email.charAt(0).toUpperCase()+currentUser.email.charAt(1).toUpperCase();
          const textColor = 'ffffff'; 
          const blackBackground = '000000'; 
          setProfileImageUrl(
            `https://ui-avatars.com/api/?name=${emailFirstLetter}&background=${blackBackground}&color=${textColor}&size=150`
          );

        
          const emailUsername = currentUser.email.split('@')[0];
          setUsername(emailUsername);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAdminRedirect = () => {
    navigate('/admin');
  };

  const showProfileModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="landing-page">
      <div className="logout-container">
        <Avatar
          size="large"
          src={profileImageUrl}
          onClick={showProfileModal}
          style={{ cursor: 'pointer', marginRight: '10px' }}
        />

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

      {user && (
        <Modal
          title="Profile Details"
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Close
            </Button>
          ]}
        >
          <div style={{ textAlign: 'center' }}>
            <Avatar size={100} src={profileImageUrl} />
            <h3 style={{ marginTop: '20px' }}>{username}</h3> 
            <p>Email: {user.email}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LandingPage;
