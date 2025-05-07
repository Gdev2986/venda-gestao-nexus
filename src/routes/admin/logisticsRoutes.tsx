
import { Route, Navigate } from "react-router-dom";
import { PATHS } from "../paths";

// Logistics pages accessible to admin
import LogisticsDashboard from "../../pages/logistics/Dashboard";
import Operations from "../../pages/logistics/Operations";
import LogisticsRequests from "../../pages/logistics/Requests";
import LogisticsInventory from "../../pages/logistics/Inventory";
import Machines from "../../pages/machines/Machines";
import NewMachine from "../../pages/machines/NewMachine";
import MachineDetails from "../../pages/machines/MachineDetails";

// Logistics Routes for Admin Module
export const logisticsRoutes = [
  <Route
    key="admin-logistics-redirect"
    path={PATHS.ADMIN.LOGISTICS}
    element={<Navigate to={PATHS.LOGISTICS.DASHBOARD} replace />}
  />,
  <Route 
    key="logistics-dashboard" 
    path={PATHS.LOGISTICS.DASHBOARD} 
    element={<LogisticsDashboard />} 
  />,
  <Route 
    key="logistics-machines" 
    path={PATHS.LOGISTICS.MACHINES} 
    element={<Machines />} 
  />,
  <Route 
    key="logistics-machine-new" 
    path={PATHS.LOGISTICS.MACHINE_NEW} 
    element={<NewMachine />} 
  />,
  <Route 
    key="logistics-machine-details" 
    path={PATHS.LOGISTICS.MACHINE_DETAILS()} 
    element={<MachineDetails />} 
  />,
  <Route 
    key="logistics-operations" 
    path={PATHS.LOGISTICS.OPERATIONS} 
    element={<Operations />} 
  />,
  <Route 
    key="logistics-requests" 
    path={PATHS.LOGISTICS.REQUESTS} 
    element={<LogisticsRequests />} 
  />,
  <Route 
    key="logistics-inventory" 
    path={PATHS.LOGISTICS.INVENTORY} 
    element={<LogisticsInventory />} 
  />
];
