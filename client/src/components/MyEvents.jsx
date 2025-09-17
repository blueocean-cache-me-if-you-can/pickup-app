import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Select, Title, Flex, Text,
} from '@mantine/core';
import Event from './Event';
import { upcomingMyEvents, pastMyEvents } from '../data';

function MyEvents({
  currentUserId = 1,
  selectedUpcomingSort,
  setSelectedUpcomingSort,
  selectedPastSort,
  setSelectedPastSort,
  activities = [],
  intensities = [],
  skillLevels = [],
}) {
  // TODO: set these states with API calls
  const [upcomingEvents, setUpcomingEvents] = useState([...upcomingMyEvents]);
  const [pastEvents, setPastEvents] = useState([...pastMyEvents]);

  return (
    <Stack>
      <Box>
        <Flex justify='space-between' mb='xl' gap='lg'>
          <Title order={2} tt='uppercase'>My Events</Title>
          <Select
            label='Sort by'
            data={[
              { value: 'distance', label: 'Distance' },
              { value: 'dateUpcoming', label: 'Date' },
            ]}
            value={selectedUpcomingSort}
            onChange={setSelectedUpcomingSort}
          />
        </Flex>
        {upcomingEvents.length === 0 ? <Text>No upcoming events.</Text> : upcomingEvents.map(
          (event) => (
            <Event key={event.id} event={event} activities={activities} intensities={intensities} skillLevels={skillLevels} />
          ),
        )}
        <Flex justify='space-between' mb='xl' gap='lg'>
          <Title order={2} tt='uppercase'>Past Events</Title>
          <Select
            label='Sort by'
            data={[
              { value: 'distance', label: 'Distance' },
              { value: 'datePast', label: 'Date' },
            ]}
            value={selectedPastSort}
            onChange={setSelectedPastSort}
          />
        </Flex>
        {pastEvents.length === 0 ? <Text>No past events.</Text> : pastEvents.map(
          (event) => (
            <Event key={event.id} event={event} isPast activities={activities} intensities={intensities} skillLevels={skillLevels} />
          ),
        )}
      </Box>
    </Stack>
  );
}

export default MyEvents;
