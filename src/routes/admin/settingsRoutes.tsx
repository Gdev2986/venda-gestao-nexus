
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Settings pages
import AdminSettings from "../../pages/admin/Settings";
import UserManagement from "../../pages/settings/UserManagement";
import Fees from "../../pages/Fees";
import AdminReports from "../../pages/admin/Reports";
import AdminSupport from "../../pages/admin/Support";
import AdminNotifications from "../../pages/admin/Notifications";

// Settings and Other Routes for Admin Module
export const settingsRoutes = [
  <Route 
    key="admin-settings" 
    path={PATHS.ADMIN.SETTINGS} 
    element={<AdminSettings />} 
  />,
  <Route 
    key="admin-notifications" 
    path={PATHS.ADMIN.NOTIFICATIONS} 
    element={<AdminNotifications />} 
  />,
  <Route 
    key="admin-user-management" 
    path={PATHS.ADMIN.USER_MANAGEMENT} 
    element={<UserManagement />} 
  />,
  <Route 
    key="admin-fees" 
    path={PATHS.ADMIN.FEES} 
    element={<Fees />} 
  />,
  <Route 
    key="admin-reports" 
    path={PATHS.ADMIN.REPORTS} 
    element={<AdminReports />} 
  />,
  <Route 
    key="admin-support" 
    path={PATHS.ADMIN.SUPPORT} 
    element={<AdminSupport />} 
  />
];
