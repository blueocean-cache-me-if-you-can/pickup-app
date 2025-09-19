import React, { useState } from 'react';
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  Box,
  Anchor,
  AspectRatio,
  rem,
} from '@mantine/core';
import EventCard from './EventCard';
import Event from './Event';
import IconInfo from './IconInfo';
import AttendeesRatio from './AttendeesRatio';
import useGeocodeAddress from '../hooks/useGeocodeAddress';
import AttendingPlayers from './AttendingPlayers';

function EventDetails({ event, activities, intensities, skillLevels, isPast = false }) {
  console.log('event', event);
  const [isOpen, setIsOpen] = useState(false);
  const grayscale = isPast || new Date(event.time) < new Date();
  const { lng, lat } = useGeocodeAddress(event.address);

  const modalOnClick = (e) => {
    // bug fix: prevents the event modal from triggering when edit modal opens and closes
    const el = e.currentTarget;
    const t = e.target;
    if (!(el instanceof Element) || !(t instanceof Element)) return;
    if (!el.contains(t)) return;
    if (t.closest('[data-no-expand]')) return;
    setIsOpen(true);
  }

  return (
    <>
      <Box 
        onClick={modalOnClick} 
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
            <Stack w='250px'>
                <EventCard event={event} activities={activities} intensities={intensities} skillLevels={skillLevels} />
                <IconInfo iconType='time' infoText={new Date(event.time).toLocaleString()} size={rem(11)} grayscale={grayscale} />
                <IconInfo iconType='location' infoText={event.address} size={rem(11)} grayscale={grayscale} />
                <IconInfo iconType='owner' infoText={event.owner.displayName} size={rem(11)} grayscale={grayscale} />
            </Stack>
            <Stack flex={1}>
              <AttendeesRatio
                players={event.players}
                maxPlayers={event.maxPlayers}
                grayscale={grayscale}
              />
              <Text size='sm' fw={700}>{event.title}</Text>
              <Text size='xs' fw={600}>{event.brief_description}</Text>
              <Text size='xs'>{event.description}</Text>
              <Group>
                <Stack flex={1}>
                  <Anchor size='xs' fw={600} underline='always' c='black'>{event.address}</Anchor>
                  <AspectRatio ratio={16/9} w='100%'>
                    <iframe
                      src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`}
                      width='100%'
                      height='100%'
                      title='Event location map'
                      style={{ border: 0, pointerEvents: 'none' }}
                      loading='lazy'
                      referrerPolicy='no-referrer-when-downgrade'
                      allowFullScreen
                    />
                  </AspectRatio>
                </Stack>
                <Stack flex={1}>
                  <Text size='xs' fw={600}>Players Attending</Text>
                  <AttendingPlayers players={event.players} />
                </Stack>
              </Group>
            </Stack>
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
