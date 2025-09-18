import React, { useState } from 'react';
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  Box,
} from '@mantine/core';
import Event from './Event';

function EventDetails({ event, activities, intensities, skillLevels, isPast = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Box 
        onClick={(e) => {
          const el = e.currentTarget;
          const t = e.target;
          if (!(el instanceof Element) || !(t instanceof Element)) return;
          if (!el.contains(t)) return;
          if (t.closest('[data-no-expand]')) return;
          setIsOpen(true);
        }} 
        style={{ cursor: 'pointer' }}
      >
        <Event 
            event={event} 
            activities={activities} 
            intensities={intensities} 
            skillLevels={skillLevels} 
            isPast={isPast}
        />
      </Box>

      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        size='80rem'
        radius='md'
        padding='lg'
        centered
        title={<Text fw={600}>Event Details</Text>}
        overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
      >
        <Stack align='flex-start' w='100%' mah='100%'>
          <Group align='flex-start' gap='xl' wrap='nowrap' w='100%'>
            <Box>Column 1</Box>
            <Box>Column 2</Box>
          </Group>

          <Group w='100%' justify='flex-end'>
            <Button variant='default' onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button color='dark' type='submit'>Join</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default EventDetails;
