
import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { AuthProvider } from "./providers/AuthProvider";
import { useAuth } from "./contexts/AuthContext";
import { UserRole } from "./types";
import { Spinner } from "./components/ui/spinner";
import { motion } from "framer-motion";

// Route groups
import { AuthRoutes } from "./routes/authRoutes";
import { AdminRoutes } from "./routes/adminRoutes";
import { ClientRoutes } from "./routes/clientRoutes";
import { PartnerRoutes } from "./routes/partnerRoutes";
import { FinancialRoutes } from "./routes/financialRoutes";
import { LogisticsRoutes } from "./routes/logisticsRoutes";

// Pages
import NotFound from "./pages/NotFound";

// Simple protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: UserRole[] }) => {
  const { user, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = userRole === UserRole.ADMIN ? "/admin/dashboard" :
                         userRole === UserRole.CLIENT ? "/user/dashboard" :
                         userRole === UserRole.PARTNER ? "/partner/dashboard" :
                         userRole === UserRole.FINANCIAL ? "/financial/dashboard" :
                         userRole === UserRole.LOGISTICS ? "/logistics/dashboard" : "/login";
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppContent = () => {
  const { user, userRole, isLoading } = useAuth();

  console.log("App render state:", { user: !!user, userRole, isLoading });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Verificando credenciais...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      {AuthRoutes}

      {/* Dashboard redirect */}
      <Route 
        path="/dashboard" 
        element={
          user && userRole ? (
            <Navigate 
              to={
                userRole === UserRole.ADMIN ? "/admin/dashboard" :
                userRole === UserRole.CLIENT ? "/user/dashboard" :
                userRole === UserRole.PARTNER ? "/partner/dashboard" :
                userRole === UserRole.FINANCIAL ? "/financial/dashboard" :
                userRole === UserRole.LOGISTICS ? "/logistics/dashboard" : "/login"
              } 
              replace 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Protected Routes by Role */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.LOGISTICS, UserRole.FINANCIAL]}>
          {AdminRoutes}
        </ProtectedRoute>
      } />
      
      <Route path="/user/*" element={
        <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
          {ClientRoutes}
        </ProtectedRoute>
      } />
      
      <Route path="/partner/*" element={
        <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
          {PartnerRoutes}
        </ProtectedRoute>
      } />
      
      <Route path="/financial/*" element={
        <ProtectedRoute allowedRoles={[UserRole.FINANCIAL]}>
          {FinancialRoutes}
        </ProtectedRoute>
      } />
      
      <Route path="/logistics/*" element={
        <ProtectedRoute allowedRoles={[UserRole.LOGISTICS]}>
          {LogisticsRoutes}
        </ProtectedRoute>
      } />

      {/* Root redirect - simplified logic */}
      <Route 
        path="/" 
        element={
          user && userRole ? (
            <Navigate 
              to={
                userRole === UserRole.ADMIN ? "/admin/dashboard" :
                userRole === UserRole.CLIENT ? "/user/dashboard" :
                userRole === UserRole.PARTNER ? "/partner/dashboard" :
                userRole === UserRole.FINANCIAL ? "/financial/dashboard" :
                userRole === UserRole.LOGISTICS ? "/logistics/dashboard" : "/login"
              } 
              replace 
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default App;
