
import React from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

// Import pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import ClientDetails from "@/pages/admin/ClientDetails";
import NewClient from "@/pages/admin/NewClient";
import AdminPartners from "@/pages/admin/Partners";
import PartnerDetails from "@/pages/partners/PartnerDetails";
import NewPartner from "@/pages/admin/NewPartner";
import AdminPartnerClients from "@/pages/admin/PartnerClients";
import AdminPayments from "@/pages/admin/Payments";
import AdminSales from "@/pages/admin/Sales";
import NewSale from "@/pages/sales/NewSale";
import SaleDetails from "@/pages/sales/SaleDetails";
import AdminMachines from "@/pages/admin/Machines";
import AdminSettings from "@/pages/admin/Settings";
import AdminSupport from "@/pages/admin/Support";

const AdminRoutes = () => {
  return (
    <RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.FINANCIAL, UserRole.LOGISTICS]}>
      <Routes>
        <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminDashboard />} />
        <Route path={PATHS.ADMIN.CLIENTS} element={<AdminClients />} />
        <Route path={PATHS.ADMIN.CLIENT_DETAILS()} element={<ClientDetails />} />
        <Route path={PATHS.ADMIN.CLIENT_NEW} element={<NewClient />} />
        <Route path={PATHS.ADMIN.PARTNERS} element={<AdminPartners />} />
        <Route path={PATHS.ADMIN.PARTNER_DETAILS()} element={<PartnerDetails />} />
        <Route path={PATHS.ADMIN.PARTNER_NEW} element={<NewPartner />} />
        <Route path={PATHS.ADMIN.PARTNER_CLIENTS} element={<AdminPartnerClients />} />
        <Route path={PATHS.ADMIN.PAYMENTS} element={<AdminPayments />} />
        <Route path={PATHS.ADMIN.SALES} element={<AdminSales />} />
        <Route path={PATHS.ADMIN.SALES_NEW} element={<NewSale />} />
        <Route path={PATHS.ADMIN.SALE_DETAILS()} element={<SaleDetails />} />
        <Route path={PATHS.ADMIN.MACHINES} element={<AdminMachines />} />
        <Route path={PATHS.ADMIN.SETTINGS} element={<AdminSettings />} />
        <Route path={PATHS.ADMIN.SUPPORT} element={<AdminSupport />} />
      </Routes>
    </RequireAuth>
  );
};

export default AdminRoutes;
