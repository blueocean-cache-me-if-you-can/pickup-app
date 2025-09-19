import React from 'react';
import { Stack, ScrollArea } from '@mantine/core';
import ProfileHeadline from './ProfileHeadline';

function AttendingPlayers({ players = [] }) {
  return (
    <ScrollArea bg='gray.1' p='xs' style={{ borderRadius: '0.5rem' }}>
      <Stack>
      {players.map((player) => (
        <ProfileHeadline key={player.userId} name={player.displayName} pfp={player.photo} />
      ))}
      </Stack>
    </ScrollArea>
  );
}

export default AttendingPlayers;
