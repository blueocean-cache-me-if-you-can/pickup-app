import React, { useState, useEffect } from 'react';
import {
  Modal,
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
import AttendingPlayers from './AttendingPlayers';
import { getEventById } from '../api';

function EventDetails({
  eventId,
  activities,
  intensities,
  skillLevels,
  isPast = false,
  currentUserId,
  onRefresh,
  setCurrentEvent,
}) {
  const [event, setEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      const e = await getEventById(eventId);
      setEvent(e);
      setLng(e.coordinates[0]);
      setLat(e.coordinates[1]);
    };
    fetchEvent();
  }, [eventId]);

  const getGoogleMapsLink = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const getGrayscale = (time) => isPast || new Date(time) < new Date();
  const getMapUrl = (lng, lat) => `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`;

  const modalOnClick = (e) => {
    // bug fix: prevents the event modal from triggering when edit modal opens and closes
    const el = e.currentTarget;
    const t = e.target;
    if (!(el instanceof Element) || !(t instanceof Element)) return;
    if (!el.contains(t)) return;
    if (t.closest('[data-no-expand]')) return;
    setIsOpen(true);
  };

  if (!event) return null;


  return (
    <>
      <Box
        onClick={modalOnClick}
        style={{ cursor: 'pointer' }}
      >
        <Event
          event={event}
          setCurrentEvent={setCurrentEvent}
          activities={activities}
          intensities={intensities}
          skillLevels={skillLevels}
          isPast={isPast}
          currentUserId={currentUserId}
          onRefresh={onRefresh}
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
          <Group align='flex-start' gap='xl' wrap='nowrap' w='100%' h='100%'>
            <Stack w='250px'>
              <EventCard
                event={event}
                setCurrentEvent={setCurrentEvent}
                activities={activities}
                intensities={intensities}
                skillLevels={skillLevels}
                currentUserId={currentUserId}
                onRefresh={onRefresh}
                isPast={getGrayscale(event.time)}
              />
              <IconInfo
                iconType='time'
                infoText={new Date(event.time).toLocaleString()}
                size={rem(11)}
                grayscale={getGrayscale(event.time)}
              />
              {/*
                <IconInfo
                  iconType='location'
                  infoText={event.address}
                  size={rem(11)}
                  grayscale={grayscale}
                />
              */}
              <IconInfo
                iconType='owner'
                infoText={event.owner.displayName}
                size={rem(11)}
                grayscale={getGrayscale(event.time)}
              />
            </Stack>
            <Stack flex={1} h='100%'>
              <AttendeesRatio
                players={event.players}
                maxPlayers={event.maxPlayers}
                grayscale={getGrayscale(event.time)}
              />
              <Text size='sm' fw={700}>{event.title}</Text>
              {event.brief_description && <Text size='xs' fw={600}>{event.brief_description}</Text>}
              {event.description && <Text size='xs'>{event.description}</Text>}
              {event.additional_info && <Text size='xs'>{event.additional_info}</Text>}
              <Group align='stretch' h='100%'>
                <Stack flex={1}>

                  <Anchor
                    size='xs'
                    fw={600}
                    underline='always'
                    c='black'
                    href={getGoogleMapsLink(event.address)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {event.address}
                  </Anchor>
                  <AspectRatio ratio={16 / 9} w='100%'>
                    <iframe
                      src={getMapUrl(lng, lat)}
                      width='100%'
                      height='100%'
                      title='Event location map'
                      style={{ border: 0 }}
                      loading='lazy'
                      referrerPolicy='no-referrer-when-downgrade'
                      allowFullScreen
                    />
                  </AspectRatio>
                </Stack>
                <Stack flex={1} align='flex-start' h='100%'>
                  <Text size='xs' fw={600}>Players Attending</Text>
                  <AttendingPlayers players={event.players} />
                </Stack>
              </Group>
            </Stack>
          </Group>

          {/* <Group w='100%' justify='flex-end'>
            <Button variant='default' onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button color='dark' type='submit'>Join</Button>
          </Group> */}
        </Stack>
      </Modal>
    </>
  );
}

export default EventDetails;
