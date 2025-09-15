import React, { useState } from 'react';
import {
  AspectRatio, Box, Button, Image, Center,
} from '@mantine/core';

function EventCard({ event }) {
  /*
  event={
    id: 1,
    title: 'Sample Event',
    owner: { user_id: 1, name: 'John' },
    sport: { id: 1, name: 'pickleball', image: 'https://img.freepik.com/premium-vector/pickleball-vector-vector-traditional-symbol-icon-playing-pickleball_769314-451.jpg?w=826' },
    players: [
      { user_id: 1, name: 'John' },
      { user_id: 2, name: 'Alice' },
      { user_id: 3, name: 'Bob' },
    ],
    photo: 'https://thepickleballprofessionals.com/wp-content/uploads/2024/02/image-4-11.jpg',
  } FOR CREATOR MODE
  OR
  event={
    id: 1,
    title: 'Sample Event',
    owner: { user_id: 4, name: 'Steve' },
    sport: { id: 1, name: 'pickleball', image: 'https://img.freepik.com/premium-vector/pickleball-vector-vector-traditional-symbol-icon-playing-pickleball_769314-451.jpg?w=826' },
    players: [
      { user_id: 2, name: 'Alice' },
      { user_id: 3, name: 'Bob' },
      { user_id: 4, name: 'Steve' },
    ],
    photo: 'https://thepickleballprofessionals.com/wp-content/uploads/2024/02/image-4-11.jpg',
  } FOR PARTICIPANT MODE
  */
  // current user_id = 1 (John)
  const [joined, setJoined] = useState(event.players.some((player) => player.user_id === 1));
  const [created, setCreated] = useState(event.owner.user_id === 1);

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
    <Box w={300} h={300}>
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
        <Box pos='absolute' top={0} left={0} zIndex={2}>
          <Image
            src={event.sport.image}
            alt={event.sport.name}
            style={{ borderRadius: '16px 0 16px 0', border: '2px solid #fff' }}
            w='30%'
            h='30%'
            opacity={0.8}
          />
        </Box>
        <Center pos='absolute' bottom={0} right={0} zIndex={2} w='100%'>
          {created ? <Button m='xs' variant='filled' fullWidth onClick={editEvent}>Edit</Button> : <Button m='xs' variant='filled' fullWidth onClick={toggleJoin}>{joined ? 'Leave' : 'Join'}</Button>}
        </Center>
      </Box>
    </Box>
  );
}

export default EventCard;
