
import { Fragment } from "react";
import { Route } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

// Auth Protection Component
import RequireAuth from "../components/auth/RequireAuth";

// Layouts
import AdminLayout from "../layouts/AdminLayout";

// Pages
import Dashboard from "../pages/admin/Dashboard";
import Clients from "../pages/admin/Clients";
import Machines from "../pages/admin/Machines";
import Partners from "../pages/admin/Partners";
import Payments from "../pages/admin/Payments";
import Settings from "../pages/admin/Settings";

export const AdminRoutes = (
  <Route element={<RequireAuth allowedRoles={[UserRole.ADMIN]} />}>
    <Route element={<AdminLayout />}>
      <Route path={PATHS.ADMIN.DASHBOARD} element={<Dashboard />} />
      <Route path={PATHS.ADMIN.CLIENTS} element={<Clients />} />
      <Route path={PATHS.ADMIN.MACHINES} element={<Machines />} />
      <Route path={PATHS.ADMIN.PARTNERS} element={<Partners />} />
      <Route path={PATHS.ADMIN.PAYMENTS} element={<Payments />} />
      <Route path={PATHS.ADMIN.SETTINGS} element={<Settings />} />
    </Route>
  </Route>
);
