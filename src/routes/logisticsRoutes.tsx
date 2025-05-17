
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import MainLayout from "../layouts/LogisticsLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Pages
import Dashboard from "../pages/logistics/Dashboard";
import Machines from "../pages/logistics/Machines";
import ClientMachines from "../pages/logistics/ClientMachines";
import Inventory from "../pages/logistics/Inventory";
import Requests from "../pages/logistics/Requests";
import Operations from "../pages/logistics/Operations";
import Calendar from "../pages/logistics/Calendar";
import Support from "../pages/logistics/Support";
import Settings from "../pages/logistics/Settings";

export const LogisticsRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.LOGISTICS]} />}>
    <Route element={<MainLayout />}>
      <Route path={PATHS.LOGISTICS.DASHBOARD} element={<Dashboard />} />
      <Route path={PATHS.LOGISTICS.MACHINES} element={<Machines />} />
      <Route path={PATHS.LOGISTICS.CLIENT_MACHINES} element={<ClientMachines />} />
      <Route path={PATHS.LOGISTICS.INVENTORY} element={<Inventory />} />
      <Route path={PATHS.LOGISTICS.REQUESTS} element={<Requests />} />
      <Route path={PATHS.LOGISTICS.OPERATIONS} element={<Operations />} />
      <Route path={PATHS.LOGISTICS.CALENDAR} element={<Calendar />} />
      <Route path={PATHS.LOGISTICS.SUPPORT} element={<Support />} />
      <Route path={PATHS.LOGISTICS.SETTINGS} element={<Settings />} />
    </Route>
  </Route>
);
