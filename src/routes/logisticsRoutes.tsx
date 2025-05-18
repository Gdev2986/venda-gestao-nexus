
import { Route, Outlet } from "react-router-dom";
import { PATHS } from "./paths";

// Layouts
import LogisticsLayout from "../layouts/LogisticsLayout";

// Logistics Pages
import Dashboard from "../pages/logistics/Dashboard";
import Machines from "../pages/logistics/Machines";
import MachineStock from "../pages/logistics/MachineStock";
import ClientMachines from "../pages/logistics/ClientMachines";
import Operations from "../pages/logistics/Operations";
import Requests from "../pages/logistics/Requests";
import Calendar from "../pages/logistics/Calendar";
import ServiceRequests from "../pages/logistics/ServiceRequests";
import Inventory from "../pages/logistics/Inventory";

export const logisticsRoutes = (
  <Route path="/logistics" element={<LogisticsLayout><Outlet /></LogisticsLayout>}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="machines" element={<Machines />} />
    <Route path="machine-stock" element={<MachineStock />} />
    <Route path="client-machines" element={<ClientMachines />} />
    <Route path="operations" element={<Operations />} />
    <Route path="requests" element={<Requests />} />
    <Route path="service-requests" element={<ServiceRequests />} />
    <Route path="calendar" element={<Calendar />} />
    <Route path="inventory" element={<Inventory />} />
  </Route>
);
