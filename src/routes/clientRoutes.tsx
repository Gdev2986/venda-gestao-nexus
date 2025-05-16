
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Dashboard
import ClientDashboard from "../pages/ClientDashboard";

// Pages
import UserPayments from "../pages/UserPayments";
import Machines from "../pages/machines/Machines";
import Support from "../pages/Support";
import Settings from "../pages/settings/Settings";
import Help from "../pages/Help";

export const ClientRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.CLIENT]} />}>
    <Route element={<MainLayout />}>
      <Route 
        path={PATHS.CLIENT.DASHBOARD} 
        element={<ClientDashboard />} 
      />
      
      <Route path={PATHS.CLIENT.PAYMENTS} element={<UserPayments />} />
      
      <Route path={PATHS.CLIENT.MACHINES} element={<Machines />} />
      
      <Route path={PATHS.CLIENT.SUPPORT} element={<Support />} />
      
      <Route path={PATHS.CLIENT.SETTINGS} element={<Settings />} />
      
      <Route path={PATHS.CLIENT.HELP} element={<Help />} />
    </Route>
  </Route>
);
