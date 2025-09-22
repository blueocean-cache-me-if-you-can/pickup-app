import React, { useState, useEffect, useCallback } from 'react';
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
  getEvents,
} from '../api';
import useGeocodeAddress from '../hooks/useGeocodeAddress';

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  );
  const location = useLocation();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [intensities, setIntensities] = useState([]);
  const { resolveAddress } = useGeocodeAddress();

  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const [eventsNearMeParams, setEventsNearMeParams] = useState(null);
  const [upcomingParams, setUpcomingParams] = useState(null);
  const [pastParams, setPastParams] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const refreshEvents = useCallback(() => setRefreshKey(k => k + 1), []);

  const handleQueryChange = useCallback(({ eventsNearMe, upcoming, past }) => {
    setEventsNearMeParams(eventsNearMe || null);
    setUpcomingParams(upcoming || null);
    setPastParams(past || null);
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoadingEvents(true);
        if (eventsNearMeParams) {
          const res = await getEvents(eventsNearMeParams);
          setEvents(Array.isArray(res) ? res : []);
        }
        if (upcomingParams) {
          const resUpcoming = await getEvents(upcomingParams);
          setUpcomingEvents(Array.isArray(resUpcoming) ? resUpcoming : []);
        }
        if (pastParams) {
          const resPast = await getEvents(pastParams);
          setPastEvents(Array.isArray(resPast) ? resPast : []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        if (eventsNearMeParams) setEvents([]);
        if (upcomingParams) setUpcomingEvents([]);
        if (pastParams) setPastEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    }
    fetchEvents();
  }, [eventsNearMeParams, upcomingParams, pastParams, refreshKey]);

  // Handle user navigation and localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
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
        setActivities(activitiesRes);
        setSkillLevels(skillLevelsRes);
        setIntensities(intensitiesRes);
      })
      .catch((err) => {
        console.error('Error fetching reference data:', err);
      });
  }, []);

  useEffect(() => {
    const runGeocode = async () => {
      if (user?.address && (!user.lat || !user.lng)) {
        try {
          const result = await resolveAddress(user.address);
          if (result) {
            const mergedUser = {
              ...user,
              address: result.address,
              lat: result.lat,
              lng: result.lng,
            };
            setUser(mergedUser);
            localStorage.setItem('user', JSON.stringify(mergedUser));
          }
        } catch (err) {
          console.error('Error resolving user address:', err);
        }
      }
    };
    runGeocode();
  }, [user, resolveAddress]);

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
            refreshEvents={refreshEvents}
          />
        </AppShell.Header>
      )}

      <AppShell.Main>
        <Routes>
          <Route path='/' element={<div>Hello World</div>} />
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/signup' element={<Signup setUser={setUser} />} />
          <Route path='/profile' element={<Profile user={user} setUser={setUser} activities={activities} skillLevels={skillLevels} />} />
          <Route path='/events' element={
            <Events
              user={user}
              activities={activities}
              skillLevels={skillLevels}
              intensities={intensities}
              events={events}
              upcomingEvents={upcomingEvents}
              pastEvents={pastEvents}
              isLoadingEvents={isLoadingEvents}
              onQueryChange={handleQueryChange}
              refreshEvents={refreshEvents}
            />}
          />
          <Route path='*' element={<Navigate to={user ? '/events' : '/login'} />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
