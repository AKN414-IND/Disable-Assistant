import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { Modal, Avatar, Button } from "antd";
import {
  VideoCameraOutlined,
  FormOutlined,
  RocketOutlined,
  TeamOutlined,
  PhoneOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import "./LandingPage.css";

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [username, setUsername] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out from Firebase");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
      alert("Error during logout. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAdmin(currentUser.email === "projectpro53@gmail.com");

        const emailFirstLetter =
          currentUser.email.charAt(0).toUpperCase() +
          currentUser.email.charAt(1).toUpperCase();
        const textColor = "ffffff";
        const blackBackground = "000000";

        if (
          currentUser.providerData[0]?.providerId === "google.com" &&
          currentUser.photoURL
        ) {
          setProfileImageUrl(currentUser.photoURL);
          setUsername(currentUser.displayName);
        } else {
          setProfileImageUrl(
            `https://ui-avatars.com/api/?name=${emailFirstLetter}&background=${blackBackground}&color=${textColor}&size=150`
          );
          setUsername(currentUser.email.split("@")[0]);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAdminRedirect = () => {
    navigate("/admin");
  };

  const showProfileModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const options = [
    { title: "Videos", icon: <VideoCameraOutlined />, path: "/videos" },
    { title: "Exam", icon: <FormOutlined />, path: "/exam" },
    {
      title: "AI Support",
      icon: <RocketOutlined />,
      path: "/future-enhancement",
    },
    { title: "Community", icon: <TeamOutlined />, path: "/community" },
    {
      title: "Contact Professionals",
      icon: <PhoneOutlined />,
      path: "/contact-professional",
    },
    {
      title: "Kids Entertainment",
      icon: <SmileOutlined />,
      path: "/kids-entertainment",
    },
  ];

  return (
    <div className="landing-page">
      <div className="top-bar">
        <Avatar
          size="large"
          src={profileImageUrl}
          onClick={showProfileModal}
          style={{ cursor: "pointer" }}
        />
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
      </div>

      <div className="content-area">
        <h1>Welcome to the Platform</h1>
        <p>
          Explore our range of services designed to enhance your experience and
          meet your needs.
        </p>
        <div className="options-container">
          {options.map((option, index) => (
            <div
              key={index}
              className="option"
              onClick={() => navigate(option.path)}
            >
              {option.icon}
              <h3>{option.title}</h3>
            </div>
          ))}
        </div>
      </div>
      

      <Modal
        className="profile-modal"
        title="Profile Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center" }}>
          <Avatar size={100} src={profileImageUrl} />
          <h3 style={{ marginTop: "20px" }}>{username}</h3>
          <p>Email: {user?.email}</p>
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
