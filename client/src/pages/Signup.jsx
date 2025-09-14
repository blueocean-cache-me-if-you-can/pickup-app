import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '@mantine/core';

function Signup({ setSessionId }) {
  const [name, setName] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${name[0]} ${name[1]}`, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessionId(data.sessionId);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      // setError('Network error');
      setSessionId('1234567890'); // temporary for testing without backend
      // redirect to onboarding page after signup
      navigate('/profile/?onboarding=true', { replace: true });
    }
  };
  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <h2>LOGO COMPONENT HERE</h2>
        <input type='text' placeholder='First Name' value={name} onChange={(e) => setName([e.target.value, name[1]])} required />
        <input type='text' placeholder='Last Name' value={name} onChange={(e) => setName([name[0], e.target.value])} required />
        <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <p>CHECKBOX TO CONFIRM OVER 18 HERE</p>
        <button type='submit'>Sign Up</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div>
          <Link to='/login'>Already have an account? Log in</Link>
        </div>
      </form>
    </Box>
  );
}
export default Signup;
