
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import App from './App.tsx';
import './index.css';

// Make React available in the global scope to ensure it's accessible everywhere
if (typeof window !== 'undefined') {
  window.React = React;
}

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
function renderApp(rootElement: HTMLElement) {
  console.log('Rendering application...');
  
  try {
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

// Initialize the app after DOM is fully ready
function initApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found, waiting...');
    
    // Try again after a small delay if element wasn't found
    setTimeout(() => {
      const retryRoot = document.getElementById('root');
      if (retryRoot) {
        console.log('Root element found on retry');
        renderApp(retryRoot);
      } else {
        console.error('Root element still not found after retry');
      }
    }, 100);
    
    return;
  }
  
  renderApp(rootElement);
}

// Handle different document ready states
if (document.readyState === 'loading') {
  // Document still loading, wait for DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    // Use a small timeout to ensure React is fully initialized
    setTimeout(initApp, 10);
  });
} else {
  // Document already loaded, initialize with a small delay
  console.log('Document already loaded');
  setTimeout(initApp, 10);
}
