
import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AuthGuard } from "./components/auth/AuthGuard";
import { UserRole } from "./types";

// Route groups
import { AuthRoutes } from "./routes/authRoutes";
import { AdminRoutes } from "./routes/adminRoutes";
import { ClientRoutes } from "./routes/clientRoutes";
import { PartnerRoutes } from "./routes/partnerRoutes";
import { FinancialRoutes } from "./routes/financialRoutes";
import { LogisticsRoutes } from "./routes/logisticsRoutes";

// Pages
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        {AuthRoutes}

        {/* Generic dashboard route - will be redirected by AuthGuard */}
        <Route 
          path="/dashboard" 
          element={
            <AuthGuard requireAuth={true}>
              <div>Redirecting...</div>
            </AuthGuard>
          } 
        />

        {/* Protected Routes by Role */}
        {AdminRoutes}
        {ClientRoutes}
        {PartnerRoutes}
        {FinancialRoutes}
        {LogisticsRoutes}

        {/* Root redirect */}
        <Route 
          path="/" 
          element={
            <AuthGuard requireAuth={false}>
              <Navigate to="/login" replace />
            </AuthGuard>
          } 
        />

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
