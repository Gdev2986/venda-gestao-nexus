
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "./components/ui/spinner";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import RootLayout from "./layouts/RootLayout";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import LogisticsLayout from "./layouts/LogisticsLayout";
import PartnerLayout from "./layouts/PartnerLayout"; // Adicionado import do PartnerLayout
import RequireAuth from "@/components/auth/RequireAuth";
import { UserRole } from "@/types";

// Route imports
const Home = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Profile = lazy(() => import("./pages/Settings"));
const Clients = lazy(() => import("./pages/Clients"));
const Sales = lazy(() => import("./pages/Sales"));
const Partners = lazy(() => import("./pages/Partners"));
const NotificationsPage = lazy(() => import("./pages/Notifications"));
const Payments = lazy(() => import("./pages/Payments"));
const PixKeys = lazy(() => import("./pages/settings/Settings"));

// Admin Routes
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));

// Client Routes
const ClientDashboard = lazy(() => import("./pages/user/Dashboard"));
const UserMachines = lazy(() => import("./pages/user/Machines"));
const UserPayments = lazy(() => import("./pages/user/Payments"));
const UserSettings = lazy(() => import("./pages/user/Settings"));
const UserSupport = lazy(() => import("./pages/user/Support"));

// Partner Routes
const PartnerDashboard = lazy(() => import("./pages/partner/Dashboard"));

// Error Pages
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/NotFound"));

// Import admin routes
import { adminRoutes } from "./routes/adminRoutes";
// Import logistics routes
import { logisticsMainRoutes } from "./routes/admin/logisticsRoutes";
// Import partner routes
import { PartnerRoutes } from "./routes/partnerRoutes";
// Import client routes
import { ClientRoutes } from "./routes/clientRoutes";
// Import financial routes
import { FinancialRoutes } from "./routes/financialRoutes";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* Auth routes - public */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            
            {/* Main Layout for regular pages - requires authentication */}
            <Route element={<RequireAuth />}>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="clients" element={<Clients />} />
                <Route path="sales" element={<Sales />} />
                <Route path="partners" element={<Partners />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="payments" element={<Payments />} />
                <Route path="pix-keys" element={<PixKeys />} />
              </Route>
            </Route>
            
            {/* Admin Layout with Admin Routes - requires admin role */}
            <Route 
              element={
                <RequireAuth 
                  allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]} 
                  redirectTo="/unauthorized"
                />
              }
            >
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                {adminRoutes}
              </Route>
            </Route>

            {/* Client Routes */}
            {ClientRoutes}

            {/* Partner Routes */}
            {PartnerRoutes}

            {/* Financial Routes */}
            {FinancialRoutes}

            {/* Logistics Layout with Logistics Routes - requires logistics role */}
            <Route 
              element={
                <RequireAuth 
                  allowedRoles={[UserRole.LOGISTICS, UserRole.ADMIN]} 
                  redirectTo="/unauthorized"
                />
              }
            >
              <Route path="logistics" element={<LogisticsLayout />}>
                {logisticsMainRoutes}
              </Route>
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
