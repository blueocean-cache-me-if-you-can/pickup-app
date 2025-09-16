import React, { useState } from 'react';
import { Center, Tabs, ScrollArea, Stack } from '@mantine/core';

function Events() {
  const [activeTab, setActiveTab] = useState('eventsNearMe');

  return (
    <Center mt='md'>
      <Tabs value={activeTab} onChange={setActiveTab} variant='pills' color='lime' defaultValue='eventsNearMe'>
        <Tabs.List>
          <Tabs.Tab value='eventsNearMe'>Events Near Me</Tabs.Tab>
          <Tabs.Tab value='myEvents'>My Events</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='eventsNearMe' pt='xs'>
          <ScrollArea>
            <Stack>
              <div>Events Near Me Component</div>
            </Stack>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value='myEvents' pt='xs'>
          <ScrollArea>
            <Stack>
              <div>My Events Component</div>
            </Stack>
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>
    </Center>
  );
}

export default Events;
