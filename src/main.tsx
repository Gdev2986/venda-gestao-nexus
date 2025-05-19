
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

// Robust initialization function that handles various DOM loading states
function initializeApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  console.log('Initializing React application...');
  
  try {
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
    
    console.log('React application rendered successfully');
  } catch (error) {
    console.error('Failed to render React application:', error);
  }
}

// Handle both loading states to ensure initialization happens correctly
if (document.readyState === 'loading') {
  // DOM still loading, wait for it to complete
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM already loaded, initialize immediately
  initializeApp();
}
