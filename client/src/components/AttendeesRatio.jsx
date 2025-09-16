import React from 'react';
import { IconUsersGroup } from '@tabler/icons-react';
import { Group, Progress, Text } from '@mantine/core';

function AttendeesRatio({ players, maxPlayers }) {
  return (
    <Group style={{ minWidth: 0, flexGrow: 1 }} gap='xs'>
      <IconUsersGroup />
      <Text size='sm'>
        {players.length}
        /
        {maxPlayers}
      </Text>
      <Progress value={Math.round((players.length / maxPlayers) * 100)} flex={1} />
    </Group>
  );
}

export default AttendeesRatio;
