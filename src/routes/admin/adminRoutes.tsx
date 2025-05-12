
import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSettings from "@/pages/admin/Settings";
import AdminNotifications from "@/pages/admin/Notifications";

// Define admin routes as an array of Route elements
export const adminRoutes = [
  <Route key="dashboard" path="dashboard" element={<AdminDashboard />} />,
  <Route key="settings" path="settings" element={<AdminSettings />} />,
  <Route key="notifications" path="notifications" element={<AdminNotifications />} />
];
