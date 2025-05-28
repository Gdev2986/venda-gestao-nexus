
import React from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

// Import pages
import ClientDashboard from "@/pages/client/Dashboard";
import ClientPayments from "@/pages/client/Payments";
import ClientMachines from "@/pages/client/Machines";
import ClientSupport from "@/pages/client/Support";
import ClientSettings from "@/pages/client/Settings";
import ClientHelp from "@/pages/client/Help";
import ClientProfile from "@/pages/client/Profile";
import ClientReports from "@/pages/client/Reports";

const ClientRoutes = () => {
  return (
    <RequireAuth allowedRoles={[UserRole.CLIENT]}>
      <Routes>
        <Route path={PATHS.CLIENT.DASHBOARD} element={<ClientDashboard />} />
        <Route path={PATHS.CLIENT.PAYMENTS} element={<ClientPayments />} />
        <Route path={PATHS.CLIENT.MACHINES} element={<ClientMachines />} />
        <Route path={PATHS.CLIENT.PROFILE} element={<ClientProfile />} />
        <Route path={PATHS.CLIENT.REPORTS} element={<ClientReports />} />
        <Route path={PATHS.CLIENT.SUPPORT} element={<ClientSupport />} />
        <Route path={PATHS.CLIENT.SETTINGS} element={<ClientSettings />} />
        <Route path={PATHS.CLIENT.HELP} element={<ClientHelp />} />
      </Routes>
    </RequireAuth>
  );
};

export default ClientRoutes;
