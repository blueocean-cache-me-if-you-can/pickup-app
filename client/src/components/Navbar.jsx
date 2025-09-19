import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Group, Divider, Text, Menu,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Logo from './Logo';
import CreateEvent from './CreateEvent';
import ProfileHeadline from './ProfileHeadline';

function Navbar({
  user, setUser, activities, skillLevels, intensities,
}) {
  const navigate = useNavigate();
  return (
    <Group justify='space-between' h='100%' p='0 20px'>
      <Logo activateLink />
      <Group>
        <CreateEvent
          user={user}
          activities={activities}
          skillLevels={skillLevels}
          intensities={intensities}
        />
        <Divider orientation='vertical' />
        <Menu shadow='md' width={200}>
          <Menu.Target>
            <Group gap='xs' style={{ cursor: 'pointer' }}>
              <ProfileHeadline name={user.displayName || user.firstName} pfp={user.photo} />
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
            <Menu.Item onClick={() => {
              setUser(null);
              navigate('/login', { replace: true });
            }}
            >
              <Text size='sm' c='red'>Logout</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}

export default Navbar;
