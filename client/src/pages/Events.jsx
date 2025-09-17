import React, { useState, useEffect } from 'react';
import {
  Container, SegmentedControl, Flex, Space, Select, Title, Box, Group,
} from '@mantine/core';
import AddressPicker from '../components/AddressPicker';
import PrimaryFilter from '../components/PrimaryFilter';
import MyEvents from '../components/MyEvents';
import Event from '../components/Event';
import { events } from '../data';

function Events({ currentUserId = 1, activities = [], intensities = [], skillLevels = [] }) {
  const [view, setView] = useState('events-near-me');

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState([]);
  const [selectedIntensity, setSelectedIntensity] = useState([]);
  const [selectedDistance, setSelectedDistance] = useState(20);
  const [selectedSort, setSelectedSort] = useState('distance'); // for events-near-me
  const [selectedUpcomingSort, setSelectedUpcomingSort] = useState('dateUpcoming');
  const [selectedPastSort, setSelectedPastSort] = useState('datePast');

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

  useEffect(() => {
    // Events Near Me params
    let eventsNearMeParams = {};
    let upcomingParams = {};
    let pastParams = {};
    if (view === 'events-near-me') {
      eventsNearMeParams = {
        user_id: null,
        finished: false,
        sort: (selectedSort === 'dateUpcoming' || selectedSort === 'datePast') ? 'date' : selectedSort,
        orderByDesc,
        filter: [
          { activities: selectedActivities },
          { skillLevels: selectedSkillLevels },
          { intensity: selectedIntensity },
          { distance: selectedDistance },
        ],
      };
      upcomingParams = {};
      pastParams = {};
    }
    if (view === 'my-events') {
    // My Upcoming Events params
      upcomingParams = {
        user_id: currentUserId,
        finished: false,
        sort: selectedUpcomingSort === 'dateUpcoming' ? 'date' : selectedUpcomingSort,
        orderByDesc: sortDirections[selectedUpcomingSort] ?? false,
        filter: [
          { activities: selectedActivities },
          { skillLevels: selectedSkillLevels },
          { intensity: selectedIntensity },
          { distance: selectedDistance },
        ],
      };

      // My Past Events params
      pastParams = {
        user_id: currentUserId,
        finished: true,
        sort: selectedPastSort === 'datePast' ? 'date' : selectedPastSort,
        orderByDesc: sortDirections[selectedPastSort] ?? true,
        filter: [
          { activities: [] },
          { skillLevels: [] },
          { intensity: [] },
          { distance: 20 },
        ],
      };
      eventsNearMeParams = {};
    }
    setDebugParams({
      'Events Near Me': eventsNearMeParams,
      'My Upcoming Events': upcomingParams,
      'My Past Events': pastParams,
    });
  }, [
    selectedActivities,
    selectedSkillLevels,
    selectedIntensity,
    selectedDistance,
    selectedSort,
    selectedUpcomingSort,
    selectedPastSort,
    currentUserId,
    view,
    orderByDesc,
    sortDirections,
  ]);

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
          values={['Pickleball', 'Volleyball', 'Basketball', 'Ultimate Frisbee', 'Kickball']}
          value={selectedActivities}
          onChange={setSelectedActivities}
        />

        <PrimaryFilter
          label='Skill Levels'
          values={['Beginner', 'Intermediate', 'Advanced']}
          value={selectedSkillLevels}
          onChange={setSelectedSkillLevels}
        />

        <PrimaryFilter
          label='Intensities'
          values={['Casual', 'Spirited', 'Competitive']}
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
            <AddressPicker />
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
          <Box>
            {events.map((event) => (
              <Event
                event={event}
                key={event.id}
                activities={activities}
                intensities={intensities}
                skillLevels={skillLevels}
              />
            ))}
          </Box>
        </Box>
      )}

      {view === 'my-events' && (
        <MyEvents
          currentUserId={currentUserId}
          selectedUpcomingSort={selectedUpcomingSort}
          setSelectedUpcomingSort={setSelectedUpcomingSort}
          selectedPastSort={selectedPastSort}
          setSelectedPastSort={setSelectedPastSort}
          activities={activities}
          intensities={intensities}
          skillLevels={skillLevels}
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
