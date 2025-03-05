import React from 'react';
import { createRoot } from 'react-dom/client'; 
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import tema from './tema';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
  <ThemeProvider theme={tema}>
    <App />
  </ThemeProvider>
);
