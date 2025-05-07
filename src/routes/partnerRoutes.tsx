
import { Route, Navigate } from "react-router-dom";
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
import Settings from "../pages/settings/Settings";
import Support from "../pages/Support";
import Help from "../pages/Help";
import Partners from "../pages/partners/Partners";

// Create a simple Reports component if it doesn't exist yet
import AdminReports from "../pages/admin/Reports";

export const PartnerRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.PARTNER]} />}>
    <Route element={<MainLayout />}>
      <Route 
        path={PATHS.PARTNER.DASHBOARD} 
        element={<Dashboard />} 
      />
      
      <Route 
        path={PATHS.PARTNER.CLIENTS} 
        element={<Clients />} 
      />
      
      <Route 
        path={PATHS.PARTNER.CLIENT_DETAILS()} 
        element={<ClientDetails />} 
      />
      
      <Route 
        path={PATHS.PARTNER.SALES} 
        element={<Sales />} 
      />
      
      <Route 
        path={PATHS.PARTNER.REPORTS} 
        element={<AdminReports />} 
      />
      
      <Route 
        path={PATHS.PARTNER.SETTINGS} 
        element={<Settings />} 
      />
      
      <Route 
        path={PATHS.PARTNER.SUPPORT} 
        element={<Support />} 
      />
      
      <Route 
        path={PATHS.PARTNER.COMMISSIONS} 
        element={
          <div className="container mx-auto py-10">
            <h1 className="text-3xl font-semibold mb-6">Comissões</h1>
            <p className="text-gray-600">Visualização e solicitação de comissões em desenvolvimento.</p>
          </div>
        } 
      />
      
      <Route 
        path={PATHS.PARTNER.HELP} 
        element={<Help />} 
      />
    </Route>
  </Route>
);
