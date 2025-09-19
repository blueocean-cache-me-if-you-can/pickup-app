import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, SegmentedControl, Flex, Space, Select, Title, Box, Group, Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import AddressPicker from '../components/AddressPicker';
import PrimaryFilter from '../components/PrimaryFilter';
import MyEvents from '../components/MyEvents';
import EventsList from '../components/EventsList';
import { getEvents } from '../api';

function Events({
  user, activities = [], intensities = [], skillLevels = [],
}) {
  const [view, setView] = useState('events-near-me');

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState([]);
  const [selectedIntensity, setSelectedIntensity] = useState([]);
  const [selectedDistance, setSelectedDistance] = useState(20);
  const [selectedSort, setSelectedSort] = useState('distance');
  const [selectedUpcomingSort, setSelectedUpcomingSort] = useState('dateUpcoming');
  const [selectedPastSort, setSelectedPastSort] = useState('datePast');
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const form = useForm({
    initialValues: {
      address: user?.address || '',
    },
  });

  const [confirmedCoords, setConfirmedCoords] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (user?.lat && user?.lng) {
      setConfirmedCoords({ lat: user.lat, lng: user.lng });
    }
  }, [user]);

  const sortDirections = useMemo(() => ({
    distance: false,
    dateUpcoming: false,
    datePast: true,
  }), []);

  const orderByDesc = sortDirections[selectedSort] ?? false;

  // State for API params
  const [eventsNearMeParams, setEventsNearMeParams] = useState({});
  const [upcomingParams, setUpcomingParams] = useState({});
  const [pastParams, setPastParams] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const [events, setEvents] = useState([]);
  const [upcomingMyEvents, setUpcomingMyEvents] = useState([]);
  const [pastMyEvents, setPastMyEvents] = useState([]);

  // Clear filters when view changes
  useEffect(() => {
    setSelectedActivities([]);
    setSelectedSkillLevels([]);
    setSelectedIntensity([]);
    setSelectedDistance(20);
    setSelectedSort('distance');
    setSelectedUpcomingSort('dateUpcoming');
    setSelectedPastSort('datePast');
  }, [view]);

  // Build filter helper
  const buildFilter = () => {
    const filter = {};
    const activityArr = activities
      .filter(a => selectedActivities.includes(a.name))
      .map(a => a._id);
    if (activityArr.length) filter.activity = activityArr;

    const skillLevelArr = skillLevels
      .filter(s => selectedSkillLevels.includes(s.name))
      .map(s => s._id);
    if (skillLevelArr.length) filter.skillLevel = skillLevelArr;

    const intensityArr = intensities
      .filter(i => selectedIntensity.includes(i.name))
      .map(i => i._id);
    if (intensityArr.length) filter.intensity = intensityArr;

    filter.distance = selectedDistance;
    return filter;
  };

  // Update params when dependencies change
  useEffect(() => {
    if (view !== 'events-near-me') return;
    if (!confirmedCoords.lat || !confirmedCoords.lng) return;

    const params = {
      finished: false,
      sort: (selectedSort === 'dateUpcoming' || selectedSort === 'datePast') ? 'date' : selectedSort,
      orderByDesc,
      filter: buildFilter(),
      coordinates: [confirmedCoords.lng, confirmedCoords.lat],
    };

    setEventsNearMeParams(params);
    setLastUpdated('eventsNearMe');
  }, [
    view,
    confirmedCoords,
    selectedActivities,
    selectedSkillLevels,
    selectedIntensity,
    selectedDistance,
    selectedSort
  ]);


  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoadingEvents(true);
        if (lastUpdated === 'eventsNearMe') {
          const res = await getEvents(eventsNearMeParams);
          setEvents(res);
        } else if (lastUpdated === 'upcoming') {
          const res = await getEvents(upcomingParams);
          setUpcomingMyEvents(res);
        } else if (lastUpdated === 'past') {
          const res = await getEvents(pastParams);
          setPastMyEvents(res);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        if (lastUpdated === 'eventsNearMe') setEvents([]);
        if (lastUpdated === 'upcoming') setUpcomingMyEvents([]);
        if (lastUpdated === 'past') setPastMyEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    }
    fetchEvents();
  }, [eventsNearMeParams, upcomingParams, pastParams, lastUpdated]);

  return (
    <Container size='lg'>
      <Space h='md' />

      {/* View toggle */}
      <Flex justify='center' mt='md' mb='xl'>
        <SegmentedControl
          fullWidth
          size='md'
          value={view}
          onChange={setView}
          data={[
            { label: 'Events Near Me', value: 'events-near-me' },
            { label: 'My Events', value: 'my-events' },
          ]}
        />
      </Flex>

      <Flex align='center' justify='center' mt='md' mb='xl' gap='lg'>
        <Title size='h4'>Filter by: </Title>
        <PrimaryFilter
          label='Activities'
          values={activities.map(a => a.name)}
          value={selectedActivities}
          onChange={setSelectedActivities}
        />
        <PrimaryFilter
          label='Skill Levels'
          values={skillLevels.map(s => s.name)}
          value={selectedSkillLevels}
          onChange={setSelectedSkillLevels}
        />
        <PrimaryFilter
          label='Intensities'
          values={intensities.map(i => i.name)}
          value={selectedIntensity}
          onChange={setSelectedIntensity}
        />
        <PrimaryFilter
          label='Distance'
          type='slider'
          values={[1, 5, 10, 15, 20]}
          value={selectedDistance}
          onChange={setSelectedDistance}
        />
      </Flex>

      {view === 'events-near-me' && (
        <Box>
          <Group justify='space-between' mb='xl' gap='lg'>
            <AddressPicker
              value={form.values.address}
              onChange={val => form.setFieldValue('address', val)}
              onResolved={({ address, lat, lng }) => {
                setConfirmedCoords({ lat, lng });
                if (address && address !== form.values.address) {
                  form.setFieldValue('address', address);
                }
              }}
            />
            <Select
              label='Sort by'
              data={[
                { value: 'distance', label: 'Distance' },
                { value: 'dateUpcoming', label: 'Date' },
              ]}
              defaultValue='distance'
              onChange={setSelectedSort}
            />
          </Group>
          {isLoadingEvents ? (
            <Flex justify='center'><Text>Loading events...</Text></Flex>
          ) : Array.isArray(events) && events.length === 0 ? (
            <Flex justify='center'><Text>Sorry! No events found.</Text></Flex>
          ) : (
            <EventsList
              events={events}
              activities={activities}
              intensities={intensities}
              skillLevels={skillLevels}
              currentUserId={user?._id || null}
            />
          )}
        </Box>
      )}

      {view === 'my-events' && (
        <MyEvents
          currentUserId={user?._id || null}
          selectedUpcomingSort={selectedUpcomingSort}
          setSelectedUpcomingSort={setSelectedUpcomingSort}
          selectedPastSort={selectedPastSort}
          setSelectedPastSort={setSelectedPastSort}
          activities={activities}
          intensities={intensities}
          skillLevels={skillLevels}
          upcomingEvents={upcomingMyEvents}
          pastEvents={pastMyEvents}
        />
      )}
      <Space h='xl' />
    </Container>
  );
}

export default Events;
