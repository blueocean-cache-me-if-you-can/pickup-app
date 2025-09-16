import React, { useState } from 'react';
import { Tabs, ScrollArea, Stack } from '@mantine/core';
import Event from '../components/Event';

function Events() {
  const [activeTab, setActiveTab] = useState('eventsNearMe');
  // dummy data for testing
  /*
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Sample Event',
      owner: { user_id: 4, name: 'Steve Knobs' },
      activity: { id: 1, name: 'pickleball', image: 'https://img.freepik.com/premium-vector/pickleball-vector-vector-traditional-symbol-icon-playing-pickleball_769314-451.jpg?w=826' },
      description: 'Come join us for a fun game of pickleball!',
      date: '2024-04-09T09:00:00',
      location: '123 Sports Ct, Springfield, USA',
      players: [
        { user_id: 2, name: 'Alice Wonder' },
        { user_id: 3, name: 'Bob Builder', photo: 'https://randomuser.me/api/portraits/men/75.jpg' },
        { user_id: 4, name: 'Steve Knobs' },
      ],
      maxPlayers: 8,
      photo: 'https://thepickleballprofessionals.com/wp-content/uploads/2024/02/image-4-11.jpg',
    },
    {
      id: 2,
      title: 'Sample Event 2',
      owner: { user_id: 1, name: 'John Sno' },
      activity: { id: 2, name: 'basketball', image: 'https://static.vecteezy.com/system/resources/previews/000/627/315/original/basketball-icon-symbol-sign-vector.jpg' },
      description: 'This is a sample event description for event 2.',
      date: '2024-04-10T15:00:00',
      location: '456 Court St, Springfield, USA',
      players: [
        { user_id: 2, name: 'Alice Wonder' },
        { user_id: 3, name: 'Bob Builder', photo: 'https://randomuser.me/api/portraits/men/75.jpg' },
        { user_id: 4, name: 'Steve Knobs' },
      ],
      maxPlayers: 4,
      photo: 'https://st2.depositphotos.com/1018611/8860/i/950/depositphotos_88608500-stock-photo-teenagers-playing-basketball-game-together.jpg',
    },
  ]);
  */
  return (
    <Tabs mt='md' value={activeTab} onChange={setActiveTab} variant='pills' color='lime' defaultValue='eventsNearMe'>
      <Tabs.List justify='center'>
        <Tabs.Tab value='eventsNearMe'>Events Near Me</Tabs.Tab>
        <Tabs.Tab value='myEvents'>My Events</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='eventsNearMe' pt='xs'>
        <ScrollArea>
          <Stack>
            <h4>Events Near Me Component</h4>
          </Stack>
        </ScrollArea>
      </Tabs.Panel>

      <Tabs.Panel value='myEvents' pt='xs'>
        <ScrollArea>
          <Stack>
            <h4>My Events Component</h4>
          </Stack>
        </ScrollArea>
      </Tabs.Panel>
    </Tabs>
  );
}

export default Events;
