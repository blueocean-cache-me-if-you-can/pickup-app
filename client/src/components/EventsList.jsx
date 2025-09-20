import React, { useState } from 'react';
import {
  Stack, Button, Group, Text, Box,
} from '@mantine/core';
import EventDetails from './EventDetails';

function EventsList({
  currentUserId, events, activities, intensities, skillLevels, onRefresh,
}) {
  const [eventList, setEventList] = useState(events);
  const [page, setPage] = useState(1);
  const eventsPerPage = 2;
  const totalPages = Math.ceil(eventList.length / eventsPerPage);
  const startIdx = (page - 1) * eventsPerPage;
  const endIdx = startIdx + eventsPerPage;
  const paginatedEvents = eventList.slice(startIdx, endIdx);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  // Handler to update a single event in the event list
  const handleSetCurrentEvent = (updatedEvent) => {
    setEventList((prevEvents) =>
      prevEvents.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev))
    );
  };

  return (
    <Box>
      <Stack>
        {paginatedEvents.map((event) => (
          <EventDetails
            key={event._id}
            event={event}
            activities={activities}
            intensities={intensities}
            skillLevels={skillLevels}
            currentUserId={currentUserId}
            setCurrentEvent={handleSetCurrentEvent}
            onRefresh={onRefresh}
          />
        ))}
      </Stack>
      {totalPages > 1 && (
        <Group justify='center' mt='md'>
          <Button onClick={handlePrev} disabled={page === 1} variant='outline'>
            Prev
          </Button>
          <Text span weight={400}>{`Page ${page} of ${totalPages}`}</Text>
          <Button onClick={handleNext} disabled={page === totalPages} variant='outline'>
            Next
          </Button>
        </Group>
      )}
    </Box>
  );
}

export default EventsList;
