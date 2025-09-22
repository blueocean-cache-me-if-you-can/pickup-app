import React, { useState } from 'react';
import {
  AspectRatio, Box, Button, Image, Center, Flex, Text,
} from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';
import EditEvent from './EditEvent';
import { updateEventPlayers } from '../api';

function EventCard({
  event,
  currentUserId = 1,
  activities = [],
  intensities = [],
  skillLevels = [],
  onRefresh,
  setCurrentEvent,
  isPast = false,
}) {
  const [joined, setJoined] = useState(
    event.players.some((player) => player.userId === currentUserId)
  );
  const created = event.owner.userId === currentUserId;

  const toggleJoin = async () => {
    setJoined(!joined);
    const updatedEvent = await updateEventPlayers(event._id, currentUserId);
    setCurrentEvent(updatedEvent);
    onRefresh?.();
  };
  const activity = activities.find((act) => act._id === event.activityId) || {};

  return (
    <Box>
      <Box pos='relative' w='100%' h='100%'>
        <AspectRatio ratio={1}>
          <Image
            src={event.photo}
            fallbackSrc={activity.placeholderImage || 'https://placehold.co/600x400?text=Placeholder'}
            alt={event.title}
            radius='lg'
            w='100%'
            h='100%'
          />
        </AspectRatio>
        <Box pos='absolute' top={0} left={0}>
          <Image
            src={activity.image}
            fallbackSrc='https://placehold.co/600x400?text=Placeholder'
            alt={activity.name}
            style={{ borderRadius: '16px 0 16px 0', border: '2px solid #fff' }}
            w='30%'
            h='30%'
            opacity={0.8}
          />
        </Box>
        {created && (
          <Box pos='absolute' top={0} right={0} bg='lime' px='xs' py='xs' style={{ borderRadius: '0 16px 0 16px' }}>
            <IconCrown />
          </Box>
        )}
        {!isPast && (
        <Center pos='absolute' bottom={0} right={0} w='100%'>
          {created
            ? (
              <EditEvent
                event={event}
                activities={activities}
                intensities={intensities}
                skillLevels={skillLevels}
                onRefresh={onRefresh}
              />
            )
            : (
              <Button
                m='xs'
                data-no-expand
                variant='filled'
                fullWidth
                onClick={toggleJoin}
                disabled={
                  event.players.length >= event.maxPlayers &&
                  !event.players.some(
                    (player) => player.userId === currentUserId
                  )
                }
              >
                {(() => {
                  if (event.players.some((player) => player.userId === currentUserId)) return 'Leave';
                  if (event.players.length >= event.maxPlayers) return 'Full';
                  return 'Join';
                })()}
              </Button>
            )}
        </Center>
        )}
      </Box>
      <Flex justify='center' align='center' mt='sm'>
        {typeof event.distance === 'number' && !isNaN(event.distance) && (
          <Text fw={800} fz='xs' ta='center'>
            {Math.round(event.distance * 100) / 100}
            {' '}
            miles
          </Text>
        )}
      </Flex>
    </Box>
  );
}

export default EventCard;
