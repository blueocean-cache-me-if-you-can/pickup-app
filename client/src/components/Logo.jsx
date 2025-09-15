import React from 'react';
import { Image, Text, Group, AspectRatio } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const LogoBase = ({showText}) => (
    <Group align="center" gap="xs">
        <AspectRatio ratio={1} w={50}>
            <Image src={logo} alt="Logo" />
        </AspectRatio>
        {showText && <Text>Pickup App</Text>}
    </Group>
)

const Logo = ({showText = false, activateLink = false}) => {
    return (
        <>
            {activateLink ? (
                <NavLink to="/events">
                   <LogoBase showText={showText} />
                </NavLink>
            ) : (
                <LogoBase showText={showText} />
            )}
        </>
    );
};

export default Logo;