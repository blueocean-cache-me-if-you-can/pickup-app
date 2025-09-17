import React, { useState } from 'react';
import {
  AspectRatio, Box, Button, Image, Center,
} from '@mantine/core';
import { IconCrown } from '@tabler/icons-react';

function EventCard({ event, currentUserId = 1 }) {
  // HARDCODING DEFAULT current user_id = 1
  const [joined, setJoined] = useState(event.players.some((player) => player.user_id === currentUserId));
  const [created, setCreated] = useState(event.owner.user_id === currentUserId);

  const toggleJoin = () => {
    setJoined(!joined);
    // TODO: Call API to join/leave event
    console.log(joined ? 'Leave event clicked' : 'Join event clicked');
  };
  const editEvent = () => {
    // TODO: Call API to edit event
    console.log('Edit event clicked');
  };

  return (
    <Box maw={300} mah={300}>
      <Box pos='relative' w='100%' h='100%'>
        <AspectRatio ratio={1}>
          <Image
            src={event.photo}
            alt={event.title}
            radius='lg'
            w='100%'
            h='100%'
          />
        </AspectRatio>
        <Box pos='absolute' top={0} left={0}>
          <Image
            src={event.activity.image}
            alt={event.activity.name}
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
          {created ? <Button m='xs' variant='filled' fullWidth onClick={editEvent}>Edit</Button> : <Button m='xs' variant='filled' fullWidth onClick={toggleJoin}>{joined ? 'Leave' : 'Join'}</Button>}
        </Center>
      </Box>
    </Box>
  );
}

export default EventCard;
