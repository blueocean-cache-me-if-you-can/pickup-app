import React, { useState } from 'react';
import {
  Stack, Button, Group, Text, ScrollArea, Box,
} from '@mantine/core';
import EventDetails from './EventDetails';
import Event from './Event';

function EventsList({
  currentUserId, events, activities, intensities, skillLevels, height = '70vh',
}) {
  const [page, setPage] = useState(1);
  const eventsPerPage = 5;
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIdx = (page - 1) * eventsPerPage;
  const endIdx = startIdx + eventsPerPage;
  const paginatedEvents = events.slice(startIdx, endIdx);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <Box>
      <ScrollArea h={height}>
        <Stack>
          {paginatedEvents.map((event) => (
            <Event
              key={event._id}
              event={event}
              activities={activities}
              intensities={intensities}
              skillLevels={skillLevels}
            />
          ))}
        </Stack>

      </ScrollArea>
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
