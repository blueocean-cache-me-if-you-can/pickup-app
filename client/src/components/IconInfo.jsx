import React from 'react';
import {
  IconClockHour4Filled, IconLocationFilled, IconUserFilled, IconFileUnknownFilled,
} from '@tabler/icons-react';
import { Group, Text, AspectRatio } from '@mantine/core';

function IconInfo({
  iconType, infoText, size = 'sm', grayscale = false,
}) {
  let IconComponent;
  switch (iconType) {
    case 'time':
      IconComponent = IconClockHour4Filled;
      break;
    case 'location':
      IconComponent = IconLocationFilled;
      break;
    case 'owner':
      IconComponent = IconUserFilled;
      break;
    default:
      IconComponent = IconFileUnknownFilled;
  }
  return (
    <Group h={size} style={{ minWidth: 0, flexGrow: 1 }}>
      <AspectRatio ratio={1} w={size} style={{ minWidth: 0 }}>
        <IconComponent style={{ width: '100%', height: '100%', minWidth: '16px', fill: grayscale ? '#888' : undefined }} />
      </AspectRatio>
      <Text size={size} tt='uppercase' style={{ minWidth: 0, flexGrow: 1, color: grayscale ? '#888' : undefined }}>{infoText}</Text>
    </Group>
  );
}

export default IconInfo;
