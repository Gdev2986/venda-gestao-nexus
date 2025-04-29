
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { PATHS } from "./routes/paths";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientNew from "./pages/ClientNew";
import Machines from "./pages/Machines";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Partners from "./pages/Partners";
import Register from "./pages/Register";
import Fees from "./pages/Fees";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path={PATHS.HOME} element={<Index />} />
            <Route path={PATHS.REGISTER} element={<Register />} />

            {/* Rotas protegidas */}
            <Route path={PATHS.DASHBOARD} element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path={PATHS.CLIENTS} element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            <Route path={PATHS.CLIENT_DETAILS()} element={
              <ProtectedRoute>
                <ClientDetail />
              </ProtectedRoute>
            } />
            <Route path={PATHS.CLIENT_NEW} element={
              <ProtectedRoute>
                <ClientNew />
              </ProtectedRoute>
            } />
            <Route path={PATHS.MACHINES} element={
              <ProtectedRoute>
                <Machines />
              </ProtectedRoute>
            } />
            <Route path={PATHS.SALES} element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            } />
            <Route path={PATHS.PAYMENTS} element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path={PATHS.PARTNERS} element={
              <ProtectedRoute>
                <Partners />
              </ProtectedRoute>
            } />
            <Route path={PATHS.FEES} element={
              <ProtectedRoute>
                <Fees />
              </ProtectedRoute>
            } />
            <Route path={PATHS.REPORTS} element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path={PATHS.SETTINGS} element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path={PATHS.SUPPORT} element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            
            {/* Rota para não encontrado */}
            <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
