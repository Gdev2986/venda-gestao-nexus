
import { Route } from "react-router-dom";

// Admin Dashboard
import AdminDashboard from "../../pages/admin/Dashboard";
import AdminFees from "../../pages/admin/Fees";
import AdminReports from "../../pages/admin/Reports";
import AdminSupport from "../../pages/admin/Support";

// Dashboard Route for Admin Module
export const dashboardRoute = (
  <>
    <Route 
      key="admin-dashboard"
      path="dashboard"
      element={<AdminDashboard />}
    />
    <Route 
      key="admin-fees"
      path="fees"
      element={<AdminFees />}
    />
    <Route 
      key="admin-reports"
      path="reports"
      element={<AdminReports />}
    />
    <Route 
      key="admin-support"
      path="support"
      element={<AdminSupport />}
    />
  </>
);
