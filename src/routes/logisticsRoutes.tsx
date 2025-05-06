
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Logistics pages
import LogisticsDashboard from "../pages/logistics/Dashboard";
import Operations from "../pages/logistics/Operations";
import LogisticsRequests from "../pages/logistics/Requests";
import LogisticsCalendar from "../pages/logistics/Calendar";
import LogisticsInventory from "../pages/logistics/Inventory";
import LogisticsSupport from "../pages/logistics/Support";
import Machines from "../pages/machines/Machines";
import NewMachine from "../pages/machines/NewMachine";
import Clients from "../pages/clients/Clients";
import Sales from "../pages/sales/Sales";
import Settings from "../pages/settings/Settings";
import Help from "../pages/Help";

export const LogisticsRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.LOGISTICS]} />}>
    <Route element={<MainLayout />}>
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
        element={<Machines />} 
      />

      <Route 
        path={PATHS.LOGISTICS.MACHINE_NEW} 
        element={<NewMachine />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.SALES} 
        element={<Sales />} 
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
        path={PATHS.LOGISTICS.CALENDAR} 
        element={<LogisticsCalendar />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.INVENTORY} 
        element={<LogisticsInventory />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.SUPPORT} 
        element={<LogisticsSupport />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.LOGISTICS_MODULE} 
        element={
          <div className="container mx-auto py-10">
            <h1 className="text-3xl font-semibold mb-6">Módulo de Logística</h1>
            <p className="text-gray-600">Esta funcionalidade está em desenvolvimento.</p>
          </div> 
        } 
      />
      
      <Route 
        path={PATHS.LOGISTICS.HELP} 
        element={<Help />} 
      />
      
      <Route 
        path={PATHS.LOGISTICS.SETTINGS} 
        element={<Settings />} 
      />
    </Route>
  </Route>
);
