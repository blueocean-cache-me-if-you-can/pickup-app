import React from 'react';
import { Group, Avatar, Text } from '@mantine/core';

function ProfileHeadline({ pfp, displayName }) {
  return (
    <Group>
      <Avatar src={pfp} alt={`${displayName}'s profile picture`} radius='xl' key={displayName} name={displayName} color='initials' />
      <Text>{displayName}</Text>
    </Group>
  );
}

export default ProfileHeadline;
