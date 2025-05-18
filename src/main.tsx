
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { NotificationsProvider } from './contexts/NotificationsContext'; // Fixed import path
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <NotificationsProvider>
          <App />
          <Toaster />
        </NotificationsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
