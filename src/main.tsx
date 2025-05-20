
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
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
    
    // Render the application with all providers
    // Critical: The order of providers matters - BrowserRouter must be first, then QueryClientProvider,
    // ThemeProvider, followed by AuthProvider, then NotificationsProvider, and finally the App
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="sigmapay-theme">
              <AuthProvider>
                <NotificationsProvider>
                  <App />
                  <Toaster />
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

// Define a fallback mechanism if the main rendering fails
function fallbackRender() {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;
    
    const message = document.createElement('div');
    message.style.padding = '20px';
    message.style.fontFamily = 'sans-serif';
    message.innerHTML = '<h2>Error loading application</h2><p>Please try refreshing the page.</p>';
    
    rootElement.appendChild(message);
  } catch (e) {
    // Last resort logging
    console.error('Critical rendering failure:', e);
  }
}

// Ensure DOM is fully loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure React is fully initialized
    setTimeout(renderApp, 100);
  });
} else {
  // DOM already loaded, still use a small delay to ensure proper initialization
  setTimeout(renderApp, 100);
}

// Add global error handler as a safety net
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  if (source && source.includes('react')) {
    fallbackRender();
  }
  return false;
};
