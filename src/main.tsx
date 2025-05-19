
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

// Initialize app function
const initializeApp = () => {
  // Get the root element
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  const root = createRoot(rootElement);

  // Use StrictMode to highlight potential problems
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
};

// Make sure DOM is fully loaded before mounting React
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
