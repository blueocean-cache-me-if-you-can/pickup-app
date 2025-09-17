// client/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust for deployment or figure out a way to set dynamically
  headers: {
    'Content-Type': 'application/json',
  },
});

/* =========================
   EVENTS API
   ========================= */

// GET /api/events
export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

// POST /api/events
export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

/* =========================
   USERS API
   ========================= */

// GET /api/users
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// POST /api/users/signup
export const signUp = async (userData) => {
  const response = await api.post('/users/signup', userData);
  return response.data;
};

// POST /api/users/login
export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export default api;
