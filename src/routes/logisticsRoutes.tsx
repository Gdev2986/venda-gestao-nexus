
import { Route } from "react-router-dom";
import { UserRole } from "@/types";
import { AuthGuard } from "@/components/auth/AuthGuard";
import LogisticsLayout from "../layouts/LogisticsLayout";

// Import pages
import LogisticsDashboard from "../pages/logistics/Dashboard";
import LogisticsMachines from "../pages/logistics/Machines";
import LogisticsRequests from "../pages/logistics/Requests";
import LogisticsInventory from "../pages/logistics/Inventory";
import LogisticsReports from "../pages/logistics/Reports";
import LogisticsSettings from "../pages/logistics/Settings";

export const LogisticsRoutes = (
  <Route 
    path="/logistics/*" 
    element={
      <AuthGuard allowedRoles={[UserRole.LOGISTICS]}>
        <LogisticsLayout />
      </AuthGuard>
    }
  >
    <Route path="dashboard" element={<LogisticsDashboard />} />
    <Route path="machines" element={<LogisticsMachines />} />
    <Route path="requests" element={<LogisticsRequests />} />
    <Route path="inventory" element={<LogisticsInventory />} />
    <Route path="reports" element={<LogisticsReports />} />
    <Route path="settings" element={<LogisticsSettings />} />
  </Route>
);
