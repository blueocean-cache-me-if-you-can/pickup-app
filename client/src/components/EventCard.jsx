import React, { useState } from 'react';
import {
  AspectRatio, Box, Button, Image, Center, Flex, Text,
} from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';
import EditEvent from './EditEvent';
import { updateEventPlayers } from '../api';

function EventCard({
  event, setCurrentEvent, currentUserId = 1, activities = [], intensities = [], skillLevels = [],
}) {
  const roundedDistance = Math.round(event.distance * 100) / 100;
  // console.log('event owner', event.owner.user_id);
  // console.log('currentUserId', currentUserId);
  // HARDCODING DEFAULT current user_id = 1
  const [joined, setJoined] = useState(
    event.players.some((player) => player.userId === currentUserId)
  );
  const created = event.owner.userId === currentUserId;

  const toggleJoin = async () => {
  const updatedEvent = await updateEventPlayers(event._id, currentUserId);
  // console.log('Updated event from backend:', updatedEvent);
  setCurrentEvent(updatedEvent);
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
        <Center pos='absolute' bottom={0} right={0} w='100%'>
          {created
            ? (
              <EditEvent
                event={event}
                activities={activities}
                intensities={intensities}
                skillLevels={skillLevels}
              />
            )
            : (
              <Button
                m='xs'
                data-no-expand
                variant='filled'
                fullWidth
                onClick={toggleJoin}
              >
                {event.players.some((player) => player.userId === currentUserId) ? 'Leave' : 'Join'}
              </Button>
            )}
        </Center>
      </Box>
      <Flex justify='center' align='center' mt='sm'>
        {typeof event.distance === 'number' && !isNaN(event.distance) && (
          <Text fw={800} fz='xs' ta='center'>
            {Math.round(event.distance * 100) / 100}
            &nbsp;
            miles
          </Text>
        )}
      </Flex>
    </Box>
  );
}

export default EventCard;
