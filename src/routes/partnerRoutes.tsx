
import { Route, Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import PartnerLayout from "../layouts/PartnerLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Partner Pages
import Dashboard from "../pages/partner/Dashboard";
import Settings from "../pages/partner/Settings";
import Clients from "../pages/partner/Clients";
import ClientDetails from "../pages/partner/ClientDetails";
import Sales from "../pages/partner/Sales";
import Reports from "../pages/partner/Reports";
import Support from "../pages/Support";
import Help from "../pages/Help";
import Commissions from "../pages/partner/Commissions";

export const PartnerRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.PARTNER]} />}>
    <Route element={<PartnerLayout />}>
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
        element={<Reports />} 
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
        element={<Commissions />} 
      />
      
      <Route 
        path={PATHS.PARTNER.HELP} 
        element={<Help />} 
      />
    </Route>
  </Route>
);
