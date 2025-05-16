
import React from "react";
import { Route } from "react-router-dom";
import { PATHS } from "./paths";

// Import pages
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import ClientRegistration from "@/pages/ClientRegistration";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import AdminSettings from "@/pages/admin/Settings";

export const MainRoutes = (
  <>
    <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
    <Route path={PATHS.CLIENTS} element={<Clients />} />
    <Route path={PATHS.CLIENT_REGISTRATION} element={<ClientRegistration />} />

    {/* Admin routes */}
    <Route path={PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
    <Route path={PATHS.ADMIN_CLIENTS} element={<AdminClients />} />
    <Route path={PATHS.ADMIN_SETTINGS} element={<AdminSettings />} />
  </>
);
