import React from 'react';
import { Stack, Group, Grid, Text } from '@mantine/core';
import EventCard from './EventCard';
import IconInfo from './IconInfo';
import AttendeesRatio from './AttendeesRatio';

function Event({ event, isPast = false }) {
  const expandEvent = () => {
    // TODO: trigger event details modal
    console.log(`Event ${event.title} expanded`);
  };
  const grayscale = isPast || new Date(event.date) < new Date();
  const street = event.location.split(',')[0];
  return (
    <div style={{ filter: grayscale ? 'grayscale(100%)' : 'none' }}>
      <Grid m='md' onClick={expandEvent}>
        <Grid.Col span={3}>
          <EventCard event={event} />
        </Grid.Col>
        <Grid.Col span={9}>
          <Stack maw={900} mah={300}>
            <AttendeesRatio
              players={event.players}
              maxPlayers={event.maxPlayers}
              grayscale={grayscale}
            />
            <Group spacing='xs'>
              <IconInfo iconType='time' infoText={new Date(event.date).toLocaleString()} size='sm' grayscale={grayscale} />
              <IconInfo iconType='location' infoText={street} size='sm' grayscale={grayscale} />
              <IconInfo iconType='owner' infoText={event.owner.name} size='sm' grayscale={grayscale} />
            </Group>
            <div style={{ borderTop: '1px solid #e0e0e0', margin: '12px 0' }} />
            <Text fw={700} size='lg' style={{ color: grayscale ? '#888' : undefined }}>{event.title}</Text>
            <Text size='sm' style={{ color: grayscale ? '#888' : undefined }}>{event.description}</Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default Event;
