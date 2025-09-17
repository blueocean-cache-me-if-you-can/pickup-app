import React from 'react';
import { IconUsersGroup } from '@tabler/icons-react';
import { Group, Progress } from '@mantine/core';

function AttendeesRatio({ players, maxPlayers, width = '70%' }) {
  return (
    <Group w={width} gap='xs'>
      <IconUsersGroup />
      <Progress value={Math.round((players.length / maxPlayers) * 100)} flex={1} />
    </Group>
  );
}

export default AttendeesRatio;
