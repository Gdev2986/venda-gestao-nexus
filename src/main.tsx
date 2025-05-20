
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/providers/AuthProvider';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import App from './App.tsx';
import './index.css';

// Create a query client with default options
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
    // Create a fresh root
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="sigmapay-theme">
              <AuthProvider>
                <NotificationsProvider>
                  <App />
                  <Toaster position="top-right" />
                </NotificationsProvider>
              </AuthProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
    
    console.log('Application rendered successfully');
  } catch (error) {
    console.error('Failed to render application:', error);
  }
}

// Ensure DOM is fully loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // DOM already loaded, render immediately
  renderApp();
}

// Add global error handler as a safety net
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  return false;
};
