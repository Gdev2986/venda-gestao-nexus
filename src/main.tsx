
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
      retry: 1, // Reduce retries to fail faster in case of critical errors
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
    console.log('Attempting to render application...');
    
    // Setup global React error boundary before rendering
    window.React = React; // Ensure React is globally available
    
    // Create a fresh root
    const root = createRoot(rootElement);
    
    // Render the application with all providers, with error boundaries
    root.render(
      <React.StrictMode>
        <ErrorBoundary fallback={<FallbackComponent />}>
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
        </ErrorBoundary>
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

// Simple fallback component for error boundary
function FallbackComponent() {
  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontFamily: 'sans-serif'
    }}>
      <h2>Ocorreu um erro inesperado</h2>
      <p>A aplicação encontrou um problema. Tente novamente ou volte para o login.</p>
      <button 
        onClick={() => window.location.href = '/login'}
        style={{
          padding: '8px 16px',
          background: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Voltar para login
      </button>
    </div>
  );
}

// Simple ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
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
  if (source && source.includes('react') || (message && message.includes('useState'))) {
    fallbackRender();
    return true;
  }
  return false;
};
