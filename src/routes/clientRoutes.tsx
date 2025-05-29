
import React from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserRole } from "@/types/enums";
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
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/payments" element={<ClientPayments />} />
        <Route path="/machines" element={<ClientMachines />} />
        <Route path="/profile" element={<ClientProfile />} />
        <Route path="/reports" element={<ClientReports />} />
        <Route path="/support" element={<ClientSupport />} />
        <Route path="/settings" element={<ClientSettings />} />
        <Route path="/help" element={<ClientHelp />} />
      </Routes>
    </RequireAuth>
  );
};

export default ClientRoutes;
