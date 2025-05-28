
import React from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

// Import pages
import LogisticsDashboard from "@/pages/logistics/Dashboard";
import LogisticsClients from "@/pages/logistics/Clients";
import LogisticsMachines from "@/pages/logistics/Machines";
import LogisticsRequests from "@/pages/logistics/Requests";
import LogisticsInventory from "@/pages/logistics/Inventory";
import LogisticsReports from "@/pages/logistics/Reports";
import LogisticsSettings from "@/pages/logistics/Settings";
import LogisticsSupport from "@/pages/logistics/Support";

const LogisticsRoutes = () => {
  return (
    <RequireAuth allowedRoles={[UserRole.LOGISTICS]}>
      <Routes>
        <Route path={PATHS.LOGISTICS.DASHBOARD} element={<LogisticsDashboard />} />
        <Route path={PATHS.LOGISTICS.CLIENTS} element={<LogisticsClients />} />
        <Route path={PATHS.LOGISTICS.MACHINES} element={<LogisticsMachines />} />
        <Route path={PATHS.LOGISTICS.NEW_MACHINE} element={<LogisticsMachines />} />
        <Route path={PATHS.LOGISTICS.REQUESTS} element={<LogisticsRequests />} />
        <Route path={PATHS.LOGISTICS.INVENTORY} element={<LogisticsInventory />} />
        <Route path={PATHS.LOGISTICS.REPORTS} element={<LogisticsReports />} />
        <Route path={PATHS.LOGISTICS.SETTINGS} element={<LogisticsSettings />} />
        <Route path={PATHS.LOGISTICS.SUPPORT} element={<LogisticsSupport />} />
      </Routes>
    </RequireAuth>
  );
};

export default LogisticsRoutes;
