// client/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, PasswordInput, Stack, Group, TextInput, Button, Checkbox, Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import Logo from '../components/Logo';
import AddressPicker from '../components/AddressPicker';
import { signUp } from '../api';

function Signup({ setSessionId }) {
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      address: 'GET FROM AddressPicker',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      confirmPassword: (value, values) => (value === values.password ? null : 'Passwords must match'),
    },
  });

  const [visible, { toggle }] = useDisclosure(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formValues) => {
    if (formValues.password !== formValues.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const newUser = await signUp({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        emailPrimary: formValues.email,
        password: formValues.password,
        address: formValues.address,
        atLeastEighteen: true,
      });

      setSessionId(newUser._id || 'mock-session-id');

      navigate('/profile', { replace: true });
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
    }}
    >
      <Box>
        <form
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
          style={{ maxWidth: 350, margin: 'auto' }}
        >
          <Stack gap='xs'>
            <Logo showText />
            <Group>
              <TextInput
                withAsterisk
                label='First name'
                placeholder='John'
                key={form.key('firstName')}
                {...form.getInputProps('firstName')}
                flex={1}
              />
              <TextInput
                withAsterisk
                label='Last name'
                placeholder='Doe'
                key={form.key('lastName')}
                {...form.getInputProps('lastName')}
                flex={1}
              />
            </Group>
            <AddressPicker />
            <TextInput
              withAsterisk
              label='Email'
              placeholder='your@email.com'
              key={form.key('email')}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label='Password'
              visible={visible}
              onVisibilityChange={toggle}
              placeholder='Password'
              withAsterisk
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label='Confirm Password'
              visible={visible}
              onVisibilityChange={toggle}
              placeholder='Confirm Password'
              withAsterisk
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
              withErrorStyles={false}
            />
            <Checkbox label='I confirm I am at least 18 years old' required />
            <Button variant='filled' fullWidth type='submit'>Sign Up</Button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Text size='sm' ta='center'>
              Already have an account?{' '}
              <Link to='/login' style={{ textDecoration: 'underline' }}>Log in</Link>
            </Text>
          </Stack>
        </form>
        <Text size='xs' ta='center' mt='md'>
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </Box>
    </div>
  );
}

export default Signup;
