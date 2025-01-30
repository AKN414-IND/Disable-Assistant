import React, { useEffect, useState } from 'react';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from './components/Login';
import LandingPage from './components/LandingPage';
import ExamPage from './components/ExamPage';
import Videos from './components/Videos';
import Future from './components/Future';
import Community from './components/Community';
import ContactProfessionals from './components/ContactProfessionals';
import KidsEntertainment from './components/KidsEntertainment';
import ExamListPage from './components/ExamListPage';
import Admin from './components/Admin';
import VideoUpload from './components/VideoUpload';
import VideoUploadKids from './components/VideoUploadKids';
import ExamUpload from './components/ExamUpload';
import CommunityUpload from './components/CommunityUpload';
import ProfessionalUpload from './components/ProfessionalUpload';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (user.email === 'appukuttan673@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/home"
          element={
            isAuthenticated ? <LandingPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/videos"
          element={
            isAuthenticated ? <Videos /> : <Navigate to="/" />
          }
        />
        <Route
          path="/exam"
          element={
            isAuthenticated ? <ExamPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/exampage/:classId"
          element={
            isAuthenticated ? <ExamListPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/future-enhancement"
          element={
            isAuthenticated ? <Future /> : <Navigate to="/" />
          }
        />
        <Route
          path="/community"
          element={
            isAuthenticated ? <Community /> : <Navigate to="/" />
          }
        />
        <Route
          path="/contact-professional"
          element={
            isAuthenticated ? <ContactProfessionals /> : <Navigate to="/" />
          }
        />
        <Route
          path="/kids-entertainment"
          element={
            isAuthenticated ? <KidsEntertainment /> : <Navigate to="/" />
          }
        />

        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? <Admin /> : <Navigate to="/" />
          }
        />
        <Route
          path="/upload-video"
          element={
            isAuthenticated && isAdmin ? <VideoUpload /> : <Navigate to="/" />
          }
        />
        <Route
          path="/kids-entertainment-upload"
          element={
            isAuthenticated && isAdmin ? <VideoUploadKids /> : <Navigate to="/" />
          }
        />
        <Route
          path="/exam-upload"
          element={
            isAuthenticated && isAdmin ? <ExamUpload /> : <Navigate to="/" />
          }
        />
        <Route
          path="/community-upload"
          element={
            isAuthenticated && isAdmin ? <CommunityUpload /> : <Navigate to="/" />
          }
        />
        <Route
          path="/professional-upload"
          element={
            isAuthenticated && isAdmin ? <ProfessionalUpload /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
