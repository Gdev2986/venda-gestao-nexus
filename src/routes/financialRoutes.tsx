
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Dashboard
import Dashboard from "../pages/Dashboard";

// Pages
import Clients from "../pages/clients/Clients";
import ClientDetails from "../pages/clients/ClientDetails";
import AdminPayments from "../pages/admin/Payments";
import FinancialReports from "../pages/financial/Reports";
import FinancialDashboard from "../pages/financial/Dashboard";

export const FinancialRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.FINANCIAL]} />}>
    <Route element={<MainLayout />}>
      <Route 
        path={PATHS.FINANCIAL.DASHBOARD} 
        element={<FinancialDashboard />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.CLIENTS} 
        element={<Clients />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.CLIENT_DETAILS()} 
        element={<ClientDetails />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.PAYMENTS} 
        element={<AdminPayments />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.REPORTS} 
        element={<FinancialReports />} 
      />
    </Route>
  </Route>
);
