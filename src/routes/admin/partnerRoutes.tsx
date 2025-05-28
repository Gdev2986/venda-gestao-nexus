
import { Route } from "react-router-dom";
import { lazy } from "react";
import { PATHS } from "../paths";

// Layouts
import AdminLayout from "../../layouts/AdminLayout";

// Partner Pages
const PartnersList = lazy(() => import("../../pages/admin/Partners"));
const PartnerDetails = lazy(() => import("../../pages/partners/PartnerDetails"));
const PartnerNew = lazy(() => import("../../pages/partners/NewPartner"));

export const partnerRoutes = (
  <Route path={PATHS.ADMIN.PARTNERS} element={<AdminLayout />}>
    <Route index element={<PartnersList />} />
    <Route path=":id" element={<PartnerDetails />} />
    <Route path="new" element={<PartnerNew />} />
  </Route>
);
