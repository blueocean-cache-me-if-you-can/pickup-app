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
  Box,
  Title,
  Stack,
  Divider,
  Space,
  Select,
  MantineProvider,
  createTheme,
  Group,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import PhotoPicker from '../components/PhotoPicker';
import AddressPicker from '../components/AddressPicker';
import { updateUser } from '../api';
import useImageUpload from '../hooks/useImageUpload';

export default function Profile({ user, setUser, activities, skillLevels }) {
  const [selectedSports, setSelectedSports] = useState({});
  const [showFirstLoginMsg, setShowFirstLoginMsg] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('firstLogin') === 'true') {
      setShowFirstLoginMsg(true);
    }
  }, []);

  const form = useForm({
    initialValues: {
      displayName: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      preferredAddress: user?.address || '',
      email: user?.emailPrimary || '',
      password: '',
      photo: null,
      sports: user?.activities || {},
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
        if (!editPassword) return null;
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        displayName: user.displayName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        preferredAddress: user.address || '',
        email: user.emailPrimary || '',
        sports: user.activities || {},
      });

      // Transform activities array into selectedSports object
      const initialSports = {};
      (user.activities || []).forEach((act) => {
        const skillLevel = skillLevels.find((level) => level._id === act.skillLevelId);
        if (skillLevel) {
          initialSports[act.activityId] = skillLevel.name;
        }
      });
      setSelectedSports(initialSports);
    }
  }, [user, skillLevels]);

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

  const { uploadEventImage } = useImageUpload();

  const handleSubmit = async (values) => {
    const imageUrl = values.photo
      ? await uploadEventImage(values.photo, { maxSizeMB: 25 })
      : '';

    const activitiesArray = Object.entries(selectedSports)
      .map(([activityId, skillLevelName]) => {
        const skillLevel = skillLevels.find((lvl) => lvl.name === skillLevelName);
        if (!skillLevel) return null; // skip invalid entries
        return {
          activityId,
          skillLevelId: skillLevel._id,
        };
      })
      .filter(Boolean);

    const payload = {
      displayName: values.displayName,
      firstName: values.firstName,
      lastName: values.lastName,
      emailPrimary: values.email,
      address: values.preferredAddress,
      photo: imageUrl,
      activities: activitiesArray,
      ...(editPassword && values.password ? { password: values.password } : {}),
    };

    console.log(payload);

    try {
      const updated = await updateUser(user._id, payload);
      console.log('User updated successfully:', updated);

      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setEditPassword(false);
      form.setFieldValue('password', '');
      if (localStorage.getItem('firstLogin') === 'true') {
        localStorage.removeItem('firstLogin');
        setShowFirstLoginMsg(false);
      }
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const theme = createTheme({
    cursorType: 'pointer',
  });

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
            size={120}
            value={form.values.photo}
            onChange={(file) => form.setFieldValue('photo', file)}
            onError={(msg) => form.setFieldError('photo', msg)}
            maxSizeMB={5}
            style={{ flex: '0 0 160px' }}
            mode='profile'
            initialUrl={user?.photo || null}
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
          {activities.map((activity) => (
            <Box key={activity._id}>
              <Group align='center' grow>
                <MantineProvider theme={theme}>
                  <Checkbox
                    color='teal'
                    label={activity.name}
                    checked={!!selectedSports[activity._id]}
                    onChange={() => toggleSport(activity._id)}
                    size='xs'
                  />
                </MantineProvider>
                {selectedSports[activity._id] && (
                  <Box>
                    <Select
                      size='xs'
                      placeholder='Select skill level'
                      value={selectedSports[activity._id] || ''}
                      onChange={(val) => handleSkillChange(activity._id, val)}
                      data={skillLevels.map((level) => ({
                        value: level.name,
                        label: level.name,
                      }))}
                    />
                  </Box>
                )}
              </Group>
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
          <Space h='xs' />

          <Checkbox
            label='Change Password'
            disabled={editPassword}
            checked={editPassword}
            onChange={(e) => {
              const checked = e.currentTarget.checked;
              if (!checked && form.values.password) {
                return;
              }
              setEditPassword(checked);
              if (!checked) {
                // Reset password value if unchecking
                form.setFieldValue('password', '');
              }
            }}
          />

          {/* Password input */}
          <PasswordInput
            withAsterisk={editPassword} // only required if checkbox is checked
            label='New Password'
            disabled={!editPassword}
            {...form.getInputProps('password')}
          />
        </Stack>

        <Space h='md' />
        <Divider my='sm' />
        <Space h='md' />

        <Button color='teal' fullWidth type='submit'>Save Profile</Button>
      </form>

      <Space h='xl' />
    </Container>
  );
}
