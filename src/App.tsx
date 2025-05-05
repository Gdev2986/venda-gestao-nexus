import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/use-auth";
import { UserRole } from "./types";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminClients from "./pages/admin/Clients";
import ClientDetails from "./pages/admin/ClientDetails";
import AdminPartners from "./pages/admin/Partners";
import PartnerDetails from "./pages/admin/PartnerDetails";
import AdminSales from "./pages/admin/Sales";
import SaleDetails from "./pages/admin/SaleDetails";
import AdminMachines from "./pages/admin/Machines";
import MachineDetails from "./pages/admin/MachineDetails";
import AdminFees from "./pages/admin/Fees";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import ClientDashboard from "./pages/client/Dashboard";
import ClientMachines from "./pages/client/Machines";
import ClientMachineDetails from "./pages/client/MachineDetails";
import ClientPayments from "./pages/client/Payments";
import ClientPaymentDetails from "./pages/client/PaymentDetails";
import ClientSupport from "./pages/client/Support";
import ClientSettings from "./pages/client/Settings";
import PartnerDashboard from "./pages/partner/Dashboard";
import PartnerClients from "./pages/partner/Clients";
import PartnerClientDetails from "./pages/partner/ClientDetails";
import PartnerCommissions from "./pages/partner/Commissions";
import PartnerSettings from "./pages/partner/Settings";
import FinancialDashboard from "./pages/financial/Dashboard";
import FinancialRequests from "./pages/financial/Requests";
import FinancialRequestDetails from "./pages/financial/RequestDetails";
import FinancialReports from "./pages/financial/Reports";
import LogisticsDashboard from "./pages/logistics/Dashboard";
import LogisticsMachines from "./pages/logistics/Machines";
import LogisticsOperations from "./pages/logistics/Operations";
import LogisticsSupport from "./pages/logistics/Support";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import CreateClient from "./pages/admin/CreateClient";
import CreatePartner from "./pages/admin/CreatePartner";
import CreateMachine from "./pages/admin/CreateMachine";
import UserManagement from "./pages/admin/UserManagement";

// Import our new payment pages
import AdminPayments from "./pages/admin/Payments";
import PaymentDetails from "./pages/admin/PaymentDetails";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <div>Unauthorized</div>;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.CLIENT, UserRole.PARTNER, UserRole.FINANCIAL, UserRole.LOGISTICS]}>
            <Dashboard />
          </RequireAuth>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="clients"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminClients />
            </RequireAuth>
          }
        />
        <Route
          path="clients/:id"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <ClientDetails />
            </RequireAuth>
          }
        />
        <Route
          path="clients/new"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <CreateClient />
            </RequireAuth>
          }
        />
        <Route
          path="partners"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminPartners />
            </RequireAuth>
          }
        />
        <Route
          path="partners/:id"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <PartnerDetails />
            </RequireAuth>
          }
        />
        <Route
          path="partners/new"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <CreatePartner />
            </RequireAuth>
          }
        />
        <Route
          path="sales"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminSales />
            </RequireAuth>
          }
        />
        <Route
          path="sales/:id"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <SaleDetails />
            </RequireAuth>
          }
        />
        <Route
          path="machines"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminMachines />
            </RequireAuth>
          }
        />
        <Route
          path="machines/:id"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <MachineDetails />
            </RequireAuth>
          }
        />
        <Route
          path="machines/new"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <CreateMachine />
            </RequireAuth>
          }
        />
        <Route
          path="fees"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminFees />
            </RequireAuth>
          }
        />
        <Route
          path="reports"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminReports />
            </RequireAuth>
          }
        />
        <Route
          path="settings"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <AdminSettings />
            </RequireAuth>
          }
        />
         <Route
          path="settings/users"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN]}>
              <UserManagement />
            </RequireAuth>
          }
        />
        
        {/* Payment Management Routes */}
        <Route
          path="payments"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.FINANCIAL]}>
              <AdminPayments />
            </RequireAuth>
          }
        />
        <Route
          path="payments/:id"
          element={
            <RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.FINANCIAL]}>
              <PaymentDetails />
            </RequireAuth>
          }
        />
      </Route>

      {/* Client Routes */}
      <Route path="/client" element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={
            <RequireAuth allowedRoles={[UserRole.CLIENT]}>
              <ClientDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="machines"
          element={
            <RequireAuth allowedRoles={[UserRole.CLIENT]}>
              <ClientMachines />
            </RequireAuth>
          }
        />
        <Route
          path="machines/:id"
          element={
            <RequireAuth allowedRoles={[UserRole.CLIENT]}>
              <ClientMachineDetails />
            </RequireAuth>
          }
        />
        <Route
          path="payments"
          element={
            <RequireAuth allowedRoles={[UserRole.CLIENT]}>
              <ClientPayments />
            </RequireAuth>
          }
        />
        <Route
          path="payments/:id"
          element={
            <RequireAuth allowedRoles={[UserRole.CLIENT]}>
              <ClientPaymentDetails />
            </RequireAuth>
          }
        />
        <Route
          path="support"
          element={
            <RequireAuth allowedRoles={[UserRole.CLIENT]}>
              <ClientSupport />
            </RequireAuth>
          }
        />
        <Route
          path="settings"
          element={
            <RequireAuth allowedRoles={[UserRole.CLIENT]}>
              <ClientSettings />
            </RequireAuth>
          }
        />
      </Route>

      {/* Partner Routes */}
      <Route path="/partner" element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={
            <RequireAuth allowedRoles={[UserRole.PARTNER]}>
              <PartnerDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="clients"
          element={
            <RequireAuth allowedRoles={[UserRole.PARTNER]}>
              <PartnerClients />
            </RequireAuth>
          }
        />
        <Route
          path="clients/:id"
          element={
            <RequireAuth allowedRoles={[UserRole.PARTNER]}>
              <PartnerClientDetails />
            </RequireAuth>
          }
        />
        <Route
          path="commissions"
          element={
            <RequireAuth allowedRoles={[UserRole.PARTNER]}>
              <PartnerCommissions />
            </RequireAuth>
          }
        />
        <Route
          path="settings"
          element={
            <RequireAuth allowedRoles={[UserRole.PARTNER]}>
              <PartnerSettings />
            </RequireAuth>
          }
        />
      </Route>

      {/* Financial Routes */}
      <Route path="/financial" element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={
            <RequireAuth allowedRoles={[UserRole.FINANCIAL]}>
              <FinancialDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="requests"
          element={
            <RequireAuth allowedRoles={[UserRole.FINANCIAL]}>
              <FinancialRequests />
            </RequireAuth>
          }
        />
        <Route
          path="requests/:id"
          element={
            <RequireAuth allowedRoles={[UserRole.FINANCIAL]}>
              <FinancialRequestDetails />
            </RequireAuth>
          }
        />
        <Route
          path="reports"
          element={
            <RequireAuth allowedRoles={[UserRole.FINANCIAL]}>
              <FinancialReports />
            </RequireAuth>
          }
        />
      </Route>

      {/* Logistics Routes */}
      <Route path="/logistics" element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={
            <RequireAuth allowedRoles={[UserRole.LOGISTICS]}>
              <LogisticsDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="machines"
          element={
            <RequireAuth allowedRoles={[UserRole.LOGISTICS]}>
              <LogisticsMachines />
            </RequireAuth>
          }
        />
        <Route
          path="operations"
          element={
            <RequireAuth allowedRoles={[UserRole.LOGISTICS]}>
              <LogisticsOperations />
            </RequireAuth>
          }
        />
        <Route
          path="support"
          element={
            <RequireAuth allowedRoles={[UserRole.LOGISTICS]}>
              <LogisticsSupport />
            </RequireAuth>
          }
        />
      </Route>

      {/* Settings and Payments Routes */}
      <Route path="/settings" element={<RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.CLIENT, UserRole.PARTNER]}>
        <Settings />
      </RequireAuth>} />
      <Route path="/payments" element={<RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.CLIENT, UserRole.PARTNER]}>
        <Payments />
      </RequireAuth>} />
    </Routes>
  );
}

export default App;
