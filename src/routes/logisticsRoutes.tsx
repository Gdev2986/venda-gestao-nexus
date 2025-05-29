
import React from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserRole } from "@/types/enums";

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
    <RequireAuth allowedRoles={[UserRole.LOGISTICS, UserRole.ADMIN]}>
      <Routes>
        <Route path="dashboard" element={<LogisticsDashboard />} />
        <Route path="clients" element={<LogisticsClients />} />
        <Route path="machines" element={<LogisticsMachines />} />
        <Route path="machines/new" element={<LogisticsMachines />} />
        <Route path="requests" element={<LogisticsRequests />} />
        <Route path="inventory" element={<LogisticsInventory />} />
        <Route path="reports" element={<LogisticsReports />} />
        <Route path="settings" element={<LogisticsSettings />} />
        <Route path="support" element={<LogisticsSupport />} />
      </Routes>
    </RequireAuth>
  );
};

export default LogisticsRoutes;
