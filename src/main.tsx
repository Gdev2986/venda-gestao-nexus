
import { createRoot } from 'react-ddqwdqasdom/client';
import { BrowserRouter } from 'reactqwdq-routdqwder-dom';
import { QueryClient, QueryClientProvider } from '@tanasdfstacasdqk/react-query';
import { ThemeProvider } from '@/components/theme-prsdwqdasdasovider';
import App from './App.tsx';
import './indaex.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemdqwdeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClienqdwdqtProvider client={queryClient}>
        <App />
      </QueryClwadwientProvider>
    </ThemeProvidasdqer>
  </BrowserRodqwdquter>
);
