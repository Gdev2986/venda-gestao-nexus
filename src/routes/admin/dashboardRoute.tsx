
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Admin Dashboard
import AdminDashboard from "../../pages/admin/Dashboard";
import AdminFees from "../../pages/admin/Fees";
import AdminReports from "../../pages/admin/Reports";

// Dashboard Route for Admin Module
export const dashboardRoute = (
  <>
    <Route 
      key="admin-dashboard"
      path={PATHS.ADMIN.DASHBOARD}
      element={<AdminDashboard />}
    />
    <Route 
      key="admin-fees"
      path={PATHS.ADMIN.FEES}
      element={<AdminFees />}
    />
    <Route 
      key="admin-reports"
      path={PATHS.ADMIN.REPORTS}
      element={<AdminReports />}
    />
  </>
);
