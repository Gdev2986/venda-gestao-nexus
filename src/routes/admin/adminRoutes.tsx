
import { Fragment } from "react";
import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSettings from "@/pages/admin/Settings";

// Use arrays of Route components for better compatibility with React Router
export const adminRoutes = [
  <Route key="dashboard" path="dashboard" element={<AdminDashboard />} />,
  <Route key="settings" path="settings" element={<AdminSettings />} />
];
