import React from 'react';
import {
  Box, Stack, Select, Title, Flex, Text,
} from '@mantine/core';
import EventsList from './EventsList';
import { upcomingMyEvents, pastMyEvents } from '../data';

function MyEvents({
  currentUserId = 1,
  upcomingEvents = upcomingMyEvents,
  pastEvents = pastMyEvents,
  selectedUpcomingSort,
  setSelectedUpcomingSort,
  selectedPastSort,
  setSelectedPastSort,
  activities = [],
  intensities = [],
  skillLevels = [],
  onRefresh,
}) {
  // TODO: set these states with API calls
  // const [upcomingEvents, setUpcomingEvents] = useState([...upcomingMyEvents]);
  // const [pastEvents, setPastEvents] = useState([...pastMyEvents]);

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
        {upcomingEvents.length === 0 ? <Text>No upcoming events.</Text> : (
          <EventsList
            currentUserId={currentUserId}
            events={upcomingEvents}
            activities={activities}
            intensities={intensities}
            skillLevels={skillLevels}
            height='35vh'
            onRefresh={onRefresh}
          />
        )}
      </Box>
      <Box>
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
        {pastEvents.length === 0 ? <Text>No past events.</Text> : (
          <EventsList
            currentUserId={currentUserId}
            events={pastEvents}
            activities={activities}
            intensities={intensities}
            skillLevels={skillLevels}
            height='35vh'
            onRefresh={onRefresh}
          />
        )}
      </Box>
    </Stack>
  );
}

export default MyEvents;
