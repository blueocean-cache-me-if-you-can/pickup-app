import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mantine/core';

function Login({ setSessionId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessionId(data.sessionId);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      // setError('Network error');
      setSessionId('1234567890'); // temporary for testing without backend
    }
  };
  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <h2>LOGO COMPONENT HERE</h2>
        <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type='submit'>Log In</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div>
          <Link to='/signup'>Don't have an account yet? Sign up</Link>
        </div>
      </form>
    </Box>
  );
}

export default Login;
