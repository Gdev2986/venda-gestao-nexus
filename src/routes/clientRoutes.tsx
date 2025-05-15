
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
        path={PATHS.USER.DASHBOARD} 
        element={<ClientDashboard />} 
      />
      
      <Route path={PATHS.USER.PAYMENTS} element={<UserPayments />} />
      
      <Route path={PATHS.USER.MACHINES} element={<Machines />} />
      
      <Route path={PATHS.USER.SUPPORT} element={<Support />} />
      
      <Route path={PATHS.USER.SETTINGS} element={<Settings />} />
      
      <Route path={PATHS.USER.HELP} element={<Help />} />
    </Route>
  </Route>
);
