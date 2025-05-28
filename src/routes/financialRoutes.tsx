
import React from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

// Import pages
import FinancialDashboard from "@/pages/financial/Dashboard";
import FinancialPayments from "@/pages/financial/Payments";
import FinancialClients from "@/pages/financial/Clients";
import FinancialReports from "@/pages/financial/Reports";
import FinancialSettings from "@/pages/financial/Settings";

const FinancialRoutes = () => {
  return (
    <RequireAuth allowedRoles={[UserRole.FINANCIAL]}>
      <Routes>
        <Route path={PATHS.FINANCIAL.DASHBOARD} element={<FinancialDashboard />} />
        <Route path={PATHS.FINANCIAL.PAYMENTS} element={<FinancialPayments />} />
        <Route path={PATHS.FINANCIAL.CLIENTS} element={<FinancialClients />} />
        <Route path={PATHS.FINANCIAL.REPORTS} element={<FinancialReports />} />
        <Route path={PATHS.FINANCIAL.SETTINGS} element={<FinancialSettings />} />
      </Routes>
    </RequireAuth>
  );
};

export default FinancialRoutes;
