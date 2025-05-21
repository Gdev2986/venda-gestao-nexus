
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './providers/AuthProvider';
import { NotificationsProvider } from './contexts/notifications';
import { Toaster } from './components/ui/toaster';
import App from './App';
import './index.css';

// Create a query client for React Query
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
    console.log('Starting application render');
    
    // Create a fresh root
    const root = createRoot(rootElement);
    
    // Render the application with proper provider hierarchy
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light">
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
    // Add visible error message
    if (rootElement) {
      rootElement.innerHTML = `<div style="color: red; padding: 20px; border: 1px solid red; margin: 20px;">
        <h2>Failed to render application</h2>
        <p>${error instanceof Error ? error.message : String(error)}</p>
        <p>Please check the console for more details.</p>
      </div>`;
    }
  }
}

// Ensure DOM is fully loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // DOM already loaded, render immediately
  renderApp();
}
