import React from 'react';
import { IconUsersGroup } from '@tabler/icons-react';
import { Group, Progress, Text } from '@mantine/core';

function AttendeesRatio({ players, maxPlayers, grayscale = false }) {
  return (
    <Group style={{ minWidth: 0, flexGrow: 1 }} gap='xs'>
      <IconUsersGroup stroke={grayscale ? '#888' : undefined} />
      <Text size='sm' style={{ color: grayscale ? '#888' : undefined }}>
        {players.length}
        /
        {maxPlayers}
      </Text>
      <Progress value={Math.round((players.length / maxPlayers) * 100)} flex={1} />
    </Group>
  );
}

export default AttendeesRatio;
