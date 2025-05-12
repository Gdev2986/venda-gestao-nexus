
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Admin Notifications
import AdminNotifications from "../../pages/admin/Notifications";
import Notifications from "../../pages/Notifications";

// Notification Routes for Admin Module
export const notificationRoutes = [
  <Route 
    key="admin-notifications" 
    path={PATHS.ADMIN.NOTIFICATIONS} 
    element={<AdminNotifications />} 
  />,
  <Route 
    key="notifications" 
    path={PATHS.NOTIFICATIONS} 
    element={<Notifications />} 
  />
];
