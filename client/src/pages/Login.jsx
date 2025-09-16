import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, PasswordInput, Stack, TextInput, Button, Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import Logo from '../components/Logo';

function Login({ setSessionId }) {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  const [visible, { toggle }] = useDisclosure(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formValues) => {
    console.log('Submitting login with', formValues.email, formValues.password);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formValues.email, password: formValues.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessionId(data.sessionId);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('This error is expected in development without a backend', err);
      setSessionId('1234567890'); // temporary for testing without backend
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
            maxWidth: 350, marginTop: '50px', margin: 'auto',
          }}
        >
          <Stack gap='xs'>
            <Logo showText />
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
            <Button variant='filled' fullWidth type='submit'>Log In</Button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Text size='sm' ta='center'>
              Don't have an account yet?
              {' '}
              <Link to='/signup' style={{ textDecoration: 'underline' }}>Sign up</Link>
            </Text>
          </Stack>
        </form>
        <Text size='xs' ta='center' mt='md'>
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </Box>
    </div>
  );
}

export default Login;
