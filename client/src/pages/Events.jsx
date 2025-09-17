import React, { useState, useEffect } from 'react';
import {
  Container, SegmentedControl, Flex, Space, Select, Title, Box, Group, MultiSelect,
} from '@mantine/core';
import AddressPicker from '../components/AddressPicker';
import PrimaryFilter from '../components/PrimaryFilter';

function Events({ currentUserId = 1 }) {
  const [view, setView] = useState('events-near-me');

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState([]);
  const [selectedIntensity, setSelectedIntensity] = useState([]);
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [selectedSort, setSelectedSort] = useState('distance');
  const sortDirections = {
    distance: false,
    date: true,
  };
  const orderByDesc = sortDirections[selectedSort] ?? false;
  // Debugging state to view filter params being sent to backend
  const [debugParams, setDebugParams] = useState({});

  useEffect(() => {
    const filterParams = {
      user_id: view === 'my-events' ? currentUserId : null,
      finished: view === 'my-events',
      sort: selectedSort,
      orderByDesc,
      filter: [
        { activities: selectedActivities },
        { skillLevels: selectedSkillLevels },
        { intensity: selectedIntensity },
        { distance: selectedDistance },
      ],
    };

    console.log('Filter params:', filterParams);
    setDebugParams(filterParams); // Remove later
  }, [
    selectedActivities,
    selectedSkillLevels,
    selectedIntensity,
    selectedDistance,
    selectedSort,
    currentUserId,
    view,
    orderByDesc,
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
          onChange={setSelectedActivities}
        />

        <PrimaryFilter
          label='Skill Levels'
          values={['Beginner', 'Intermediate', 'Advanced']}
          onChange={setSelectedSkillLevels}
        />

        <PrimaryFilter
          label='Intensities'
          values={['Casual', 'Spirited', 'Competitive']}
          onChange={setSelectedIntensity}
        />

        <PrimaryFilter
          label='Distance'
          type='slider'
          values={[1, 5, 10, 15, 20]}
          onChange={setSelectedDistance}
        />
      </Flex>

      {view === 'events-near-me' && (
        <Group justify='space-between' mb='xl' gap='lg'>
          <AddressPicker />
          <Select
            label='Sort by'
            data={[
              { value: 'distance', label: 'Distance' },
              { value: 'date', label: 'Date' },
            ]}
            defaultValue='distance'
            onChange={setSelectedSort}
          />
        </Group>
      )}

      {view === 'my-events' && (
        <Box>
          <Title order={2} size='h4'>My Events</Title>
          <Flex justify='flex-end' mb='xl' gap='lg'>
            <Select
              label='Sort by'
              data={[
                { value: 'distance', label: 'Distance' },
                { value: 'date', label: 'Date' },
              ]}
              defaultValue='distance'
              onChange={setSelectedSort}
            />
          </Flex>
          <Title order={2} size='h4'>Past Events</Title>
          <Flex justify='flex-end' mb='xl' gap='lg'>
            <Select
              label='Sort by'
              data={[
                { value: 'distance', label: 'Distance' },
                { value: 'date', label: 'Date' },
              ]}
              defaultValue='distance'
              onChange={setSelectedSort}
            />
          </Flex>
        </Box>
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
