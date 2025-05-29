
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"

import Login from "@/pages/auth/Login";
import AuthCallback from "@/pages/AuthCallback";
import AppLayout from "@/components/layout/AppLayout";
import AuthGuard from "@/components/auth/AuthGuard";

// Client Routes
import ClientDashboard from "@/pages/client/Dashboard";
import ClientMachines from "@/pages/client/Machines";
import ClientPayments from "@/pages/client/Payments";
import ClientSupport from "@/pages/client/Support";

// User Routes
import UserDashboard from "@/pages/user/Dashboard";
import UserMachines from "@/pages/user/Machines";
import UserPayments from "@/pages/user/Payments";
import UserSupport from "@/pages/user/Support";

// Partner Routes
import PartnerDashboard from "@/pages/partner/Dashboard";
import PartnerClients from "@/pages/partner/Clients";
import PartnerCommissions from "@/pages/partner/Commissions";

// Admin Routes
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import AdminMachines from "@/pages/admin/Machines";
import AdminPartners from "@/pages/admin/Partners";
import AdminSales from "@/pages/admin/Sales";
import AdminPayments from "@/pages/admin/Payments";
import AdminSupport from "@/pages/admin/Support";
import AdminReports from "@/pages/admin/Reports";
import AdminSettings from "@/pages/admin/Settings";

// Logistics Routes
import LogisticsDashboard from "@/pages/logistics/Dashboard";
import LogisticsMachines from "@/pages/logistics/Machines";
import LogisticsSupport from "@/pages/logistics/Support";
import LogisticsReports from "@/pages/logistics/Reports";

// Common Routes
import Support from "@/pages/Support";
import HelpPage from "@/pages/Help";
import Settings from "@/pages/Settings";
import Profile from "@/pages/client/Profile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          
          {/* Client Routes */}
          <Route path="/client/*" element={
            <AuthGuard allowedRoles={['CLIENT']}>
              <AppLayout />
            </AuthGuard>
          }>
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="machines" element={<ClientMachines />} />
            <Route path="payments" element={<ClientPayments />} />
            <Route path="support" element={<ClientSupport />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* User Routes */}
          <Route path="/user/*" element={
            <AuthGuard allowedRoles={['CLIENT']}>
              <AppLayout />
            </AuthGuard>
          }>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="machines" element={<UserMachines />} />
            <Route path="payments" element={<UserPayments />} />
            <Route path="support" element={<UserSupport />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Partner Routes */}
          <Route path="/partner/*" element={
            <AuthGuard allowedRoles={['PARTNER']}>
              <AppLayout />
            </AuthGuard>
          }>
            <Route path="dashboard" element={<PartnerDashboard />} />
            <Route path="clients" element={<PartnerClients />} />
            <Route path="commissions" element={<PartnerCommissions />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AuthGuard allowedRoles={['ADMIN']}>
              <AppLayout />
            </AuthGuard>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="machines" element={<AdminMachines />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="sales" element={<AdminSales />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Logistics Routes */}
          <Route path="/logistics/*" element={
            <AuthGuard allowedRoles={['LOGISTICS']}>
              <AppLayout />
            </AuthGuard>
          }>
            <Route path="dashboard" element={<LogisticsDashboard />} />
            <Route path="machines" element={<LogisticsMachines />} />
            <Route path="support" element={<LogisticsSupport />} />
            <Route path="reports" element={<LogisticsReports />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/support" element={<Support />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
