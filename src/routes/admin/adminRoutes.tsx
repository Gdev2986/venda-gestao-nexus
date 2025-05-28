import { Route } from "react-router-dom";
import { lazy } from "react";
import { PATHS } from "../paths";

// Layouts
import AdminLayout from "../../layouts/AdminLayout";

// Pages
const Dashboard = lazy(() => import("../../pages/admin/Dashboard"));
const Reports = lazy(() => import("../../pages/admin/Reports"));
const Company = lazy(() => import("../../pages/admin/Company"));
const CompanyReports = lazy(() => import("../../pages/admin/company/CompanyReports"));
const CompanyExpenses = lazy(() => import("../../pages/admin/company/CompanyExpenses"));
const Sales = lazy(() => import("../../pages/admin/Sales"));
const Partners = lazy(() => import("../../pages/admin/Partners"));
const PartnerClients = lazy(() => import("../../pages/admin/PartnerClients"));
const Support = lazy(() => import("../../pages/admin/Support"));
const Payments = lazy(() => import("../../pages/admin/Payments"));
const Settings = lazy(() => import("../../pages/admin/Settings"));

// Client Pages
const ClientsList = lazy(() => import("../../pages/admin/Clients"));
const ClientDetails = lazy(() => import("../../pages/clients/ClientDetails"));
const ClientNew = lazy(() => import("../../pages/clients/NewClient"));

// Sales Pages
const SalesDetails = lazy(() => import("../../pages/sales/SaleDetails"));
const SalesNew = lazy(() => import("../../pages/sales/NewSale"));
const SalesImport = lazy(() => import("../../pages/sales/Sales"));

// Partner Pages
const PartnerDetails = lazy(() => import("../../pages/partners/PartnerDetails"));
const PartnerNew = lazy(() => import("../../pages/partners/NewPartner"));

// Payment Pages
const PaymentDetails = lazy(() => import("../../pages/payments/Payments"));
const PaymentNew = lazy(() => import("../../pages/payments/Payments"));

// Other Pages
const Logistics = lazy(() => import("../../pages/logistics/Dashboard"));

export const adminRoutes = (
  <Route path={PATHS.ADMIN.ROOT} element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    
    {/* Clients */}
    <Route path="clients">
      <Route index element={<ClientsList />} />
      <Route path=":id" element={<ClientDetails />} />
      <Route path="new" element={<ClientNew />} />
    </Route>
    
    {/* Company (anteriormente Reports) */}
    <Route path="company">
      <Route index element={<Company />} />
      <Route path="reports" element={<CompanyReports />} />
      <Route path="expenses" element={<CompanyExpenses />} />
    </Route>
    
    {/* Mantém a rota antiga para compatibilidade */}
    <Route path="reports" element={<Reports />} />
    
    {/* Sales */}
    <Route path="sales">
      <Route index element={<Sales />} />
      <Route path=":id" element={<SalesDetails />} />
      <Route path="new" element={<SalesNew />} />
      <Route path="import" element={<SalesImport />} />
    </Route>
    
    {/* Partners */}
    <Route path="partners">
      <Route index element={<Partners />} />
      <Route path="clients" element={<PartnerClients />} />
      <Route path=":id" element={<PartnerDetails />} />
      <Route path="new" element={<PartnerNew />} />
    </Route>
    
    {/* Payments */}
    <Route path="payments">
      <Route index element={<Payments />} />
      <Route path=":id" element={<PaymentDetails />} />
      <Route path="new" element={<PaymentNew />} />
    </Route>
    
    {/* Others */}
    <Route path="support" element={<Support />} />
    <Route path="settings" element={<Settings />} />
    <Route path="logistics" element={<Logistics />} />
  </Route>
);
