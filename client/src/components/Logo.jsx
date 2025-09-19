import React from 'react';
import {
  Image, Text, Group, AspectRatio,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

function LogoBase({ showText }) {
  return (
    <Group align='center' gap='xs'>
      <AspectRatio ratio={1} w={50}>
        <Image src={logo} alt='Logo' />
      </AspectRatio>
      {showText && <Text>PicknRoll</Text>}
    </Group>
  );
}

function Logo({ showText = false, activateLink = false }) {
  if (activateLink) {
    return (
      <NavLink to='/events'>
        <LogoBase showText={showText} />
      </NavLink>
    );
  }
  return <LogoBase showText={showText} />;
}

export default Logo;
