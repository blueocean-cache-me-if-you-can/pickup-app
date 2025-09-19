import React, { useState, useEffect } from 'react';
import {
  Routes, Route, Navigate, useNavigate, useLocation,
} from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Events from '../pages/Events';
import Profile from '../pages/Profile';
import Navbar from './Navbar';
import {
  getActivities,
  getSkillLevels,
  getIntensityLevels,
} from '../api';

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  );
  const location = useLocation();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [intensities, setIntensities] = useState([]);

  // Handle user navigation and localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (!localStorage.getItem('firstLogin')) {
        localStorage.setItem('firstLogin', 'true');
      }
      if (['/login', '/signup', '/'].includes(location.pathname)) {
        navigate('/events', { replace: true });
      }
    } else {
      localStorage.removeItem('user');
      if (!['/login', '/signup'].includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  // Fetch reference data only once on mount
  useEffect(() => {
    Promise.all([getActivities(), getSkillLevels(), getIntensityLevels()])
      .then(([activitiesRes, skillLevelsRes, intensitiesRes]) => {
        console.log('Activities response:', activitiesRes);
        console.log('Skill Levels response:', skillLevelsRes);
        console.log('Intensity Levels response:', intensitiesRes);

        setActivities(activitiesRes);
        setSkillLevels(skillLevelsRes);
        setIntensities(intensitiesRes);
      })
      .catch((err) => {
        console.error('Error fetching reference data:', err);
      });
  }, []);

  return (
    <AppShell
      header={user ? { height: 90 } : undefined} // only reserve space when logged in
    >
      {user && (
        <AppShell.Header>
          <Navbar
            user={user}
            setUser={setUser}
            activities={activities}
            skillLevels={skillLevels}
            intensities={intensities}
          />
        </AppShell.Header>
      )}

      <AppShell.Main>
        <Routes>
          <Route path='/' element={<div>Hello World</div>} />
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/signup' element={<Signup setUser={setUser} />} />
          <Route path='/profile' element={<Profile user={user} setUser={setUser} activities={activities} skillLevels={skillLevels} />} />
          <Route path='/events' element={<Events user={user} activities={activities} skillLevels={skillLevels} intensities={intensities} />} />
          <Route path='*' element={<Navigate to={user ? '/events' : '/login'} />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
