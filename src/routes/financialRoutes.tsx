
import { Route, Outlet } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Financial Pages
import FinancialDashboard from "../pages/financial/Dashboard";
import FinancialSettings from "../pages/financial/Settings";

// Reused Admin Pages
import AdminPayments from "../pages/admin/Payments";
import Clients from "../pages/clients/Clients";
import ClientDetails from "../pages/clients/ClientDetails";
import AdminReports from "../pages/admin/Reports";

export const FinancialRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.FINANCIAL]} />}>
    <Route element={<MainLayout><Outlet /></MainLayout>}>
      {/* Financial-specific pages */}
      <Route 
        path={PATHS.FINANCIAL.DASHBOARD} 
        element={<FinancialDashboard />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.SETTINGS} 
        element={<FinancialSettings />} 
      />
      
      {/* Use admin pages for these routes */}
      <Route 
        path={PATHS.ADMIN.PAYMENTS} 
        element={<AdminPayments />} 
      />
      
      <Route 
        path={PATHS.ADMIN.PAYMENT_DETAILS()} 
        element={<AdminPayments />} 
      />
      
      <Route 
        path={PATHS.ADMIN.CLIENTS} 
        element={<Clients />} 
      />
      
      <Route 
        path={PATHS.ADMIN.CLIENT_DETAILS()} 
        element={<ClientDetails />} 
      />
      
      <Route 
        path={PATHS.ADMIN.REPORTS} 
        element={<AdminReports />} 
      />
    </Route>
  </Route>
);
