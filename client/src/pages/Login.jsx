import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, PasswordInput, Stack, TextInput, Button, Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import Logo from '../components/Logo';
import { login } from '../api';

function Login({ setSessionId }) {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => {
        if (value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return null;
      },
    },
  });
  const [visible, { toggle }] = useDisclosure(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formValues) => {
    console.log(formValues);
    setError('');
    try {
      const res = await login({
        emailPrimary: formValues.email,
        pwd: formValues.password,
      });

      console.log('Login response:', res);

      setSessionId(res.user?._id || 'mock-session-id');
    } catch (err) {
      console.error('Login failed:', err);
      const msg = err.response?.data?.error
      || err.message || 'Login failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <div
      style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
      }}
    >
      <Box>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
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
            <Button variant='filled' fullWidth type='submit'>Log In</Button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Text size='sm' ta='center'>
              Don't have an account yet?
              {' '}
              <Link to='/signup' style={{ textDecoration: 'underline' }}>
                Sign up
              </Link>
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
