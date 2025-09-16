import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, PasswordInput, Stack, Group, TextInput, Button, Checkbox, Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import Logo from '../components/Logo';
import AddressPicker from '../components/AddressPicker';

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
    console.log('Submitting signup with:\n', 'first name:', formValues.firstName, 'last name:', formValues.lastName, 'address:', formValues.address, 'email:', formValues.email, 'password:', formValues.password);
    if (formValues.password !== formValues.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password: formValues.password,
          address: formValues.address,
          atLeastEighteen: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessionId(data.sessionId);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      // setError('Network error');
      console.error('This error is expected in development without a backend', err);
      setSessionId('1234567890'); // temporary for testing without backend
      // redirect to onboarding page after signup
      navigate('/profile', { replace: true });
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
          style={{
            maxWidth: 350, margin: 'auto',
          }}
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
                required
              />
              <TextInput
                withAsterisk
                label='Last name'
                placeholder='Doe'
                key={form.key('lastName')}
                {...form.getInputProps('lastName')}
                flex={1}
                required
              />
            </Group>
            <AddressPicker />
            <TextInput
              withAsterisk
              label='Email'
              placeholder='your@email.com'
              key={form.key('email')}
              {...form.getInputProps('email')}
              required
            />
            <PasswordInput
              label='Password'
              visible={visible}
              onVisibilityChange={toggle}
              placeholder='Password'
              withAsterisk
              key={form.key('password')}
              {...form.getInputProps('password')}
              required
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
              required
            />
            <Checkbox label='I confirm I am at least 18 years old' required />
            <Button variant='filled' fullWidth type='submit'>Sign Up</Button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Text size='sm' ta='center'>
              Already have an account?
              {' '}
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
