import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import UserLayout from "@/layouts/UserLayout";
import PartnerLayout from "@/layouts/PartnerLayout";
import FinancialLayout from "@/layouts/FinancialLayout";
import LogisticsLayout from "@/layouts/LogisticsLayout";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import NewClient from "@/pages/admin/NewClient";
import ClientDetails from "@/pages/admin/ClientDetails";
import AdminPartners from "@/pages/admin/Partners";
import AdminSales from "@/pages/admin/Sales";
import AdminPayments from "@/pages/admin/Payments";
import AdminFees from "@/pages/admin/Fees";
import AdminReports from "@/pages/admin/Reports";
import AdminMachines from "@/pages/admin/Machines";
import AdminNotifications from "@/pages/admin/Notifications";

// User Pages
import UserDashboard from "@/pages/user/Dashboard";
import UserPayments from "@/pages/user/Payments";
import UserMachines from "@/pages/user/Machines";
import UserSupport from "@/pages/user/Support";

// Partner Pages
import PartnerDashboard from "@/pages/partner/Dashboard";
import PartnerClients from "@/pages/partner/Clients";
import PartnerSettings from "@/pages/partner/Settings";
import PartnerCommissions from "@/pages/partner/Commissions";

// Financial Pages
import FinancialDashboard from "@/pages/financial/Dashboard";
import FinancialRequests from "@/pages/financial/Requests";
import FinancialReports from "@/pages/financial/Reports";

// Logistics Pages
import LogisticsDashboard from "@/pages/logistics/Dashboard";
import LogisticsMachines from "@/pages/logistics/Machines";
import LogisticsOperations from "@/pages/logistics/Operations";
import LogisticsSupport from "@/pages/logistics/Support";

// Settings Pages
import Settings from "@/pages/settings/Settings";
import UserManagement from "@/pages/settings/UserManagement";

// Other Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// App and App CSS
import "./App.css";

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to appropriate dashboard based on user role
  useEffect(() => {
    if (user && location.pathname === "/") {
      // Redirect based on user role
      // You'll need to get the user's role from your auth context
      const userRole = user.role;

      switch (userRole) {
        case UserRole.ADMIN:
          navigate(PATHS.ADMIN.DASHBOARD);
          break;
        case UserRole.CLIENT:
          navigate(PATHS.USER.DASHBOARD);
          break;
        case UserRole.PARTNER:
          navigate(PATHS.PARTNER.DASHBOARD);
          break;
        case UserRole.FINANCIAL:
          navigate(PATHS.FINANCIAL.DASHBOARD);
          break;
        case UserRole.LOGISTICS:
          navigate(PATHS.LOGISTICS.DASHBOARD);
          break;
        default:
          navigate(PATHS.USER.DASHBOARD);
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="sigmapay-theme">
      <Routes>
        {/* Public routes */}
        <Route path={PATHS.HOME} element={<Index />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path={PATHS.AUTH.LOGIN} element={<Login />} />
          <Route path={PATHS.AUTH.REGISTER} element={<Register />} />
          <Route path={PATHS.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={PATHS.AUTH.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>

        {/* Admin routes */}
        <Route
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path={PATHS.ADMIN.DASHBOARD} element={<AdminDashboard />} />
          <Route path={PATHS.ADMIN.CLIENTS} element={<AdminClients />} />
          <Route path={PATHS.ADMIN.CLIENT_NEW} element={<NewClient />} />
          <Route path={PATHS.ADMIN.CLIENT_DETAILS()} element={<ClientDetails />} />
          <Route path={PATHS.ADMIN.PARTNERS} element={<AdminPartners />} />
          <Route path={PATHS.ADMIN.SALES} element={<AdminSales />} />
          <Route path={PATHS.ADMIN.PAYMENTS} element={<AdminPayments />} />
          <Route path={PATHS.ADMIN.FEES} element={<AdminFees />} />
          <Route path={PATHS.ADMIN.REPORTS} element={<AdminReports />} />
          <Route path={PATHS.ADMIN.MACHINES} element={<AdminMachines />} />
          <Route path={PATHS.ADMIN.NOTIFICATIONS} element={<AdminNotifications />} />
          <Route path={PATHS.ADMIN.SETTINGS} element={<Settings />} />
          <Route path={PATHS.ADMIN.USER_MANAGEMENT} element={<UserManagement />} />
        </Route>

        {/* User routes */}
        <Route
          element={
            <RequireAuth allowedRoles={[UserRole.CLIENT]}>
              <UserLayout />
            </RequireAuth>
          }
        >
          <Route path={PATHS.USER.DASHBOARD} element={<UserDashboard />} />
          <Route path={PATHS.USER.PAYMENTS} element={<UserPayments />} />
          <Route path={PATHS.USER.MACHINES} element={<UserMachines />} />
          <Route path={PATHS.USER.SUPPORT} element={<UserSupport />} />
          <Route path={PATHS.USER.SETTINGS} element={<Settings />} />
        </Route>

        {/* Partner routes */}
        <Route
          element={
            <RequireAuth allowedRoles={[UserRole.PARTNER]}>
              <PartnerLayout />
            </RequireAuth>
          }
        >
          <Route path={PATHS.PARTNER.DASHBOARD} element={<PartnerDashboard />} />
          <Route path={PATHS.PARTNER.CLIENTS} element={<PartnerClients />} />
          <Route path={PATHS.PARTNER.COMMISSIONS} element={<PartnerCommissions />} />
          <Route path={PATHS.PARTNER.SETTINGS} element={<PartnerSettings />} />
        </Route>

        {/* Financial routes */}
        <Route
          element={
            <RequireAuth allowedRoles={[UserRole.FINANCIAL]}>
              <FinancialLayout />
            </RequireAuth>
          }
        >
          <Route path={PATHS.FINANCIAL.DASHBOARD} element={<FinancialDashboard />} />
          <Route path={PATHS.FINANCIAL.REQUESTS} element={<FinancialRequests />} />
          <Route path={PATHS.FINANCIAL.REPORTS} element={<FinancialReports />} />
          <Route path={PATHS.FINANCIAL.SETTINGS} element={<Settings />} />
        </Route>

        {/* Logistics routes */}
        <Route
          element={
            <RequireAuth allowedRoles={[UserRole.LOGISTICS]}>
              <LogisticsLayout />
            </RequireAuth>
          }
        >
          <Route path={PATHS.LOGISTICS.DASHBOARD} element={<LogisticsDashboard />} />
          <Route path={PATHS.LOGISTICS.MACHINES} element={<LogisticsMachines />} />
          <Route path={PATHS.LOGISTICS.LOGISTICS_MODULE} element={<LogisticsOperations />} />
          <Route path={PATHS.LOGISTICS.SUPPORT} element={<LogisticsSupport />} />
          <Route path={PATHS.LOGISTICS.SETTINGS} element={<Settings />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
