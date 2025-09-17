import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Select, Title, Flex, Text,
} from '@mantine/core';
import Event from './Event';

function MyEvents({
  currentUserId = 1,
  selectedUpcomingSort,
  setSelectedUpcomingSort,
  selectedPastSort,
  setSelectedPastSort,
}) {
  // TODO: set these states with API calls
  const [upcomingMyEvents, setUpcomingMyEvents] = useState([]);
  const [pastMyEvents, setPastMyEvents] = useState([]);

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
        {upcomingMyEvents.length === 0 ? <Text>No upcoming events.</Text> : upcomingMyEvents.map(
          (event) => (
            <Event key={event.id} event={event} />
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
        {pastMyEvents.length === 0 ? <Text>No past events.</Text> : pastMyEvents.map(
          (event) => (
            <Event key={event.id} event={event} isPast />
          ),
        )}
      </Box>
    </Stack>
  );
}

export default MyEvents;
