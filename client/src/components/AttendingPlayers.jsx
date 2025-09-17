import React from 'react';
import { Stack } from '@mantine/core';
import ProfileHeadline from './ProfileHeadline';

function AttendingPlayers({ players = [] }) {
  return (
    <Stack>
      {players.map((player) => (
        <ProfileHeadline key={player.user_id} name={player.name} pfp={player.photo} />
      ))}
    </Stack>
  );
}

export default AttendingPlayers;
