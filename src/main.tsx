
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import App from './App.tsx';
import './index.css';

// Make React available globally (explicit assignment)
window.React = React;

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Function to safely render the app
function renderApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  try {
    // Verify React is properly loaded
    if (!window.React || !window.React.useState) {
      console.error('React is not properly initialized, retrying in 50ms');
      setTimeout(renderApp, 50);  // Retry with a longer delay
      return;
    }
    
    console.log('React successfully initialized, rendering application');
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ThemeProvider defaultTheme="light" storageKey="sigmapay-theme">
                <NotificationsProvider>
                  <App />
                </NotificationsProvider>
              </ThemeProvider>
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
    
    console.log('Application rendered successfully');
  } catch (error) {
    console.error('Failed to render application:', error);
  }
}

// Ensure DOM is ready before attempting to render
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing app with delay');
    // Increased delay to ensure React is fully initialized
    setTimeout(renderApp, 50);
  });
} else {
  console.log('DOM already loaded, initializing app with delay');
  // Increased delay for already loaded document
  setTimeout(renderApp, 50);
}
