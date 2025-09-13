import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Routes, Route, Link, Navigate, useNavigate, useLocation, BrowserRouter as Router,
} from 'react-router-dom';

function App() {
  // for development, this sessionId uses localStorage and crypto
  // in production, this should be handled by something like JWT and/or cookies
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'));
  const location = useLocation();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [intensities, setIntensities] = useState([]);
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
      if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
        navigate('/events', { replace: true });
      }
    } else {
      localStorage.removeItem('sessionId');
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login', { replace: true });
      }
    }
    fetch('/api/activities')
      .then((response) => response.json())
      .then((data) => setActivities(data))
      .catch((error) => console.error('Error fetching activities:', error));

    fetch('/api/skills')
      .then((response) => response.json())
      .then((data) => setSkillLevels(data))
      .catch((error) => console.error('Error fetching skills:', error));

    fetch('/api/intensities')
      .then((response) => response.json())
      .then((data) => setIntensities(data))
      .catch((error) => console.error('Error fetching intensities:', error));
  }, [sessionId, location.pathname, navigate]);

  // sessionId, setSessionId, activities, skillLevels, intensities should be passed as props
  return (
    <Router>
      <Routes>
        <Route path='/' element={<div>Hello World</div>} />
        <Route path='/login' element={<div>Login</div>} />
        <Route path='/signup' element={<div>Signup</div>} />
        <Route path='/profile' element={<div>Profile</div>} />
        <Route path='/events' element={<div>Events</div>} />
        <Route path='*' element={<Navigate to={sessionId ? '/events' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
