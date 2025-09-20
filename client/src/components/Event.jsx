import React from 'react';
import {
  Stack, Group, Grid, Text,
} from '@mantine/core';
import EventCard from './EventCard';
import IconInfo from './IconInfo';
import AttendeesRatio from './AttendeesRatio';

function Event({
  currentUserId, event, activities, intensities, skillLevels, isPast = false,
}) {
  const expandEvent = () => {
    // TODO: trigger event details modal
    console.log(`Event ${event.title} expanded`);
  };
  const grayscale = isPast || new Date(event.time) < new Date();
  const street = event.address.split(',')[0];
  return (
    <div style={{ filter: grayscale ? 'grayscale(100%)' : 'none' }}>
      <Grid m='md' onClick={expandEvent} align='center'>
        <Grid.Col span={3}>
          <EventCard
            event={event}
            activities={activities}
            intensities={intensities}
            skillLevels={skillLevels}
            currentUserId={currentUserId}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          <Stack gap='xs'>
            <AttendeesRatio
              players={event.players}
              maxPlayers={event.maxPlayers}
              grayscale={grayscale}
            />
            <Group spacing='xs'>
              <IconInfo iconType='time' infoText={new Date(event.time).toLocaleString()} size='sm' grayscale={grayscale} />
              <IconInfo iconType='location' infoText={street} size='sm' grayscale={grayscale} />
              <IconInfo iconType='owner' infoText={event.owner.displayName} size='sm' grayscale={grayscale} />
            </Group>
            <div style={{ borderTop: '1px solid #e0e0e0', margin: '12px 0' }} />
            <Text fw={700} size='lg' style={{ color: grayscale ? '#888' : undefined }}>{event.title}</Text>
            <Text size='sm' style={{ color: grayscale ? '#888' : undefined }}>{event.brief_description}</Text>
            <Group>
              <Text size='xs' style={{ color: grayscale ? '#888' : undefined }}>
                Intensity:
                {' '}
                {intensities.find((intensity) => intensity._id === event.intensityId)?.name || 'N/A'}
              </Text>
              <Text size='xs' style={{ color: grayscale ? '#888' : undefined }}>
                Skill Level:
                {' '}
                {skillLevels.find((skillLevel) => skillLevel._id === event.skillId)?.name || 'N/A'}
              </Text>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default Event;
