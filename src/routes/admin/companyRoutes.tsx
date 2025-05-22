
import { Route } from "react-router-dom";
import { lazy } from "react";
import { PATHS } from "../paths";

// Lazy load the company pages
const Company = lazy(() => import("../../pages/admin/Company"));
const CompanyReports = lazy(() => import("../../pages/admin/company/CompanyReports"));
const CompanyExpenses = lazy(() => import("../../pages/admin/company/CompanyExpenses"));

export const companyRoutes = (
  <Route path="company">
    <Route index element={<Company />} />
    <Route path="reports" element={<CompanyReports />} />
    <Route path="expenses" element={<CompanyExpenses />} />
  </Route>
);
