import React from 'react';
import { Group, Avatar, Text } from '@mantine/core';

function ProfileHeadline({ pfp, name }) {
  return (
    <Group>
      <Avatar src={pfp} alt={`${name}'s profile picture`} radius='xl' key={name} name={name} color='initials' />
      <Text>{name}</Text>
    </Group>
  );
}

export default ProfileHeadline;
