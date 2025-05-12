
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Logistics pages accessible to admin
import LogisticsDashboard from "../../pages/logistics/Dashboard";
import Operations from "../../pages/logistics/Operations";
import LogisticsRequests from "../../pages/logistics/Requests";
import LogisticsInventory from "../../pages/logistics/Inventory";
import LogisticsMachines from "../../pages/logistics/Machines";
import NewMachine from "../../pages/machines/NewMachine";
import MachineDetails from "../../pages/machines/MachineDetails";
import Clients from "../../pages/clients/Clients";

// Logistics Routes for Admin Module - for use in the admin section
export const logisticsRoutes = [
  <Route
    key="admin-logistics-redirect"
    path="logistics"
    element={<LogisticsDashboard />}
  />,
];

// Routes for the dedicated logistics section - with proper relative paths
export const logisticsMainRoutes = [
  <Route 
    key="logistics-dashboard"
    index
    element={<LogisticsDashboard />} 
  />,
  <Route 
    key="logistics-machines"
    path="machines"
    element={<LogisticsMachines />} 
  />,
  <Route 
    key="logistics-machine-new"
    path="machines/new"
    element={<NewMachine />} 
  />,
  <Route 
    key="logistics-machine-details"
    path="machines/:id"
    element={<MachineDetails />} 
  />,
  <Route 
    key="logistics-operations"
    path="operations"
    element={<Operations />} 
  />,
  <Route 
    key="logistics-requests"
    path="requests"
    element={<LogisticsRequests />} 
  />,
  <Route 
    key="logistics-inventory"
    path="inventory"
    element={<LogisticsInventory />} 
  />,
  <Route 
    key="logistics-clients"
    path="clients"
    element={<Clients />} 
  />
];
