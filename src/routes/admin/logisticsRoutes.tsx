
import { Route } from "react-router-dom";
import { lazy } from "react";
import { PATHS } from "../paths";

// Layouts
import LogisticsLayout from "../../layouts/LogisticsLayout";

// Logistics Pages
const LogisticsDashboard = lazy(() => import("../../pages/logistics/Dashboard"));
const LogisticsMachines = lazy(() => import("../../pages/logistics/Machines"));
const LogisticsRequests = lazy(() => import("../../pages/logistics/Requests"));
const LogisticsClients = lazy(() => import("../../pages/logistics/Clients"));
const LogisticsReports = lazy(() => import("../../pages/logistics/Reports"));
const LogisticsSettings = lazy(() => import("../../pages/logistics/Settings"));
const LogisticsSupport = lazy(() => import("../../pages/logistics/Support"));
const LogisticsInventory = lazy(() => import("../../pages/logistics/Inventory"));
const MachineDetails = lazy(() => import("../../pages/machines/MachineDetails"));
const NewMachine = lazy(() => import("../../pages/machines/NewMachine"));

export const logisticsRoutes = (
  <Route path={PATHS.LOGISTICS.DASHBOARD.replace('/logistics', '')} element={<LogisticsLayout />}>
    <Route index element={<LogisticsDashboard />} />
    <Route path="machines">
      <Route index element={<LogisticsMachines />} />
      <Route path=":id" element={<MachineDetails />} />
      <Route path="new" element={<NewMachine />} />
    </Route>
    <Route path="requests" element={<LogisticsRequests />} />
    <Route path="operations" element={<LogisticsRequests />} />
    <Route path="clients" element={<LogisticsClients />} />
    <Route path="reports" element={<LogisticsReports />} />
    <Route path="settings" element={<LogisticsSettings />} />
    <Route path="inventory" element={<LogisticsInventory />} />
    <Route path="support" element={<LogisticsSupport />} />
  </Route>
);
