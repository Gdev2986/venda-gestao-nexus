import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { PATHS } from "./routes/paths";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "./hooks/use-user-role";
import { UserRole } from "./types";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import RootLayout from "./layouts/RootLayout";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Auth Protection Component
import RequireAuth from "./components/auth/RequireAuth";

// Dashboard
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminClients from "./pages/admin/Clients";
import AdminSales from "./pages/admin/Sales";
import AdminPartners from "./pages/admin/Partners";

// Clients
import Clients from "./pages/clients/Clients";
import ClientDetails from "./pages/clients/ClientDetails";
import NewClient from "./pages/clients/NewClient";

// Machines
import Machines from "./pages/machines/Machines";
import MachineDetails from "./pages/machines/MachineDetails";
import NewMachine from "./pages/machines/NewMachine";

// Sales
import Sales from "./pages/sales/Sales";
import SaleDetails from "./pages/sales/SaleDetails";
import NewSale from "./pages/sales/NewSale";

// Payments
import Payments from "./pages/payments/Payments";
import UserPayments from "./pages/UserPayments";

// Partners
import Partners from "./pages/partners/Partners";
import PartnerDetails from "./pages/partners/PartnerDetails";
import NewPartner from "./pages/partners/NewPartner";

// Settings
import Settings from "./pages/settings/Settings";
import UserManagement from "./pages/settings/UserManagement";

// Other
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import Help from "./pages/Help";
import Fees from "./pages/Fees";
import Reports from "./pages/Reports";

function App() {
  const location = useLocation();
  const { userRole, isRoleLoading } = useUserRole();
  const { toast } = useToast();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Log role changes for debugging
  useEffect(() => {
    if (!isRoleLoading) {
      console.log("Current user role:", userRole);
    }
  }, [userRole, isRoleLoading]);

  // Role-based route access function
  const canAccessRoute = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(userRole) || userRole === UserRole.ADMIN;
  };

  return (
    <Routes>
      {/* Root path handling */}
      <Route path={PATHS.HOME} element={<RootLayout />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
        <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<MainLayout />}>
          {/* Admin Routes */}
          <Route
            path={PATHS.ADMIN.DASHBOARD}
            element={<AdminDashboard />}
          />
          
          <Route 
            path={PATHS.ADMIN.CLIENTS} 
            element={<AdminClients />} 
          />
          
          <Route 
            path={PATHS.ADMIN.CLIENT_DETAILS()} 
            element={<ClientDetails />} 
          />
          
          <Route 
            path={PATHS.ADMIN.CLIENT_NEW} 
            element={<NewClient />} 
          />
          
          <Route 
            path={PATHS.ADMIN.MACHINES} 
            element={<Machines />} 
          />
          
          <Route 
            path={PATHS.ADMIN.MACHINE_DETAILS()} 
            element={<MachineDetails />} 
          />
          
          <Route 
            path={PATHS.ADMIN.MACHINE_NEW} 
            element={<NewMachine />} 
          />
          
          <Route 
            path={PATHS.ADMIN.SALES} 
            element={<AdminSales />} 
          />
          
          <Route 
            path={PATHS.ADMIN.SALES_DETAILS()} 
            element={<SaleDetails />} 
          />
          
          <Route 
            path={PATHS.ADMIN.SALES_NEW} 
            element={<NewSale />} 
          />
          
          <Route 
            path={PATHS.ADMIN.PAYMENTS} 
            element={<Payments />} 
          />
          
          <Route 
            path={PATHS.ADMIN.PAYMENT_DETAILS()} 
            element={<Payments />} 
          />
          
          <Route path={PATHS.ADMIN.PAYMENT_NEW} element={<Payments />} />
          
          <Route 
            path={PATHS.ADMIN.PARTNERS} 
            element={<AdminPartners />} 
          />
          
          <Route 
            path={PATHS.ADMIN.PARTNER_DETAILS()} 
            element={<PartnerDetails />} 
          />
          
          <Route 
            path={PATHS.ADMIN.PARTNER_NEW} 
            element={<NewPartner />} 
          />
          
          <Route 
            path={PATHS.ADMIN.LOGISTICS} 
            element={
              <div className="container mx-auto py-10">
                <h1 className="text-3xl font-semibold mb-6">Módulo de Logística</h1>
                <p className="text-gray-600">Esta funcionalidade está em desenvolvimento.</p>
              </div> 
            } 
          />
          
          <Route path={PATHS.ADMIN.SETTINGS} element={<Settings />} />
          
          <Route 
            path={PATHS.ADMIN.USER_MANAGEMENT} 
            element={<UserManagement />} 
          />
          
          <Route path={PATHS.ADMIN.FEES} element={<Fees />} />
          
          <Route path={PATHS.ADMIN.REPORTS} element={<Reports />} />
          
          <Route path={PATHS.ADMIN.SUPPORT} element={<Support />} />
          
          <Route path={PATHS.ADMIN.HELP} element={<Help />} />
          
          {/* User Routes */}
          <Route 
            path={PATHS.USER.DASHBOARD} 
            element={<ClientDashboard />} 
          />
          
          <Route path={PATHS.USER.PAYMENTS} element={<UserPayments />} />
          
          <Route path={PATHS.USER.SUPPORT} element={<Support />} />
          
          <Route path={PATHS.USER.SETTINGS} element={<Settings />} />
          
          <Route path={PATHS.USER.HELP} element={<Help />} />
          
          {/* Partner Routes */}
          <Route 
            path={PATHS.PARTNER.DASHBOARD} 
            element={
              canAccessRoute([UserRole.PARTNER])
                ? <Dashboard /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.PARTNER.CLIENTS} 
            element={
              canAccessRoute([UserRole.PARTNER])
                ? <Clients /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.PARTNER.CLIENT_DETAILS()} 
            element={
              canAccessRoute([UserRole.PARTNER])
                ? <ClientDetails /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.PARTNER.SALES} 
            element={
              canAccessRoute([UserRole.PARTNER])
                ? <Sales /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.PARTNER.REPORTS} 
            element={
              canAccessRoute([UserRole.PARTNER])
                ? <Reports /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.PARTNER.SETTINGS} 
            element={
              canAccessRoute([UserRole.PARTNER])
                ? <Settings /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.PARTNER.SUPPORT} 
            element={
              canAccessRoute([UserRole.PARTNER])
                ? <Support /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.PARTNER.HELP} 
            element={
              canAccessRoute([UserRole.PARTNER])
                ? <Help /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          {/* Financial Routes */}
          <Route 
            path={PATHS.FINANCIAL.DASHBOARD} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <Dashboard /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.FINANCIAL.CLIENTS} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <Clients /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.FINANCIAL.CLIENT_DETAILS()} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <ClientDetails /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.FINANCIAL.SALES} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <Sales /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.FINANCIAL.PAYMENTS} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <Payments /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.FINANCIAL.PARTNERS} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <Partners /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.FINANCIAL.FEES} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <Fees /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.FINANCIAL.REPORTS} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <Reports /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.FINANCIAL.SUPPORT} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <Support /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.FINANCIAL.HELP} 
            element={
              canAccessRoute([UserRole.FINANCIAL])
                ? <Help /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          {/* Logistics Routes */}
          <Route 
            path={PATHS.LOGISTICS.DASHBOARD} 
            element={
              canAccessRoute([UserRole.LOGISTICS])
                ? <Dashboard /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.LOGISTICS.CLIENTS} 
            element={
              canAccessRoute([UserRole.LOGISTICS])
                ? <Clients /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.LOGISTICS.MACHINES} 
            element={
              canAccessRoute([UserRole.LOGISTICS])
                ? <Machines /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.LOGISTICS.SALES} 
            element={
              canAccessRoute([UserRole.LOGISTICS])
                ? <Sales /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.LOGISTICS.LOGISTICS_MODULE} 
            element={
              canAccessRoute([UserRole.LOGISTICS])
                ? <div className="container mx-auto py-10">
                    <h1 className="text-3xl font-semibold mb-6">Módulo de Logística</h1>
                    <p className="text-gray-600">Esta funcionalidade está em desenvolvimento.</p>
                  </div> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.LOGISTICS.SUPPORT} 
            element={
              canAccessRoute([UserRole.LOGISTICS])
                ? <Support /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.LOGISTICS.HELP} 
            element={
              canAccessRoute([UserRole.LOGISTICS])
                ? <Help /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
          
          <Route 
            path={PATHS.LOGISTICS.SETTINGS} 
            element={
              canAccessRoute([UserRole.LOGISTICS])
                ? <Settings /> 
                : <Navigate to={PATHS.USER.DASHBOARD} replace />
            } 
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}

export default App;
