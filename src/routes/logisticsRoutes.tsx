
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import LogisticsLayout from "../layouts/LogisticsLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Logistics pages
import LogisticsDashboard from "../pages/logistics/Dashboard";
import Operations from "../pages/logistics/Operations";
import LogisticsRequests from "../pages/logistics/Requests";
import LogisticsInventory from "../pages/logistics/Inventory";
import LogisticsMachines from "../pages/logistics/Machines";
import LogisticsReports from "../pages/logistics/Reports";
import NewMachine from "../pages/machines/NewMachine";
import MachineDetails from "../pages/machines/MachineDetails";
import Clients from "../pages/clients/Clients";
import Settings from "../pages/logistics/Settings";

export const LogisticsRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.LOGISTICS]} />}>
    <Route element={<LogisticsLayout />}>
      <Route 
        path={PATHS.LOGISTICS.DASHBOARD} 
        element={<LogisticsDashboard />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.CLIENTS} 
        element={<Clients />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.MACHINES} 
        element={<LogisticsMachines />} 
      />

      <Route 
        path={PATHS.LOGISTICS.MACHINE_NEW} 
        element={<NewMachine />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.MACHINE_DETAILS()} 
        element={<MachineDetails />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.OPERATIONS} 
        element={<Operations />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.REQUESTS} 
        element={<LogisticsRequests />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.REPORTS} 
        element={<LogisticsReports />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.INVENTORY} 
        element={<LogisticsInventory />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.SETTINGS} 
        element={<Settings />} 
      />
    </Route>
  </Route>
);
