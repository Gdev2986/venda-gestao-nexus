
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import App from './App.tsx';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Wait for the DOM to be fully loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <ThemeProvider defaultTheme="light" storageKey="sigmapay-theme">
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <NotificationsProvider>
                  <App />
                </NotificationsProvider>
              </AuthProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found');
  }
});
