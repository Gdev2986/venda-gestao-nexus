
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
import Sales from "../pages/sales/Sales";
import AdminPayments from "../pages/admin/Payments";
import Partners from "../pages/partners/Partners";
import Fees from "../pages/Fees";
import Reports from "../pages/Reports";
import Support from "../pages/Support";
import Help from "../pages/Help";
import FinancialReports from "../pages/financial/Reports";
import FinancialRequests from "../pages/financial/Requests";
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
        path={PATHS.FINANCIAL.SALES} 
        element={<Sales />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.PAYMENTS} 
        element={<AdminPayments />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.PARTNERS} 
        element={<Partners />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.FEES} 
        element={<Fees />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.REPORTS} 
        element={<FinancialReports />} 
      />
      
      <Route
        path={PATHS.FINANCIAL.REQUESTS}
        element={<FinancialRequests />}
      />
      
      <Route 
        path={PATHS.FINANCIAL.SUPPORT} 
        element={<Support />} 
      />
      
      <Route 
        path={PATHS.FINANCIAL.HELP} 
        element={<Help />} 
      />
    </Route>
  </Route>
);
