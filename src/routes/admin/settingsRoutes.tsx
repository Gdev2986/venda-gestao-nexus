
import { Route } from "react-router-dom";
import AdminSettings from "@/pages/admin/Settings";
import UserManagement from "@/pages/settings/UserManagement";
import AdminNotifications from "@/pages/admin/Notifications";

export const settingsRoutes = (
  <>
    <Route path="/admin/settings" element={<AdminSettings />} />
    <Route path="/admin/settings/users" element={<UserManagement />} />
    <Route path="/admin/notifications" element={<AdminNotifications />} />
  </>
);
