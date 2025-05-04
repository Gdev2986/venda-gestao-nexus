
import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Settings from './pages/settings/Settings';
import UserDashboard from './pages/user/Dashboard';
import UserMachines from './pages/user/Machines';
import UserPayments from './pages/user/Payments';
import UserSupport from './pages/user/Support';
import AdminDashboard from './pages/admin/Dashboard';
import AdminClients from './pages/admin/Clients';
import AdminMachines from './pages/admin/Machines';
import AdminPartners from './pages/admin/Partners';
import AdminNotifications from './pages/admin/Notifications';
import AdminPayments from './pages/admin/Payments';
import AdminReports from './pages/admin/Reports';
import AdminSales from './pages/admin/Sales';
import AdminFees from './pages/admin/Fees';
import PartnerDashboard from './pages/partner/Dashboard';
import PartnerClients from './pages/partner/Clients';
import PartnerCommissions from './pages/partner/Commissions';
import PartnerSettings from './pages/partner/Settings';
import FinancialDashboard from './pages/financial/Dashboard';
import FinancialReports from './pages/financial/Reports';
import FinancialRequests from './pages/financial/Requests';
import LogisticsDashboard from './pages/logistics/Dashboard';
import LogisticsMachines from './pages/logistics/Machines';
import LogisticsOperations from './pages/logistics/Operations';
import LogisticsSupport from './pages/logistics/Support';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RequireAuth from './components/auth/RequireAuth';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import PartnerLayout from './layouts/PartnerLayout';
import FinancialLayout from './layouts/FinancialLayout';
import LogisticsLayout from './layouts/LogisticsLayout';
import { UserRole } from './types';
import ClientNew from './pages/admin/ClientNew';
import ClientDetails from './pages/admin/ClientDetails';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes for all authenticated users */}
        <Route element={<RequireAuth />}>
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* User routes */}
        <Route element={<RequireAuth allowedRoles={[UserRole.CLIENT]} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/machines" element={<UserMachines />} />
            <Route path="/user/payments" element={<UserPayments />} />
            <Route path="/user/support" element={<UserSupport />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<RequireAuth allowedRoles={[UserRole.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/clients/new" element={<ClientNew />} />
            <Route path="/admin/clients/:id" element={<ClientDetails />} />
            <Route path="/admin/machines" element={<AdminMachines />} />
            <Route path="/admin/partners" element={<AdminPartners />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/sales" element={<AdminSales />} />
            <Route path="/admin/fees" element={<AdminFees />} />
            <Route path="/admin/settings/users" element={<UserManagement />} />
          </Route>
        </Route>
        
        {/* Partner routes */}
        <Route element={<RequireAuth allowedRoles={[UserRole.PARTNER]} />}>
          <Route element={<PartnerLayout />}>
            <Route path="/partner/dashboard" element={<PartnerDashboard />} />
            <Route path="/partner/clients" element={<PartnerClients />} />
            <Route path="/partner/commissions" element={<PartnerCommissions />} />
            <Route path="/partner/settings" element={<PartnerSettings />} />
          </Route>
        </Route>
        
        {/* Financial routes */}
        <Route element={<RequireAuth allowedRoles={[UserRole.FINANCIAL]} />}>
          <Route element={<FinancialLayout />}>
            <Route path="/financial/dashboard" element={<FinancialDashboard />} />
            <Route path="/financial/reports" element={<FinancialReports />} />
            <Route path="/financial/requests" element={<FinancialRequests />} />
          </Route>
        </Route>
        
        {/* Logistics routes */}
        <Route element={<RequireAuth allowedRoles={[UserRole.LOGISTICS]} />}>
          <Route element={<LogisticsLayout />}>
            <Route path="/logistics/dashboard" element={<LogisticsDashboard />} />
            <Route path="/logistics/machines" element={<LogisticsMachines />} />
            <Route path="/logistics/operations" element={<LogisticsOperations />} />
            <Route path="/logistics/support" element={<LogisticsSupport />} />
          </Route>
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
