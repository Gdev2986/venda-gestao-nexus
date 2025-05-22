import { Route } from "react-router-dom";
import { lazy } from "react";
import { PATHS } from "../paths";

// Lazy load the company pages
const Company = lazy(() => import("../../pages/admin/Company"));
const CompanyReports = lazy(() => import("../../pages/admin/company/CompanyReports"));
const CompanyExpenses = lazy(() => import("../../pages/admin/company/CompanyExpenses"));

export const companyRoutes = [
  <Route 
    key="admin-company" 
    path={PATHS.ADMIN.COMPANY} 
    element={<Company />} 
  />,
  <Route 
    key="admin-company-reports" 
    path={PATHS.ADMIN.COMPANY + "/reports"} 
    element={<CompanyReports />} 
  />,
  <Route 
    key="admin-company-expenses" 
    path={PATHS.ADMIN.COMPANY + "/expenses"} 
    element={<CompanyExpenses />} 
  />
];
