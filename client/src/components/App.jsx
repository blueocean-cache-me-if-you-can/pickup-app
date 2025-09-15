import React, { useState, useEffect } from 'react';
import {
  Routes, Route, Link, Navigate, useNavigate, useLocation,
} from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

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
      if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
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
      // .catch((error) => console.error('Error fetching activities:', error));
      .catch((error) => console.error('This error is expected in development without a backend:', error));

    fetch('/api/skills')
      .then((response) => response.json())
      .then((data) => setSkillLevels(data))
      // .catch((error) => console.error('Error fetching skills:', error));
      .catch((error) => console.error('This error is expected in development without a backend:', error));

    fetch('/api/intensities')
      .then((response) => response.json())
      .then((data) => setIntensities(data))
      // .catch((error) => console.error('Error fetching intensities:', error));
      .catch((error) => console.error('This error is expected in development without a backend:', error));
  }, [sessionId, location.pathname, navigate]);

  // sessionId, setSessionId, activities, skillLevels, intensities should be passed as props
  return (
    <Routes>
      <Route path='/' element={<div>Hello World</div>} />
      <Route path='/login' element={<Login setSessionId={setSessionId} />} />
      <Route path='/signup' element={<Signup setSessionId={setSessionId} />} />
      <Route path='/profile' element={<div>Profile</div>} />
      <Route path='/events' element={<div>Events</div>} />
      <Route path='*' element={<Navigate to={sessionId ? '/events' : '/login'} />} />
    </Routes>
  );
}

export default App;
