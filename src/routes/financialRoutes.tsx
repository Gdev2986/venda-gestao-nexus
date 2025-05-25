
import { Route } from "react-router-dom";
import { UserRole } from "@/types";
import { AuthGuard } from "@/components/auth/AuthGuard";
import MainLayout from "../components/layout/MainLayout";

// Import pages
import FinancialDashboard from "../pages/financial/Dashboard";
import FinancialSettings from "../pages/financial/Settings";

export const FinancialRoutes = (
  <Route 
    path="/financial/*" 
    element={
      <AuthGuard allowedRoles={[UserRole.FINANCIAL]}>
        <MainLayout />
      </AuthGuard>
    }
  >
    <Route path="dashboard" element={<FinancialDashboard />} />
    <Route path="settings" element={<FinancialSettings />} />
  </Route>
);
