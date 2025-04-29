
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { PATHS } from "./routes/paths";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientNew from "./pages/ClientNew";
import Machines from "./pages/Machines";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import ClientPayments from "./pages/ClientPayments";
import Partners from "./pages/Partners";
import Register from "./pages/Register";
import Fees from "./pages/Fees";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/UserManagement";

// Role-based route component
interface RoleBasedRouteProps {
  adminComponent: React.ReactNode;
  clientComponent: React.ReactNode;
  fallbackRole?: UserRole;
}

const RoleBasedRoute = ({
  adminComponent,
  clientComponent,
  fallbackRole = UserRole.CLIENT
}: RoleBasedRouteProps) => {
  const { userRole } = useUserRole();
  
  return userRole === UserRole.ADMIN || 
         userRole === UserRole.FINANCIAL || 
         userRole === UserRole.PARTNER
         ? adminComponent
         : clientComponent;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path={PATHS.HOME} element={<Index />} />
            <Route path={PATHS.REGISTER} element={<Register />} />

            {/* Rota do Dashboard com redirecionamento baseado no perfil */}
            <Route path={PATHS.DASHBOARD} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<Dashboard />}
                  clientComponent={<ClientDashboard />}
                />
              </ProtectedRoute>
            } />
            
            {/* Client specific routes */}
            <Route path={PATHS.PAYMENTS} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<Payments />}
                  clientComponent={<ClientPayments />}
                />
              </ProtectedRoute>
            } />

            {/* Admin only routes */}
            <Route path={PATHS.CLIENTS} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<Clients />}
                  clientComponent={<Navigate to={PATHS.DASHBOARD} replace />}
                />
              </ProtectedRoute>
            } />
            <Route path={PATHS.CLIENT_DETAILS()} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<ClientDetail />}
                  clientComponent={<Navigate to={PATHS.DASHBOARD} replace />}
                />
              </ProtectedRoute>
            } />
            <Route path={PATHS.CLIENT_NEW} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<ClientNew />}
                  clientComponent={<Navigate to={PATHS.DASHBOARD} replace />}
                />
              </ProtectedRoute>
            } />
            <Route path={PATHS.MACHINES} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<Machines />}
                  clientComponent={<Navigate to={PATHS.DASHBOARD} replace />}
                />
              </ProtectedRoute>
            } />
            <Route path={PATHS.SALES} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<Sales />}
                  clientComponent={<Navigate to={PATHS.DASHBOARD} replace />}
                />
              </ProtectedRoute>
            } />
            <Route path={PATHS.PARTNERS} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<Partners />}
                  clientComponent={<Navigate to={PATHS.DASHBOARD} replace />}
                />
              </ProtectedRoute>
            } />
            <Route path={PATHS.FEES} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<Fees />}
                  clientComponent={<Navigate to={PATHS.DASHBOARD} replace />}
                />
              </ProtectedRoute>
            } />
            <Route path={PATHS.REPORTS} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<Reports />}
                  clientComponent={<Navigate to={PATHS.DASHBOARD} replace />}
                />
              </ProtectedRoute>
            } />
            <Route path={PATHS.USER_MANAGEMENT} element={
              <ProtectedRoute>
                <RoleBasedRoute
                  adminComponent={<UserManagement />}
                  clientComponent={<Navigate to={PATHS.DASHBOARD} replace />}
                />
              </ProtectedRoute>
            } />
            
            {/* Common routes for all roles */}
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
            <Route path={PATHS.HELP} element={
              <ProtectedRoute>
                <Help />
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
