import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from './components/Login';
import LandingPage from './components/LandingPage';
import Videos from './components/Videos';
import Exam from './components/Exam';
import Future from './components/Future';
import Community from './components/Community';
import ContactProfessionals from './components/ContactProfessionals';
import KidsEntertainment from './components/KidsEntertainment';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/future-enhancement" element={<Future />} />
        <Route path="/community" element={<Community />} />
        <Route path="/contact-professional" element={<ContactProfessionals />} />
        <Route path="/kids-entertainment" element={<KidsEntertainment />} />
      </Routes>
    </Router>
  );
}

export default App;
