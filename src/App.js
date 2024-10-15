import React, { useEffect, useState } from 'react';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
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

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/" />;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          }
        />
        <Route path="/videos" element={ <PrivateRoute><Videos/></PrivateRoute>} />
        <Route path="/exam" element={<PrivateRoute><ExamPage/></PrivateRoute>} />
        <Route path="/exampage/:classId" element={<PrivateRoute><ExamListPage/></PrivateRoute>} />
        <Route path="/future-enhancement" element={<PrivateRoute><Future /></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
        <Route path="/contact-professional" element={<PrivateRoute><ContactProfessionals /></PrivateRoute>} />
        <Route path="/kids-entertainment" element={<PrivateRoute><KidsEntertainment /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin/></PrivateRoute>} />
        <Route path="/upload-video" element={<PrivateRoute><VideoUpload/></PrivateRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
