import React from 'react';
import {
  Group, Divider, Text, Menu,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { CreateEvent } from './CreateEvent';

function Navbar({
  setSessionId, activities, skillLevels, intensities,
}) {
  return (
    <Group justify='space-between' h='100%' p='0 20px'>
      <Logo activateLink />
      <Group>
        <CreateEvent activities={activities} skillLevels={skillLevels} intensities={intensities} />
        <Divider orientation='vertical' />
        <Menu shadow='md' width={200}>
          <Menu.Target>
            <Group gap='xs' style={{ cursor: 'pointer' }}>
              <Text size='sm'>
                {/* TODO: Replace with actual username */}
                Username
              </Text>
              <IconChevronDown size={24} />
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item component={Link} to='/events'>
              <Text size='sm'>Events</Text>
            </Menu.Item>
            <Menu.Item component={Link} to='/profile'>
              <Text size='sm'>Profile</Text>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={() => setSessionId(null)}>
              <Text size='sm' c='red'>Logout</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}

export default Navbar;
