import React from 'react';
import { Stack, Group, Grid, Text } from '@mantine/core';
import EventCard from './EventCard';
import IconInfo from './IconInfo';
import AttendeesRatio from './AttendeesRatio';

function Event({ event }) {
  const expandEvent = () => {
    // TODO: trigger event details modal
    console.log(`Event ${event.title} expanded`);
  };
  return (
    <Grid m='md' onClick={expandEvent}>
      <Grid.Col span={3}>
        <EventCard event={event} />
      </Grid.Col>
      <Grid.Col span={9}>
        <Stack maw={900} mah={300}>
          <AttendeesRatio players={event.players} maxPlayers={event.maxPlayers} />
          <Group spacing='xs'>
            <IconInfo iconType='time' infoText={new Date(event.date).toLocaleString()} size='sm' />
            <IconInfo iconType='location' infoText={event.location} size='sm' />
            <IconInfo iconType='owner' infoText={event.owner.name} size='sm' />
          </Group>
          <div style={{ borderTop: '1px solid #e0e0e0', margin: '12px 0' }} />
          <Text size='sm'>{event.description}</Text>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

export default Event;
