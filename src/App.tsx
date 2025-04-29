
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientNew from "./pages/ClientNew";
import Register from "./pages/Register";
import Machines from "./pages/Machines";
import NotFound from "./pages/NotFound";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Payments from "./pages/Payments";
import ClientPayments from "./pages/ClientPayments";
import Fees from "./pages/Fees";
import Settings from "./pages/Settings";
import Partners from "./pages/Partners";
import Support from "./pages/Support";
import Help from "./pages/Help";
import UserManagement from "./pages/UserManagement";
import { PATHS } from './routes/paths';
import { UserRole } from "./types";

import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <Routes>
            <Route path={PATHS.HOME} element={<Index />} />
            <Route path={PATHS.REGISTER} element={<Register />} />
            
            {/* Admin Routes */}
            <Route 
              path={PATHS.DASHBOARD} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PARTNER, UserRole.FINANCE]}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Client Routes */}
            <Route 
              path="/client/dashboard" 
              element={
                <ProtectedRoute roles={[UserRole.CLIENT]}>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/client/payments" 
              element={
                <ProtectedRoute roles={[UserRole.CLIENT]}>
                  <ClientPayments />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.CLIENTS} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PARTNER]}>
                  <Clients />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.CLIENT_NEW} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PARTNER]}>
                  <ClientNew />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.CLIENT_DETAILS()} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PARTNER]}>
                  <ClientDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.MACHINES} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PARTNER, UserRole.CLIENT]}>
                  <Machines />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.SALES} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.FINANCE, UserRole.CLIENT]}>
                  <Sales />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.REPORTS} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.FINANCE]}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.PAYMENTS} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.FINANCE]}>
                  <Payments />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.FEES} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN]}>
                  <Fees />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.SETTINGS} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN]}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.USER_MANAGEMENT} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN]}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.PARTNERS} 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN]}>
                  <Partners />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.SUPPORT} 
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={PATHS.HELP} 
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              } 
            />
            
            <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
