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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Check if the logged-in user is the admin
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
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Authenticated (Private) Routes */}
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

        {/* Admin Routes */}
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
      </Routes>
    </Router>
  );
}

export default App;
