
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";
import RequireAuth from "../components/auth/RequireAuth";
import MainLayout from "@/layouts/MainLayout";

// Logistics pages
import LogisticsDashboard from "../pages/logistics/Dashboard";
import Inventory from "../pages/logistics/Inventory";
import MachineStock from "../pages/logistics/MachineStock";
import Machines from "../pages/logistics/Machines";
import Operations from "../pages/logistics/Operations";
import Requests from "../pages/logistics/Requests";
import ServiceRequests from "../pages/logistics/ServiceRequests";
import Calendar from "../pages/logistics/Calendar";
import ClientMachines from "../pages/logistics/ClientMachines";
import LogisticsSettings from "../pages/logistics/Settings";
import LogisticsSupport from "../pages/logistics/Support";

export const LogisticsRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.LOGISTICS, UserRole.ADMIN]} />}>
    <Route element={<MainLayout><Outlet /></MainLayout>}>
      <Route path={PATHS.LOGISTICS.DASHBOARD} element={<LogisticsDashboard />} />
      <Route path={PATHS.LOGISTICS.INVENTORY} element={<Inventory />} />
      <Route path={PATHS.LOGISTICS.MACHINES} element={<Machines />} />
      <Route path={PATHS.LOGISTICS.MACHINE_STOCK} element={<MachineStock />} />
      <Route path={PATHS.LOGISTICS.OPERATIONS} element={<Operations />} />
      <Route path={PATHS.LOGISTICS.REQUESTS} element={<Requests />} />
      <Route path={PATHS.LOGISTICS.SERVICE_REQUESTS} element={<ServiceRequests />} />
      <Route path={PATHS.LOGISTICS.CALENDAR} element={<Calendar />} />
      <Route path={PATHS.LOGISTICS.CLIENT_MACHINES} element={<ClientMachines />} />
      <Route path={PATHS.LOGISTICS.SETTINGS} element={<LogisticsSettings />} />
      <Route path={PATHS.LOGISTICS.SUPPORT} element={<LogisticsSupport />} />
    </Route>
  </Route>
);
