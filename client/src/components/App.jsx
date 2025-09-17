import React, { useState, useEffect } from 'react';
import {
  Routes, Route, Link, Navigate, useNavigate, useLocation,
} from 'react-router-dom';
import {
  AppShell, Group, Menu, Button, Divider, Text, Box,
} from '@mantine/core';
import { IconChevronDown, IconPlus } from '@tabler/icons-react';
import Logo from './Logo';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Events from '../pages/Events';
import Profile from '../pages/Profile';

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
          <Group justify='space-between' style={{ height: '100%', padding: '0 20px' }}>
            <Box component={Link} to='/events' style={{ cursor: 'pointer' }}>
              <Logo />
            </Box>
            <Group>
              <Button variant='filled' color='teal'>
                <IconPlus size={16} />
                &nbsp;
                Create Event
              </Button>
              <Divider orientation='vertical' />
              <Menu shadow='md' width={200}>
                <Menu.Target>
                  <Group gap='xs' style={{ cursor: 'pointer' }}>
                    <Text size='sm'>
                      {/* TODO: Replace with actual username */}
                      Username
                    </Text>
                    <IconChevronDown size={24} />
                  </Group>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} to='/events'>
                    <Text size='sm'>Events</Text>
                  </Menu.Item>
                  <Menu.Item component={Link} to='/profile'>
                    <Text size='sm'>Profile</Text>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item onClick={() => setSessionId(null)}>
                    <Text size='sm' color='red'>Logout</Text>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
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
