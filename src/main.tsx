
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { Toaster } from '@/components/ui/sonner';
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

function renderApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  try {
    const root = createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="sigmapay-theme">
              <NotificationsProvider>
                <App />
                <Toaster />
              </NotificationsProvider>
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  return false;
};
