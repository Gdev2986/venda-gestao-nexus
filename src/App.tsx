
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "./components/ui/spinner";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import RootLayout from "./layouts/RootLayout";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

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
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));

// Error Pages
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/NotFound"));

// Import admin routes
import { adminRoutes } from "./routes/adminRoutes";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* Auth routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            
            {/* Main Layout for regular pages */}
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
            
            {/* Admin Layout with Admin Routes */}
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="notifications" element={<AdminNotifications />} />
              {/* Include all admin routes */}
              {adminRoutes}
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
