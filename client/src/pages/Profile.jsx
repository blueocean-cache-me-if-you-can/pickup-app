// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Text,
  Container,
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
  Slider,
  Box,
  Title,
  Stack,
  Divider,
  Space,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import PhotoPicker from '../components/PhotoPicker';
import AddressPicker from '../components/AddressPicker';

export default function Profile({ activities = [], skillLevels = [] }) {
  const [selectedSports, setSelectedSports] = useState({});
  const [showFirstLoginMsg, setShowFirstLoginMsg] = useState(false);

  // TODO: Remove placeholder data when backend is ready
  const placeholderActivities = [
    { id: '301', name: 'Pickleball' },
    { id: '302', name: 'Volleyball' },
    { id: '303', name: 'Basketball' },
    { id: '304', name: 'Ultimate Frisbee' },
    { id: '305', name: 'Kickball' },
  ];

  const placeholderSkillLevels = [
    { id: '501', name: 'Beginner', displayOrder: 1 },
    { id: '502', name: 'Intermediate', displayOrder: 2 },
    { id: '503', name: 'Expert', displayOrder: 3 },
  ];

  const activitiesToUse = activities.length > 0 ? activities : placeholderActivities;
  const skillLevelsToUse = skillLevels.length > 0 ? skillLevels : placeholderSkillLevels;

  useEffect(() => {
    if (localStorage.getItem('firstLogin') === 'true') {
      setShowFirstLoginMsg(true);
    }
  }, []);

  const form = useForm({
    initialValues: {
      displayName: '',
      firstName: '',
      lastName: '',
      preferredAddress: '',
      email: '',
      password: '',
      photo: null,
      sports: {},
    },

    validate: {
      firstName: (value) => (!value ? 'First name required' : null),
      lastName: (value) => (!value ? 'Last name required' : null),
      preferredAddress: (value) => (!value ? 'Preferred addr' : null),
      email: (value) => {
        if (/^\S+@\S+$/.test(value)) {
          return null;
        }
        return 'Please enter a valid email';
      },
      password: (value) => {
        if (value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return null;
      },
    },
  });

  const toggleSport = (sport) => {
    setSelectedSports((prev) => {
      const updated = { ...prev };
      if (updated[sport]) {
        delete updated[sport];
      } else {
        updated[sport] = 1;
      }
      return updated;
    });
  };

  const handleSkillChange = (sport, value) => {
    setSelectedSports((prev) => ({ ...prev, [sport]: value }));
  };

  const handleSubmit = (values) => {
    if (localStorage.getItem('firstLogin') === 'true') {
      localStorage.removeItem('firstLogin');
      setShowFirstLoginMsg(false);
    }

    console.log('Form submitted:', { ...values, sports: selectedSports });
  };

  return (
    <Container size={500}>
      <Space h='lg' />
      {showFirstLoginMsg && (
        <Alert variant='light' color='teal' title='Info Needed' icon={<IconInfoCircle size={20} />}>
          <Text size='xs'>Please fill out the required fields in your profile.</Text>
        </Alert>
      )}

      <Space h='lg' />
      <Title order={1} size='h2'>Profile</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* User Info */}
        <Title order={2} size='h4'>User Info</Title>
        <Stack>
          {/* Photo Picker */}
          <PhotoPicker
            value={form.values.photo}
            onChange={(file) => form.setFieldValue('photo', file)}
          />

          {/* Display Name */}
          <TextInput
            label='Display Name'
            placeholder='Enter display name'
            {...form.getInputProps('displayName')}
          />

          {/* First Name */}
          <TextInput
            withAsterisk
            label='First Name'
            placeholder='Enter first name'
            {...form.getInputProps('firstName')}
          />

          {/* Last Name */}
          <TextInput
            withAsterisk
            label='Last Name'
            placeholder='Enter last name'
            {...form.getInputProps('lastName')}
          />

          {/* Preferred Address */}
          <AddressPicker />
        </Stack>

        <Space h='md' />
        <Divider my='sm' />
        <Space h='md' />

        {/* Activity Info */}
        <Title order={2} mb='sm' size='h4'>Activity Info</Title>
        <Stack>
          {activitiesToUse.map((activity) => (
            <Box key={activity.id}>
              <Checkbox
                label={activity.name}
                checked={!!selectedSports[activity.id]}
                onChange={() => toggleSport(activity.id)}
                size='xs'
              />
              {selectedSports[activity.id] && (
                <Box mt='lg' mb='lg'>
                  <Slider
                    color='teal'
                    size='md'
                    min={1}
                    max={3}
                    step={1}
                    value={selectedSports[activity.key]}
                    onChange={(val) => handleSkillChange(activity.id, val)}
                    marks={skillLevelsToUse.map((level) => ({
                      value: parseInt(level.displayOrder, 10), label: level.name,
                    }))}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Stack>

        <Space h='md' />
        <Divider my='sm' />
        <Space h='md' />

        {/* Account Info */}
        <Title order={2} size='h4'>Account Info</Title>
        <Stack>
          {/* Email */}
          <TextInput
            withAsterisk
            label='Primary Email'
            placeholder='Enter email'
            {...form.getInputProps('email')}
          />

          {/* Password */}
          <PasswordInput
            withAsterisk
            label='Password'
            placeholder='Enter password'
            {...form.getInputProps('password')}
          />
        </Stack>

        <Space h='md' />
        <Divider my='sm' />
        <Space h='md' />

        <Button fullWidth type='submit'>Save Profile</Button>
      </form>

      <Space h='xl' />
    </Container>
  );
}
