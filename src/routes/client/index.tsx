import React from "react";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ClientLayout from "../../layouts/ClientLayout";

// Client Pages
const ClientDashboard = lazy(() => import("../../pages/client/Dashboard"));
const ClientSettings = lazy(() => import("../../pages/client/Settings"));
const ClientMachines = lazy(() => import("../../pages/client/Machines"));
const ClientFeePlans = lazy(() => import("../../pages/client/FeePlans"));

export const clientRoutes = (
  <Route path="/client" element={<ClientLayout />}>
    <Route index element={<ClientDashboard />} />
    <Route path="settings" element={<ClientSettings />} />
    <Route path="machines" element={<ClientMachines />} />
    <Route path="fee-plans" element={<ClientFeePlans />} />
  </Route>
);
