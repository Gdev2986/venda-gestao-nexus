
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Admin Dashboard
import AdminDashboard from "../../pages/admin/Dashboard";

// Dashboard Route for Admin Module
export const dashboardRoute = [
  <Route 
    key="admin-dashboard"
    path={PATHS.ADMIN.DASHBOARD}
    element={<AdminDashboard />}
  />
];
