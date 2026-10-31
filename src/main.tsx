import { ThemeProvider } from '@contexts/ThemeContext';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';

import 'lenis/dist/lenis.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
