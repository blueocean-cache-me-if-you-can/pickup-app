import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './components/App';
import { theme } from './styles/theme.js';
import '@mantine/core/styles.css';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </React.StrictMode>,
);
