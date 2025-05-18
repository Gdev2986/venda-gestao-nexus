
import { Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom"; // Added import for Outlet
import { PATHS } from "./paths";
import LogisticsLayout from "../layouts/LogisticsLayout";

// Logistics Pages
import LogisticsDashboard from "../pages/logistics/Dashboard";
import LogisticsMachines from "../pages/logistics/Machines";
import LogisticsInventory from "../pages/logistics/Inventory";
import LogisticsRequests from "../pages/logistics/Requests";
import LogisticsOperations from "../pages/logistics/Operations";
import LogisticsClientMachines from "../pages/logistics/ClientMachines";
import LogisticsSettings from "../pages/logistics/Settings";
import LogisticsCalendar from "../pages/logistics/Calendar";
import LogisticsSupport from "../pages/logistics/Support";
import MainLayout from "@/layouts/MainLayout";

export const logisticsRoutes = (
  <Route path="/logistics" element={<MainLayout><Outlet /></MainLayout>}>
    <Route index element={<Navigate to={PATHS.LOGISTICS.DASHBOARD} replace />} />
    <Route path="dashboard" element={<LogisticsDashboard />} />
    <Route path="machines" element={<LogisticsMachines />} />
    <Route path="stock" element={<LogisticsInventory />} /> 
    <Route path="client-machines" element={<LogisticsClientMachines />} />
    <Route path="operations" element={<LogisticsOperations />} />
    <Route path="requests" element={<LogisticsRequests />} />
    <Route path="calendar" element={<LogisticsCalendar />} />
    <Route path="support" element={<LogisticsSupport />} />
    <Route path="settings" element={<LogisticsSettings />} />
  </Route>
);
