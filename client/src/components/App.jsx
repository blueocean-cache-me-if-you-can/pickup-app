import React, { useState, useEffect } from 'react';
import {
  Routes, Route, Navigate, useNavigate, useLocation,
} from 'react-router-dom';
import { AppShell } from '@mantine/core';
import axios from 'axios';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Events from '../pages/Events';
import Profile from '../pages/Profile';
import Navbar from './Navbar';

function App() {
  // for development, this sessionId uses localStorage and crypto
  // in production, this should `be handled by something like JWT and/or cookies
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'));
  const location = useLocation();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [intensities, setIntensities] = useState([]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
      if (!localStorage.getItem('firstLogin')) {
        localStorage.setItem('firstLogin', 'true');
      }
      if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
        navigate('/events', { replace: true });
      }
    } else {
      localStorage.removeItem('sessionId');
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login', { replace: true });
      }
    }
    axios.get('/api/activities')
      .then((response) => {
        console.log('response', response.data);
        setActivities(response.data);
      })
      .catch((error) => console.error('Error fetching activities:', error));

    axios.get('/api/skillLevels')
      .then((response) => {
        console.log('response', response.data);
        setSkillLevels(response.data);
      })
      .catch((error) => console.error('Error fetching skills:', error));

    axios.get('/api/intensityLevels')
      .then((response) => {
        console.log('response', response.data);
        setIntensities(response.data);
      })
      .catch((error) => console.error('Error fetching intensities:', error));
  }, [sessionId, location.pathname, navigate]);

  // Dummy event data
  /*
  const [event, setEvent] = useState(
    {
      id: 1,
      title: 'Sample Event',
      owner: { user_id: 4, name: 'Steve Knobs' },
      activity: { id: 1, name: 'pickleball', image: 'https://img.freepik.com/premium-vector/pickleball-vector-vector-traditional-symbol-icon-playing-pickleball_769314-451.jpg?w=826' },
      players: [
        { user_id: 2, name: 'Alice Wonder' },
        { user_id: 3, name: 'Bob Builder', photo: 'https://randomuser.me/api/portraits/men/75.jpg' },
        { user_id: 4, name: 'Steve Knobs' },
      ],
      maxPlayers: 8,
      photo: 'https://thepickleballprofessionals.com/wp-content/uploads/2024/02/image-4-11.jpg',
    },
  );
  */
  // sessionId, setSessionId, activities, skillLevels, intensities should be passed as props
  return (
    <AppShell
      header={sessionId ? { height: 90 } : undefined} // only reserve space when logged in
    >
      {sessionId && (
        <AppShell.Header>
          <Navbar
            setSessionId={setSessionId}
            activities={activities}
            skillLevels={skillLevels}
            intensities={intensities}
          />
        </AppShell.Header>
      )}

      <AppShell.Main>
        <Routes>
          <Route path='/' element={<div>Hello World</div>} />
          <Route path='/login' element={<Login setSessionId={setSessionId} />} />
          <Route path='/signup' element={<Signup setSessionId={setSessionId} />} />
          <Route path='/profile' element={<Profile activities={activities} skillLevels={skillLevels} />} />
          <Route path='/events' element={<Events />} />
          <Route path='*' element={<Navigate to={sessionId ? '/events' : '/login'} />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
