import React, { useState, useEffect } from 'react';
import {
  Container, SegmentedControl, Flex, Space, Select, Title, Box, Group, Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import AddressPicker from '../components/AddressPicker';
import PrimaryFilter from '../components/PrimaryFilter';
import MyEvents from '../components/MyEvents';
import EventsList from '../components/EventsList';
// import { events } from '../data';
import { getEvents } from '../api';

function Events({
  user, activities = [], intensities = [], skillLevels = [],
}) {
  const [view, setView] = useState('events-near-me');

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState([]);
  const [selectedIntensity, setSelectedIntensity] = useState([]);
  const [selectedDistance, setSelectedDistance] = useState(20);
  const [selectedSort, setSelectedSort] = useState('distance'); // for events-near-me
  const [selectedUpcomingSort, setSelectedUpcomingSort] = useState('dateUpcoming');
  const [selectedPastSort, setSelectedPastSort] = useState('datePast');

  const form = useForm({
    initialValues: {
      address: user?.address || '',
      lat: user?.lat || null,
      lng: user?.lng || null,
    },
  });
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
  const sortDirections = React.useMemo(() => ({
    distance: false,
    dateUpcoming: false,
    datePast: true,
  }), []);
  const orderByDesc = sortDirections[selectedSort] ?? false;
  // Debugging state to view filter params being sent to backend
  const [debugParams, setDebugParams] = useState({});
  // TODO: Call API in a useEffect:
  // - GET /api/events with params above for "Events Near Me"
  // - GET /api/events with params above for "My Upcoming Events"
  // - GET /api/events with params above for "My Past Events" DO NOT APPLY FILTERS

  // State for params and last updated
  const [eventsNearMeParams, setEventsNearMeParams] = useState({});
  const [upcomingParams, setUpcomingParams] = useState({});
  const [pastParams, setPastParams] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null); // 'eventsNearMe' | 'upcoming' | 'past'
  const [events, setEvents] = useState([]); // for events-near-me
  const [upcomingMyEvents, setUpcomingMyEvents] = useState([]); // for my-events upcoming
  const [pastMyEvents, setPastMyEvents] = useState([]); // for my-events past

  // Update params when dependencies change
  useEffect(() => {
    if (view === 'events-near-me') {
      const params = {
        finished: false,
        sort: (selectedSort === 'dateUpcoming' || selectedSort === 'datePast') ? 'date' : selectedSort,
        orderByDesc,
        filter: {
          activity: activities
            .filter((activity) => selectedActivities.includes(activity.name))
            .map((a) => a._id),
          skillLevel: skillLevels
            .filter((level) => selectedSkillLevels.includes(level.name))
            .map((s) => s._id),
          intensity: intensities
            .filter((intensity) => selectedIntensity.includes(intensity.name))
            .map((i) => i._id),
          distance: selectedDistance,
        },
        coordinates: [form.values.lng, form.values.lat],
      };

      setEventsNearMeParams(params);
      setLastUpdated('eventsNearMe');
    } else if (view === 'my-events') {
      const upcoming = {
        user_id: user._id,
        finished: false,
        sort: selectedUpcomingSort === 'dateUpcoming' ? 'date' : selectedUpcomingSort,
        orderByDesc: sortDirections[selectedUpcomingSort] ?? false,
        filter: {
          activity: activities
            .filter((activity) => selectedActivities.includes(activity.name))
            .map((a) => a._id),
          skillLevel: skillLevels
            .filter((level) => selectedSkillLevels.includes(level.name))
            .map((s) => s._id),
          intensity: intensities
            .filter((intensity) => selectedIntensity.includes(intensity.name))
            .map((i) => i._id),
          distance: selectedDistance,
        },
      };

      const past = {
        user_id: user._id,
        finished: true,
        sort: selectedPastSort === 'datePast' ? 'date' : selectedPastSort,
        orderByDesc: sortDirections[selectedPastSort] ?? true,
        filter: {
          activity: [],
          skillLevel: [],
          intensity: [],
          distance: 20,
        },
      };

      setUpcomingParams(upcoming);
      setPastParams(past);
      setLastUpdated('upcoming');
    }
  }, [
    activities,
    intensities,
    skillLevels,
    selectedActivities,
    selectedSkillLevels,
    selectedIntensity,
    selectedDistance,
    selectedSort,
    selectedUpcomingSort,
    selectedPastSort,
    user,
    view,
    orderByDesc,
    sortDirections,
    form.values.address,
    form.values.lat,
    form.values.lng,
  ]);
  // Call getEvents when params change
  useEffect(() => {
    async function fetchEvents() {
      try {
        let params;
        if (lastUpdated === 'eventsNearMe') {
          params = eventsNearMeParams;
        } else if (lastUpdated === 'upcoming') {
          params = upcomingParams;
        } else if (lastUpdated === 'past') {
          params = pastParams;
        }

        console.log('Fetching events with params:', params);

        const res = await getEvents(params);

        console.log('Response from getEvents:', res); //

        if (lastUpdated === 'eventsNearMe') setEvents(res);
        else if (lastUpdated === 'upcoming') setUpcomingMyEvents(res);
        else if (lastUpdated === 'past') setPastMyEvents(res);
      } catch (err) {
        console.error('Error fetching events:', err);
        if (lastUpdated === 'eventsNearMe') setEvents([]);
        else if (lastUpdated === 'upcoming') setUpcomingMyEvents([]);
        else if (lastUpdated === 'past') setPastMyEvents([]);
      }
    }

    fetchEvents();
  }, [eventsNearMeParams, upcomingParams, pastParams, lastUpdated]);

  useEffect(() => {
    setDebugParams({
      'Events Near Me': eventsNearMeParams,
      'My Upcoming Events': upcomingParams,
      'My Past Events': pastParams,
    });
  }, [eventsNearMeParams, upcomingParams, pastParams]);

  return (
    <Container size='lg'>
      <Space h='md' />

      {/* View toggle & filter */}
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
          values={activities.map((a) => a.name)}
          value={selectedActivities}
          onChange={setSelectedActivities}
        />

        <PrimaryFilter
          label='Skill Levels'
          values={skillLevels.map((level) => level.name)}
          value={selectedSkillLevels}
          onChange={setSelectedSkillLevels}
        />

        <PrimaryFilter
          label='Intensities'
          values={intensities.map((i) => i.name)}
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
              onChange={(val) => form.setFieldValue('address', val)}
              onResolved={({ address, lat, lng }) => {
                if (address && address !== form.values.address) {
                  form.setFieldValue('address', address);
                }
                form.setFieldValue('lat', lat);
                form.setFieldValue('lng', lng);
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
          {Array.isArray(events) && events.length === 0 ? <Text>No events found.</Text> : (
            <EventsList
              events={events}
              activities={activities}
              intensities={intensities}
              skillLevels={skillLevels}
              currentUserId={user._id}
            />
          )}
        </Box>
      )}

      {view === 'my-events' && (
        <MyEvents
          currentUserId={user._id}
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

      {/* debug my filter params here:  */}

      <pre style={{ background: '#f5f5f5', padding: '1rem', fontSize: '12px' }}>
        {JSON.stringify(debugParams, null, 2)}
      </pre>
      <Space h='xl' />
    </Container>
  );
}

export default Events;
