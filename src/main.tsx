
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
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
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ThemeProvider defaultTheme="light" storageKey="sigmapay-theme">
                <NotificationsProvider>
                  <App />
                  <Toaster />
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
    fallbackRender();
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
    message.innerHTML = '<h2>Erro ao carregar aplicação</h2><p>Redirecionando para login...</p>';
    
    rootElement.appendChild(message);
    
    // Redirect to login page after a brief delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  } catch (e) {
    // Last resort logging
    console.error('Critical rendering failure:', e);
  }
}

// Add global error boundary
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  if (event.error && event.error.message && 
      (event.error.message.includes("useState") || 
       event.error.message.includes("Cannot read properties of null"))) {
    fallbackRender();
    event.preventDefault();
    return true;
  }
  return false;
});

// Ensure DOM is fully loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderApp();
  });
} else {
  // DOM already loaded
  renderApp();
}

// Add global error handler as a safety net
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  if (source && source.includes('react')) {
    fallbackRender();
    return true;
  }
  return false;
};
