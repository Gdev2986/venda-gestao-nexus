
import React from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";
import MainLayout from "@/layouts/MainLayout";

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
      <MainLayout>
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path={PATHS.ADMIN.CLIENT_DETAILS().replace('/admin/', '')} element={<ClientDetails />} />
          <Route path="clients/new" element={<NewClient />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path={PATHS.ADMIN.PARTNER_DETAILS().replace('/admin/', '')} element={<PartnerDetails />} />
          <Route path="partners/new" element={<NewPartner />} />
          <Route path="partners/:id/clients" element={<AdminPartnerClients />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="sales/new" element={<NewSale />} />
          <Route path={PATHS.ADMIN.SALES_DETAILS().replace('/admin/', '')} element={<SaleDetails />} />
          <Route path="machines" element={<AdminMachines />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="support" element={<AdminSupport />} />
        </Routes>
      </MainLayout>
    </RequireAuth>
  );
};

export default AdminRoutes;
