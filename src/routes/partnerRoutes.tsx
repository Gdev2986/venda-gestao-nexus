
import React from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserRole } from "@/types/enums";
import { PATHS } from "@/routes/paths";

// Import pages
import PartnerDashboard from "@/pages/partner/Dashboard";
import PartnerClients from "@/pages/partner/Clients";
import PartnerSales from "@/pages/partner/Sales";
import PartnerCommissions from "@/pages/partner/Commissions";
import PartnerReports from "@/pages/partner/Reports";
import PartnerSettings from "@/pages/partner/Settings";
import PartnerSupport from "@/pages/partner/Support";
import PartnerHelp from "@/pages/partner/Help";

const PartnerRoutes = () => {
  return (
    <RequireAuth allowedRoles={[UserRole.PARTNER]}>
      <Routes>
        <Route path={PATHS.PARTNER.DASHBOARD} element={<PartnerDashboard />} />
        <Route path={PATHS.PARTNER.CLIENTS} element={<PartnerClients />} />
        <Route path={PATHS.PARTNER.SALES} element={<PartnerSales />} />
        <Route path={PATHS.PARTNER.COMMISSIONS} element={<PartnerCommissions />} />
        <Route path={PATHS.PARTNER.REPORTS} element={<PartnerReports />} />
        <Route path={PATHS.PARTNER.SETTINGS} element={<PartnerSettings />} />
        <Route path={PATHS.PARTNER.SUPPORT} element={<PartnerSupport />} />
        <Route path={PATHS.PARTNER.HELP} element={<PartnerHelp />} />
      </Routes>
    </RequireAuth>
  );
};

export default PartnerRoutes;
