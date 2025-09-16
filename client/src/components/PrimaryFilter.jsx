import React, { useState, useEffect } from 'react';
import {
  Menu,
  Button,
  Checkbox,
  Space,
  Flex,
  Slider,
  Text,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

function PrimaryFilter({
  label, values, onChange, type = 'checkbox',
}) {
  const [menuOpened, setMenuOpened] = useState(false);

  // Initial committed value
  const initialSelected = type === 'checkbox' ? values : Math.max(...values);
  const [committed, setCommitted] = useState(initialSelected);
  const [selected, setSelected] = useState(initialSelected);

  // Whenever committed changes, bubble it up to parent
  useEffect(() => {
    onChange(committed);
  }, [committed]);

  const toggleValue = (value) => {
    if (type !== 'checkbox') return;
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newSelected);
  };

  const handleReset = () => {
    const resetValue = type === 'checkbox' ? values : Math.max(...values);
    setSelected(resetValue);
  };

  const handleViewResults = () => {
    setCommitted(selected);
    setMenuOpened(false);
  };

  return (
    <Menu
      shadow='md'
      width={350}
      opened={menuOpened}
      onChange={setMenuOpened}
      onClose={() => {
        setTimeout(() => {
          setSelected(committed);
        }, 200);
      }}
    >
      <Menu.Target>
        <Button variant='outline' color='dark'>
          {label}
          <IconChevronDown size={24} />
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Space h='xs' />

        {type === 'checkbox'
        && values.map((val) => (
          <Menu.Item key={val} closeMenuOnClick={false}>
            <Checkbox
              color='teal'
              checked={selected.includes(val)}
              onChange={() => toggleValue(val)}
              label={val}
            />
          </Menu.Item>
        ))}

        {type === 'slider' && (
          <Flex direction='column' px='sm' mt='lg' mb='lg'>
            <Text size='xs' mb='md'>
              Within
              {selected}
              miles of my location
            </Text>
            <Slider
              value={selected}
              onChange={setSelected}
              min={Math.min(...values)}
              max={Math.max(...values)}
              step={1}
              marks={values.map((val) => ({ value: val, label: val.toString() }))}
            />
          </Flex>
        )}

        <Space h='xs' />
        <Menu.Divider />
        <Space h='xs' />

        <Flex gap='sm' justify='center' px='sm'>
          <Button
            color='teal'
            variant='transparent'
            onClick={handleReset}
            disabled={
              type === 'checkbox'
                ? selected.length === values.length
                : selected === Math.max(...values)
            }
          >
            Reset
          </Button>
          <Button color='teal' onClick={handleViewResults}>
            View Results
          </Button>
        </Flex>

        <Space h='xs' />
      </Menu.Dropdown>
    </Menu>
  );
}

export default PrimaryFilter;
